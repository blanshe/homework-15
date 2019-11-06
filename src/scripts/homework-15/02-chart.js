import * as d3 from 'd3'

const margin = { top: 100, left: 50, right: 150, bottom: 30 }

const height = 700 - margin.top - margin.bottom

const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const parseTime = d3.timeParse('%B-%y')

const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3.scaleLinear().range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd'
  ])

const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.price)
  })

d3.csv(require('/data/housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })
  const dates = datapoints.map(d => d.datetime)
  const prices = datapoints.map(d => +d.price)

  xPositionScale.domain(d3.extent(dates))
  yPositionScale.domain(d3.extent(prices))

  const nested = d3
    .nest()
    .key(function(d) {
      return d.region
    })
    .entries(datapoints)

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'path-line')
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', function(d) {
      return colorScale(d.key)
    })
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('id', d => {
      return d.key.toLowerCase().replace(/[^a-z]/g, '')
    })

  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'circle-small')
    .attr('fill', function(d) {
      return colorScale(d.key)
    })
    .attr('r', 4)
    .attr('cy', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('cx', function(d) {
      return xPositionScale(d.values[0].datetime)
    })
    .attr('id', d => {
      return d.key.toLowerCase().replace(/[^a-z]/g, '')
    })

  svg
    .selectAll('text-label')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', 'text-label')
    .attr('y', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('x', function(d) {
      return xPositionScale(d.values[0].datetime)
    })
    .text(function(d) {
      return d.key
    })
    .attr('dx', 6)
    .attr('dy', 4)
    .attr('font-size', '12')
    .attr('id', d => {
      return d.key.toLowerCase().replace(/[^a-z]/g, '')
    })

  svg
    .append('text')
    .attr('font-size', '24')
    .attr('text-anchor', 'middle')
    .text('U.S. housing prices fall in winter')
    .attr('x', width / 2)
    .attr('y', -40)
    .attr('dx', 40)

  const rectWidth =
    xPositionScale(parseTime('February-17')) -
    xPositionScale(parseTime('November-16'))

  svg
    .append('rect')
    .attr('x', xPositionScale(parseTime('December-16')))
    .attr('y', 0)
    .attr('width', rectWidth)
    .attr('height', height)
    .attr('fill', '#C2DFFF')
    .lower()
  // This is going to select what to raise in the grapth

  // d3.select('#us-step').on('stepin', function() {
  //   svg.selectAll('.path-line').attr('stroke', function(d) {
  //     if (d.key === 'U.S.') {
  //       return 'red'
  //     } else {
  //       return 'lightgrey'
  //     }
  //   })
  // })
  d3.select('#blank').on('stepin', function() {
    svg.selectAll('path').attr('opacity', 0)
    svg.selectAll('circle').attr('opacity', 0)
    svg.selectAll('rect').attr('opacity', 0)
    svg.selectAll('.text-label').attr('opacity', 0)
  })

  d3.select('#second-step').on('stepin', () => {
    svg.selectAll('path').attr('opacity', 1)
    svg.selectAll('circle').attr('opacity', 1)
    svg.selectAll('rect').attr('opacity', 0)
    svg.selectAll('.text-label').attr('opacity', 1)
  })

  d3.select('#us-step').on('stepin', () => {
    svg.selectAll('path').attr('opacity', 1)
    svg.selectAll('circle').attr('opacity', 1)
    svg.selectAll('rect').attr('opacity', 1)
    svg.selectAll('.text-label').attr('opacity', 1)
    svg.selectAll('path').attr('stroke', 'lightgrey')
    svg.selectAll('circle').attr('fill', 'lightgrey')
    svg.selectAll('rect').attr('fill', 'white')

    svg
      .selectAll('text#us')
      .attr('fill', 'red')
      .raise()
    svg
      .selectAll('path#us')
      .attr('stroke', 'red')
      .raise()
    svg
      .selectAll('circle#us')
      .attr('fill', 'red')
      .raise()
  })

  d3.select('#region-step').on('stepin', () => {
    svg.selectAll('path').attr('stroke', 'lightgrey')
    svg.selectAll('circle').attr('fill', 'lightgrey')
    svg.selectAll('rect').attr('fill', 'white')

    svg
      .selectAll('text#us')
      .attr('fill', 'red')
      .attr('font-weight', 700)
      .raise()
    svg
      .selectAll('path#us')
      .attr('stroke', 'red')
      .raise()
    svg
      .selectAll('circle#us')
      .attr('fill', 'red')
      .raise()
    svg
      .selectAll('text#pacific')
      .attr('fill', 'blue')
      .raise()
    svg
      .selectAll('path#pacific')
      .attr('stroke', 'blue')
      .raise()
    svg
      .selectAll('circle#pacific')
      .attr('fill', 'blue')
      .raise()
    svg
      .selectAll('text#mountain')
      .attr('fill', 'blue')
      .raise()
    svg
      .selectAll('path#mountain')
      .attr('stroke', 'blue')
      .raise()
    svg
      .selectAll('circle#mountain')
      .attr('fill', 'blue')
      .raise()

    svg
      .selectAll('text#southatlantic')
      .attr('fill', 'blue')
      .raise()
    svg
      .selectAll('path#southatlantic')
      .attr('stroke', 'blue')
      .raise()
    svg
      .selectAll('circle#southatlantic')
      .attr('fill', 'blue')
      .raise()

    svg
      .selectAll('text#westsouthcentral')
      .attr('fill', 'blue')
      .raise()
    svg
      .selectAll('path#westsouthcentral')
      .attr('stroke', 'blue')
      .raise()
    svg
      .selectAll('circle#westsouthcentral')
      .attr('fill', 'blue')
      .raise()
  })

  d3.select('#rect').on('stepin', () => {
    svg.selectAll('path').attr('stroke', 'lightgrey')
    svg.selectAll('circle').attr('fill', 'lightgrey')
    svg
      .selectAll('rect')
      .attr('fill', '#C2DFFF')
      .attr('opacity')

    svg
      .selectAll('text#us')
      .attr('fill', 'red')
      .attr('font-weight', 700)
      .raise()
    svg
      .selectAll('path#us')
      .attr('stroke', 'red')
      .raise()
    svg
      .selectAll('circle#us')
      .attr('fill', 'red')
      .raise()
    svg
      .selectAll('text#pacific')
      .attr('fill', 'blue')
      .raise()
    svg
      .selectAll('path#pacific')
      .attr('stroke', 'blue')
      .raise()
    svg
      .selectAll('circle#pacific')
      .attr('fill', 'blue')
      .raise()
    svg
      .selectAll('text#mountain')
      .attr('fill', 'blue')
      .raise()
    svg
      .selectAll('path#mountain')
      .attr('stroke', 'blue')
      .raise()
    svg
      .selectAll('circle#mountain')
      .attr('fill', 'blue')
      .raise()

    svg
      .selectAll('text#southatlantic')
      .attr('fill', 'blue')
      .raise()
    svg
      .selectAll('path#southatlantic')
      .attr('stroke', 'blue')
      .raise()
    svg
      .selectAll('circle#southatlantic')
      .attr('fill', 'blue')
      .raise()

    svg
      .selectAll('text#westsouthcentral')
      .attr('fill', 'blue')
      .raise()
    svg
      .selectAll('path#westsouthcentral')
      .attr('stroke', 'blue')
      .raise()
    svg
      .selectAll('circle#westsouthcentral')
      .attr('fill', 'blue')
      .raise()
  })
  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %y'))
    .ticks(9)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  function render() {
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    // Do you want it to be full height? Pick one of the two below
    const svgHeight = height + margin.top + margin.bottom
    // const svgHeight = window.innerHeight

    const actualSvg = d3.select(svg.node().closest('svg'))
    actualSvg.attr('width', svgWidth).attr('height', svgHeight)

    const newWidth = svgWidth - margin.left - margin.right
    const newHeight = svgHeight - margin.top - margin.bottom

    // Update our scale
    xPositionScale.range([0, newWidth])
    yPositionScale.range([newHeight, 0])

    // Update things you draw
    svg
      .selectAll('.circle-small')
      .transition()
      .ease(d3.easeElastic)
      .attr('cy', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('cx', function(d) {
        return xPositionScale(d.values[0].datetime)
      })
    svg
      .selectAll('.path-line')
      .attr('d', function(d) {
        return line(d.values)
      })
      .attr('stroke', function(d) {
        return colorScale(d.key)
      })
      .attr('stroke-width', 2)
      .attr('fill', 'none')
    svg
      .selectAll('.text-label')
      .attr('y', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('x', function(d) {
        return xPositionScale(d.values[0].datetime)
      })
      .text(function(d) {
        return d.key
      })
      .attr('dx', 6)
      .attr('dy', 4)
      .attr('font-size', '12')

    svg
      .select('rect')
      .attr('x', xPositionScale(parseTime('December-16')))
      .attr('y', 0)
      .attr('width', rectWidth)
      .attr('height', height)
      .attr('fill', '#C2DFFF')
      .lower()

    // Update axes
    svg.select('.x-axis').call(xAxis)
    svg.select('.y-axis').call(yAxis)
  }

  // When the window resizes, run the function
  // that redraws everything
  window.addEventListener('resize', render)

  // And now that the page has loaded, let's just try
  // to do it once before the page has resized
  render()
}
