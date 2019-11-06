import * as d3 from 'd3'

const margin = { top: 10, left: 10, right: 10, bottom: 10 }

const height = 480 - margin.top - margin.bottom

const width = 480 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const radius = 200

const radiusScale = d3
  .scaleLinear()
  .domain([10, 100])
  .range([40, radius])

const angleScale = d3
  .scalePoint()
  .domain([
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
    'Blah'
  ])
  .range([0, Math.PI * 2])

const line = d3
  .radialArea()
  .outerRadius(function(d) {
    return radiusScale(d.high_temp)
  })
  .innerRadius(function(d) {
    return radiusScale(d.low_temp)
  })
  .angle(function(d) {
    return angleScale(d.month_name)
  })

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))
function ready(datapoints) {
  const container = svg
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
  datapoints.forEach(d => {
    d.high_temp = +d.high_temp
    d.low_temp = +d.low_temp
  })
  // Filter it so I’m only looking at NYC datapoints
  const nycDatapoints = datapoints.filter(d => d.city === 'NYC')
  nycDatapoints.push(nycDatapoints[0])
  const BeijingDatapoints = datapoints.filter(d => d.city === 'Beijing')
  BeijingDatapoints.push(BeijingDatapoints[0])
  const StockholmDatapoints = datapoints.filter(d => d.city === 'Stockholm')
  StockholmDatapoints.push(StockholmDatapoints[0])
  const LimaDatapoints = datapoints.filter(d => d.city === 'Lima')
  LimaDatapoints.push(LimaDatapoints[0])
  const TusconDatapoints = datapoints.filter(d => d.city === 'Tuscon')
  TusconDatapoints.push(TusconDatapoints[0])
  container
    .append('path')
    .attr('class', 'temp')
    .datum(nycDatapoints)
    .attr('d', line)
    .attr('fill', '#e41a1c')
    .attr('opacity', 0.75)
  container
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('class', 'city-name')
    .text('NYC')
    .attr('font-size', 30)
    .attr('font-weight', 700)
    .attr('alignment-baseline', 'middle')
  d3.select('#nyc').on('stepin', function() {
    container
      .selectAll('.temp')
      .datum(nycDatapoints)
      .attr('d', line)
      .attr('fill', '#e41a1c')
      .attr('opacity', 0.75)
    container
      .selectAll('.city-name')
      .attr('text-anchor', 'middle')
      // .attr(‘class’, ‘city-name’)
      .text('NYC')
      .attr('font-size', 30)
      .attr('font-weight', 700)
      .attr('alignment-baseline', 'middle')
  })
  d3.select('#beijing').on('stepin', function() {
    container
      .selectAll('.temp')
      .datum(BeijingDatapoints)
      // .attr(‘d’, line)
      .attr('fill', '#377eb8')
    // .attr(‘opacity’, 0.75)
    container
      .selectAll('.city-name')
      .attr('text-anchor', 'middle')
      .attr('class', 'city-name')
      .text('Beijing')
      .attr('font-size', 30)
      .attr('font-weight', 700)
      .attr('alignment-baseline', 'middle')
  })
  d3.select('#stockholm').on('stepin', function() {
    container
      .selectAll('.temp')
      .datum(StockholmDatapoints)
      .attr('d', line)
      .attr('fill', '#4daf4a')
      .attr('opacity', 0.75)
    container
      .selectAll('.city-name')
      .attr('text-anchor', 'middle')
      .attr('class', 'city-name')
      .text('Stockholm')
      .attr('font-size', 30)
      .attr('font-weight', 700)
      .attr('alignment-baseline', 'middle')
  })
  d3.select('#lima').on('stepin', function() {
    container
      .selectAll('.temp')
      .datum(LimaDatapoints)
      .attr('d', line)
      .attr('fill', '#984ea3')
      .attr('opacity', 0.75)
    container
      .selectAll('.city-name')
      .attr('text-anchor', 'middle')
      .attr('class', 'city-name')
      .text('Lima')
      .attr('font-size', 30)
      .attr('font-weight', 700)
      .attr('alignment-baseline', 'middle')
  })
  d3.select('#tuscon').on('stepin', function() {
    container
      .selectAll('.temp')
      .datum(TusconDatapoints)
      .attr('d', line)
      .attr('fill', '#ff7f00')
      .attr('opacity', 0.75)
    container
      .selectAll('.city-name')
      .attr('text-anchor', 'middle')
      .attr('class', 'city-name')
      .text('Tucson')
      .attr('font-size', 30)
      .attr('font-weight', 700)
      .attr('alignment-baseline', 'middle')
  })
  const circleBands = [20, 30, 40, 50, 60, 70, 80, 90]
  const textBands = [30, 50, 70, 90]
  container
    .selectAll('.bands')
    .data(circleBands)
    .enter()
    .append('circle')
    .attr('class', 'bands')
    .attr('fill', 'none')
    .attr('stroke', 'gray')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', function(d) {
      return radiusScale(d)
    })
    .lower()
  container
    .selectAll('.temp-notes')
    .data(textBands)
    .enter()
    .append('text')
    .attr('class', 'temp-notes')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -2)
    .text(d => d + '°')
    .attr('text-anchor', 'middle')
    .attr('font-size', 8)
}
