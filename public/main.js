let url = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json'
let title = 'Kickstarter Pledges'
let description = 'Top 100 highest Kickstarter pledges by category.'

const width = 900
const height = 600

let svg = d3.select('.chart')
	.append('svg')
	.attr('width', width)
	.attr('height', height)
	.style('padding', '90 300 0 90')

let fader = (color) => {

		return d3.interpolateRgb(color, '#ff0000')(0) },
	color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
	format = d3.format(',d')

let treemap = d3.treemap()
	.tile(d3.treemapResquarify)
	.size([width, height])
	.paddingInner(1)

let legendCategories = []
function createMap(err, data) {
  	if (err) {
  		throw err
  	}

	let root = d3.hierarchy(data)
		.eachBefore((d) => {
			d.data.id = (d.parent ? d.parent.data.id + d.data.name : '')
		})
		.sum((d) => {
			return d.value
		})
		.sort((a, b) => {
			return b.height - a.height || b.value - a.value
		})

	treemap(root)

	let cell = svg.selectAll('g')
		.data(root.leaves())
		.enter().append('g')
		.attr('transform', (d) => {
			return 'translate(' + d.x0 + ',' + d.y0 + ')'
		})

	cell.append('rect')
		.attr('id', (d) => {
			return d.data.id
		})
		.attr('class', 'tile')
		.attr('width', (d) => {
			return d.x1 - d.x0
		})
		.attr('height', (d) => {
			return d.y1 - d.y0
		})
		.attr('data-name', (d) => {
			return  d.data.name
		})
		.attr('data-category', (d) => {
			return  d.data.category
		})
		.attr('data-value', (d) => {
			return  d.data.name
		})
		.attr('fill', (d) => {
			if (!legendCategories.includes(d.data.category)){
				legendCategories.push(d.data.category)
			}
			return color(d.data.category)
		})

	cell.append('foreignObject')
    		.attr('class', 'cell-text')
		    .attr('width',5)
    		.attr('x',5)
    		.attr('y', 5)
    		.text((d) => {
			return d.data.name })




	let legend =  svg
    	.selectAll('.legend')
    	.data(legendCategories)
    	.enter()
    	.append('g')
    	    .attr('id', 'legend')
    	    .attr('transform', (d , i) => {
    	      return 'translate('+ (20 + i / 40) + ',' + (i * 30)+ ')'
    	    })

	legend
    	.append('rect')
		  .attr('class', 'legend-item')
    	.attr('x',width)
    	.attr('width', 30)
    	.attr('height', 20)
    	.style('fill',  (d) => {
    		 return color(d)
    	})

	legend
      	.append('text')
      	.attr('class', 'legend-text')
      	.attr('x', width + 40)
      	.attr('y', 20)
      	.text( (d) => {

      		return d
      	})

	svg.append('text')
 				.attr('id', 'description')
 				.attr('x', (width / 4))
 				.attr('y', (-20))
 				.text(description)

}

d3.queue()
  	.defer(d3.json, url )
  	.await(createMap)
