// Function to format numbers with commas
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Initialize variables
let customers = 0
let range1Price = 0
let range2Price = 0
let range3Price = 0
let range4Price = 0
const customersInRange = {
  range1Price: 0,
  range2Price: 0,
  range3Price: 0,
  range4Price: 0
}

// Helper function to update URL parameters
function updateUrlParams(key, value) {
  if ('URLSearchParams' in window) {
    var searchParams = new URLSearchParams(window.location.search)
    searchParams.set(key, value)
    var newRelativePathQuery =
      window.location.pathname + '?' + searchParams.toString()
    history.pushState(null, '', newRelativePathQuery)
  }
}

$(document).ready(function () {
  let estimatedCost = 0
  let finalPrice = 0
  let addonsCost = 0

  const elementToObserve = $('.lightbox-wrapper')[0]

  // Create a new MutationObserver instance
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      // Check if the display property is set to 'none'
      if ($(mutation.target).css('display') !== 'none') {
        updateUrlParams('breakdown', 'true')
      } else {
        updateUrlParams('breakdown', 'false')
      }
    }
  })

  observer.observe(elementToObserve, { attributes: true })

  // Function to update the addons cost and the UI
  function updateAddonsCost() {
    addonsCost = 0

    if ($('input[name="proGPT"]').prop('checked')) {
      addonsCost += 499
    }

    if ($('input[name="proAnalytics"]').prop('checked')) {
      addonsCost += 499
    }

    if ($('input[name="proData"]').prop('checked')) {
      addonsCost += 1499
    }

    $('.price-breakdown-total-cost-addons').text(numberWithCommas(addonsCost))
  }

  // Call the updateAddonsCost function initially to set the initial value
  updateAddonsCost()

  // Helper function to update block visibility and price
  function updateBlockVisibilityAndPrice(
    price,
    blockSelector,
    priceValueSelector,
    customersInRangeValue,
    customersInRangeKey
  ) {
    if (price > 0) {
      $(blockSelector).css('display', 'flex')
      $(priceValueSelector).text(numberWithCommas(price))
      $(customersInRangeValue).text(
        numberWithCommas(customersInRange[customersInRangeKey])
      )
    } else {
      $(blockSelector).hide()
    }
  }

  function joinWords(words) {
    if (!Array.isArray(words)) {
      throw new Error('The input must be an array of strings.');
    }
      
    // If there are two words, join them with "and"
    if (words.length === 2) {
      return words.join(' and ');
    } else {
      // If there are more than two words, join them with a comma, but the last one with "and"
      return words.slice(0, -1).join(', ') + (words.length > 1 ? ' and ' : '') + words[words.length - 1];
    }
  }

  // Function to update the price breakdown UI
  function updatePriceBreakdown() {
    // Calculate the price per range for each range
    const pricePerRange1 = range1Price
    const pricePerRange2 = range2Price
    const pricePerRange3 = range3Price
    const pricePerRange4 = range4Price
    const totalPriceWithoutAddons =
      pricePerRange1 + pricePerRange2 + pricePerRange3 + pricePerRange4

    $('.price-breakdown-selected-customers').text(numberWithCommas(customers || 250))
    $('.price-breakdown-total-cost-platform').text(
      numberWithCommas(totalPriceWithoutAddons)
    )
    $('.price-breakdown-total-cost').text(
      numberWithCommas(totalPriceWithoutAddons + addonsCost)
    )

    // Update the selected addons text
    const selectedAddonsSpan = $('.price-breakdown-selected-addons')
    const selectedAddonsArr = []
    
    $('input[name="proGPT"]').prop('checked') && selectedAddonsArr.push('proGPT')
    $('input[name="proAnalytics"]').prop('checked') && selectedAddonsArr.push('proAnalytics')
    $('input[name="proData"]').prop('checked') && selectedAddonsArr.push('proData')

    if (selectedAddonsArr.length > 1) {
      selectedAddonsSpan.text(joinWords(selectedAddonsArr) + ' add-ons')
    } else if (selectedAddonsArr.length > 0) {
      selectedAddonsSpan.text(selectedAddonsArr[0] + ' add-on')
    } else {
      selectedAddonsSpan.text('')
    }

    // Update the visibility and price values in the blocks
    updateBlockVisibilityAndPrice(
      pricePerRange1,
      '.is-2nd-block',
      '.price-2nd-block-cost-value',
      '.price-2nd-block-customer-value',
      'range1Price'
    )
    updateBlockVisibilityAndPrice(
      pricePerRange2,
      '.is-3rd-block',
      '.price-3rd-block-cost-value',
      '.price-3rd-block-customer-value',
      'range2Price'
    )
    updateBlockVisibilityAndPrice(
      pricePerRange3,
      '.is-4th-block',
      '.price-4th-block-cost-value',
      '.price-4th-block-customer-value',
      'range3Price'
    )
    updateBlockVisibilityAndPrice(
      pricePerRange4,
      '.is-5th-block',
      '.price-5th-block-cost-value',
      '.price-5th-block-customer-value',
      'range4Price'
    )
  }

  // Call the initial updatePriceBreakdown function
  updatePriceBreakdown()

  // Function to handle tooltip click
  function handleTooltipClick() {
    if ($(window).width() < 992) {
      $(this).next('.tooltip-text').fadeToggle('slow', 'linear')
    }
  }

  // Function to handle custom check click
  function handleCustomCheckClick() {
    if ($('.custom-check:checked').length === 0 && !this.checked) {
      this.checked = true
      return false
    } else {
      $(this).closest('label').toggleClass('active')
      return true
    }
  }

  // Event handlers for tooltip and custom check
  $('.tooltip-question').on('click', handleTooltipClick)
  $('.custom-check').on('click', handleCustomCheckClick)

  $('.pricing-addons-wrapper').ready(function () {
    const checkboxes = document.getElementsByClassName('selectable-check')
    var checkboxArray = Array.from(checkboxes)
    checkboxArray.forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        var selectedValues = []
        checkboxArray.forEach(function (checkbox) {
          if (checkbox.checked) {
            selectedValues.push(checkbox.value)
          }
        })
        var queryString = selectedValues.join(',')
        updateUrlParams('addons', queryString)
      })
    })

    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('addons')) {
      let params = searchParams
        .get('addons')
        .replace(/%20/g, ' ')
        .replace(/%2C/g, ',')
        .replace(/%27/g, "'")
        .split(',')
      params.forEach((item) => $(`.selectable-check[value='${item}']`).click())
    }
  })

  // Function to handle bar active state based on customer count
  const barActive = (calcNumber, calcRange) => {
    if (calcRange.value > (calcNumber === '1' ? 250000 : 500000)) {
      $(`.bar-1.bar-calc-${calcNumber}`).css({
        'border-right': '2px solid white'
      })
    } else {
      $(`.bar-1.bar-calc-${calcNumber}`).css({
        'border-right': '2px solid black'
      })
    }
    if (calcRange.value > (calcNumber === '1' ? 500000 : 750000)) {
      $(`.bar-2.bar-calc-${calcNumber}`).css({
        'border-right': '2px solid white'
      })
    } else {
      $(`.bar-2.bar-calc-${calcNumber}`).css({
        'border-right': '2px solid black'
      })
    }
    if (calcRange.value > (calcNumber === '1' ? 750000 : 1000000)) {
      $(`.bar-3.bar-calc-${calcNumber}`).css({
        'border-right': '2px solid white'
      })
    } else {
      $(`.bar-3.bar-calc-${calcNumber}`).css({
        'border-right': '2px solid black'
      })
    }
  }

  function checkBarOverlapWithThumb(calcNumber, rangeElement) {
    const rangeWidth = $(rangeElement).width()
    const thumbPercentage =
      (rangeElement.value - rangeElement.min) /
      (rangeElement.max - rangeElement.min)

    const thumbPosition = rangeWidth * thumbPercentage

    // Define the bar positions based on window width
    const barPositions =
      $(window).width() > 700
        ? [
            { start: 0.17 * rangeWidth, end: 0.28 * rangeWidth },
            { start: 0.45 * rangeWidth, end: 0.55 * rangeWidth },
            { start: 0.75 * rangeWidth, end: 0.83 * rangeWidth }
          ]
        : [
            // Define different positions or dimensions for smaller screens, if needed
            // Example:
            { start: 0.1 * rangeWidth, end: 0.3 * rangeWidth },
            { start: 0.4 * rangeWidth, end: 0.61 * rangeWidth },
            { start: 0.7 * rangeWidth, end: 0.93 * rangeWidth }
          ]

    barPositions.forEach((bar, index) => {
      const barElement = $(`.bar-${index + 1}.bar-calc-${calcNumber}`)
      if (thumbPosition >= bar.start && thumbPosition <= bar.end) {
        barElement.hide()
      } else {
        barElement.show()
      }
    })
  }

  const setValue = (range, tooltip, calcNumber) => {
    const newValue = Number(
        ((range.value - range.min) * 100) / (range.max - range.min)
      ),
      newPosition = 16 - newValue * 0.32,
      tooltipPos = (range.value / (range.max - range.min)) * 99 + '%'
    tooltip.setAttribute(
      'style',
      'left: '
        .concat(tooltipPos, '; transform: translate(-')
        .concat(tooltipPos, ', 5px)')
    )
    document.documentElement.style.setProperty(
      `--range-progress-${calcNumber}`,
      `calc(${newValue}% + (${newPosition}px))`
    )
  }

  if ($('div#calculator-1').length) {
    const range = document.getElementById('range-1'),
      tooltip = document.getElementById('tooltip-1'),
      customersLabel = document.getElementById('customers-1')

    document.addEventListener('DOMContentLoaded', setValue(range, tooltip, 1))

    const setRange = (value) => {
      if (range.value < 250000) {
        $('#range-1').attr('step', 526.315789)
        customers = Math.round(250 + (value / 526.315789) * 10)
      } else if (range.value >= 250000 && range.value < 500000) {
        $('#range-1').attr('step', 555.555556)
        customers = Math.round(5000 + ((value - 250000) / 555.555556) * 100)
      } else if (range.value >= 500000 && range.value < 750000) {
        $('#range-1').attr('step', 5000)
        customers = Math.round(50000 + ((value - 500000) / 5000) * 1000)
      } else {
        $('#range-1').attr('step', 2777.77778)
        customers = Math.round(100000 + ((value - 750000) / 2777.77778) * 10000)
      }
    }

    const CheckBoostBox = () => {
      if (customers > 250) {
        $('#boost').prop('checked', true)
        $('#boost-label').text('Included')
        $('.is-proactive').css('display', 'flex')
      } else {
        $('#boost').prop('checked', false)
        $('#boost-label').text('Included in any paid plan')
        $('.is-proactive').hide()
      }
    }

    const Calculate = () => {
      let baseValue = 0
      let userOffset = 250
      let pricePerUser = 0.5

      if (customers > 5000 && customers <= 50000) {
        baseValue = 2375
        userOffset = 5000
        pricePerUser = 0.1
      } else if (customers > 250 && customers <= 5000) {
        baseValue = 0
        userOffset = 250
        pricePerUser = 0.5
      } else if (customers > 50000 && customers <= 100000) {
        baseValue = 6875
        userOffset = 50000
        pricePerUser = 0.05
      } else if (customers > 100000 && customers <= 1000000) {
        baseValue = 9375
        userOffset = 100000
        pricePerUser = 0.01
      } else if (customers <= 250) {
        baseValue = 0
        userOffset = 0
        pricePerUser = 0
      }

      finalPrice = Math.round(
        baseValue + (customers - userOffset) * pricePerUser
      )

      customersLabel.innerHTML = `${numberWithCommas(
        customers
      )} customers / month`
      CheckBoostBox()
    }

    // Function to calculate and update price ranges based on the number of customers
    function calculatePriceRanges(customers) {
      const ranges = [
        { min: 251, max: 5000, pricePerUser: 0.5, priceVar: 'range1Price' },
        { min: 5001, max: 50000, pricePerUser: 0.1, priceVar: 'range2Price' },
        {
          min: 50001,
          max: 100000,
          pricePerUser: 0.05,
          priceVar: 'range3Price'
        },
        {
          min: 100001,
          max: 1000000,
          pricePerUser: 0.01,
          priceVar: 'range4Price'
        }
      ]

      ranges.forEach((range) => {
        const customersInRangeValue =
          Math.min(range.max, customers) - range.min + 1
        if (customersInRangeValue > 0) {
          const totalPriceInRange =
            customersInRangeValue *
            range.pricePerUser 
          // Assign the calculated price to the corresponding variable
          eval(range.priceVar + ' = ' + totalPriceInRange)
          // Save customersInRangeValue to the object with the priceVar as the key
          customersInRange[range.priceVar] = customersInRangeValue
        } else {
          // Set totalPriceInRange to 0 when customersInRangeValue is 0 or less
          eval(range.priceVar + ' = 0')
          // Save 0 to the object with the priceVar as the key
          customersInRange[range.priceVar] = 0
        }
      })
    }

    const HandleInput = () => {
      setValue(range, tooltip, 1)
      setRange(range.value)
      Calculate()
      calculatePriceRanges(customers)
      updatePriceBreakdown()
      barActive('1', range)
      checkBarOverlapWithThumb('1', range)
      estimatedCost = finalPrice
      if ($('input[name="proGPT"]').prop('checked')) {
        estimatedCost += 499
      }
      if ($('input[name="proAnalytics"]').prop('checked')) {
        estimatedCost += 499
      }
      $('.estimated-cost-title').text(
        '$' + numberWithCommas(estimatedCost).toString()
      )
      tooltip.innerHTML =
        customers <= 250
          ? `<span></span>`
          : `<span>$${(estimatedCost / customers).toFixed(
              2
            )} per customer</span>`
    }

    $(window).resize(function () {
      checkBarOverlapWithThumb('1', range)
    })

    // Function to handle checkbox changes for addons
    const handleCheckboxChange = (checkboxCost) => function () {
      let labelSpanId = ''
      let relatedElementClass = '' // This will store the class of the element we want to show/hide

      if ($(this).prop('name') === 'proAnalytics') {
        labelSpanId = '#performance-label'
        relatedElementClass = '.is-proanalytics' // Related class for "proAnalytics"
      } else if ($(this).prop('name') === 'proGPT') {
        labelSpanId = '#gpt-label'
        relatedElementClass = '.is-progpt' // Related class for "proGPT"
      }

      // Toggle the visibility of the related element
      if ($(this).prop('checked')) {
        $(relatedElementClass).css('display', 'flex')
        estimatedCost += checkboxCost
        $(labelSpanId).text('Disable add-on')
      } else {
        $(relatedElementClass).hide()
        estimatedCost -= checkboxCost
        $(labelSpanId).text('Enable add-on')
      }

      updateAddonsCost()

      $('.estimated-cost-title').text(
        '$' + numberWithCommas(estimatedCost).toString()
      )
      HandleInput()
    }

    // Event listeners for both checkboxes
    $(
      'input[name="proAnalytics"], input[name="proGPT"], input[name="proApps"]'
    ).on('change', handleCheckboxChange(499))

    $(
      'input[name="proData"]'
    ).on('change', handleCheckboxChange(1499))

    // Initial estimated cost adjustment and label setting
    $('input[name="proGPT"], input[name="proAnalytics"]').each(function () {
      if ($(this).prop('checked')) {
        estimatedCost += 499
        if ($(this).prop('name') === 'proAnalytics') {
          $('#performance-label').text('Disable add-on')
          $('.is-proanalytics').css('display', 'flex')
        } else if ($(this).prop('name') === 'proGPT') {
          $('#gpt-label').text('Disable add-on')
          $('.is-gpt').css('display', 'flex')
        }
      } else {
        if ($(this).prop('name') === 'proAnalytics') {
          $('#performance-label').text('Enable add-on')
          $('.is-proanalytics').hide()
        } else if ($(this).prop('name') === 'proGPT') {
          $('#gpt-label').text('Enable add-on')
          $('.is-gpt').hide()
        }
      }
    })

    $('input[name="proData"]').each(function () {
      if ($(this).prop('checked')) {
        estimatedCost += 1499
        $('#data-label').text('Disable add-on')
        $('.is-prodata').css('display', 'flex')
      } else {
        $('#data-label').text('Enable add-on')
        $('.is-prodata').hide()
      }
    })

    $('.estimated-cost-title').text(
      '$' + numberWithCommas(estimatedCost).toString()
    )

    range.oninput = () => {
      HandleInput()
    }

    const StickToValue = () => {
      if ($(window).width() > 700) {
        if (customers >= 4800 && customers <= 6200) {
          range.value = 250000
          HandleInput()
        } else if (customers >= 49100 && customers <= 51200) {
          range.value = 500000
          HandleInput()
        }
      } else {
        if (customers >= 4000 && customers <= 6000) {
          range.value = 250000
          HandleInput()
        } else if (customers >= 46000 && customers <= 58000) {
          range.value = 500000
          HandleInput()
        }
      }
    }

    range.onmouseup = () => {
      StickToValue()
      updateUrlParams('customers', range.value)
    }

    range.ontouchend = () => {
      StickToValue()
      updateUrlParams('customers', range.value)
    }

    range.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        StickToValue()
        updateUrlParams('customers', range.value)
      }
    })

    // Function to handle URL parameter initialization
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('customers')) {
      const customersValue = searchParams.get('customers')
      if (customersValue < 250000) {
        $('#range-1').attr('step', 526.315789)
      } else if (customersValue >= 250000 && customersValue < 500000) {
        $('#range-1').attr('step', 555.555556)
      } else if (customersValue >= 500000 && customersValue < 750000) {
        $('#range-1').attr('step', 5000)
      } else {
        $('#range-1').attr('step', 2777.77778)
      }
      range.value = customersValue
      HandleInput()
    }
    if (searchParams.has('breakdown')) {
      if (searchParams.get('breakdown') === 'true') {
        $('.lightbox-wrapper').css('display', 'flex').css('opacity', '1')
        $('.lightbox-container').css('display', 'block').css('opacity', '1')
      }
    }
  }
})
