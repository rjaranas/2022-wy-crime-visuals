import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';


const dataPromise = d3.json('json/2022-west-yorkshire.json')


function drawData(dataset) {
    

    const width = 600;
    const height = 600;

    const tooltip = d3.select('.page-wrapper')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', '0')

    const svg = d3.select('.container')
    .append('svg')
    .attr('width', width  + 700)
    .attr('height', height + 40)
    .attr('viewBox', [0, 0, width, height])
    .attr('transform', `translate(450, 150)`)


    const groupCell = svg.append('g')
    .attr('transform', `translate(40,0)`)

    const moreCrimes = d3.rollup(dataset, (v) => v.length, (d) => d['Crime type'])
    const uniqueCrimes = Array.from(moreCrimes.keys())
    const moreCrimeData = uniqueCrimes.map((crimeTime) => ({
        'Crime type': crimeTime,
        'Count': moreCrimes.get(crimeTime)
    }))

    moreCrimeData.sort((a, b) => b.Count - a.Count)

    const crimeCounts = d3.rollup(dataset, (v) => v.length, (d) => d.Month)    
    const monthlyCrimes = Array.from(crimeCounts.keys())
    const crimeData = monthlyCrimes.map((month) => ({
        'Month': month,
        'Amount': crimeCounts.get(month)
    }))

    const xScale = d3.scaleBand()
    .domain(crimeData.map((d) => d.Month))
    .range([0, width + 40])
    .padding(0.1)

    const yScale = d3.scaleLinear()
    .domain([0, d3.max(crimeData, (d) => d.Amount)])
    .range([height - 150, 0])

    groupCell.selectAll('rect')
    .data(crimeData)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d.Month))
    .attr('y', (d) => yScale(d.Amount))
    .attr('width', xScale.bandwidth() - 5)
    .attr('height', (d) => height - 40 - yScale(d.Amount) - 150)
    .attr('transform', `translate(0, 150)`)
    .on('mouseover', (event, d) => {
        const amount = d.Amount

        tooltip.transition(50)
        .duration(50)
        .style('opacity', '1.2')
        tooltip.html(`Amount: ${amount}`)
    })
    .on('mousemove', function() {
        tooltip.style('top', (event.pageY-100)+'px')
        .style('left', (event.pageX+40)+'px')
    })
    .on('mouseout', function() {
        tooltip.transition()
        .duration(50)
        .style('opacity', '0')
    })

    groupCell.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height - 40})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .attr('font-size', '12px')

    groupCell.append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(0, 110)`)
    .call(d3.axisLeft(yScale).ticks())
    .selectAll('text')
    .attr('font-size', '12px')

    svg.append('text')
    .attr('id', 'y-label')
    .text('Number of crimes')
    .attr('transform', `translate(0, 90)`)

    svg.append('text')
    .attr('id', 'x-label')
    .text('Months')
    .attr('transform', `translate(650, 600)`)

    const table = d3.select('.summary')
    .append('table')
    .attr('class', 'table')
    .style('border-collapse', 'collapse')
    .style('border', '2px black solid')

    

    table.append('thead')
    .append('tr')
    .selectAll('th')
    .data(['Type of crime', 'Amount'])
    .enter()
    .append('th')
    .text((d) => d)
    .style('padding', '5px')
    .style('border', '3px solid black')
    .style('font-size', '20px')


    const tbody = table.append('tbody')
    const rows = tbody.selectAll('tr')
    .data(moreCrimeData)
    .enter()
    .append('tr')

    rows.append('td')
    .text((d) => d['Crime type'])
    .style('padding', '5px')
    .style('border', '1px solid black')
    .style('font-size', '15px')

    rows.append('td')
    .text((d) => d.Count)
    .style('padding', '5px')
    .style('border', '1px solid black')
    .style('font-size', '15px')
    .style('text-align', 'center')


   
}



dataPromise.then(function (data) {
    const dataset = data;
    drawData(dataset)
})


