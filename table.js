var columns = [
	    { head: 'Movie title', cl: 'title', html: ƒ('title') },
	    { head: 'Year', cl: 'center', html: ƒ('year') },
	    { head: 'Length', cl: 'center', html: ƒ('length') },
	    { head: 'Budget', cl: 'num', html: ƒ('budget') },
	    { head: 'Rating', cl: 'num', html: ƒ('rating') }
	];

var table = d3.select('#table').append('table');
table.append('thead').append('tr')
   .selectAll('th')
   .data(columns).enter()
   .append('th')
   .attr('class', ƒ('cl'))
   .text(ƒ('head'));
