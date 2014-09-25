var genderRingChart = dc.pieChart("#chart-ring-gender");
var volumeChart = dc.barChart("#chart-bar-term");
var stateRowChart = dc.rowChart("#chart-row-state");
var partyRowChart = dc.rowChart("#chart-row-party");
var constRowChart = dc.rowChart("#chart-row-constituency");
//var screenRowChart = dc.rowChart("#chart-row-screen");
var nameRowChart = dc.rowChart("#chart-row-name");
var channelRowChart = dc.rowChart("#chart-row-channel");
var chart =  dc.compositeChart("#test");
var dRowChart = dc.rowChart("#chart-row-d");
var g;

d3.csv("data/isdata.csv", function (data) {

 var dateFormat = d3.time.format("%Y-%m");
    var numberFormat = d3.format(",f");

    data.forEach(function (d) {
        d.dd = dateFormat.parse(d.date);
        d.month = d3.time.month(d.dd); // pre-calculate month for better performance

    });

 
    var ndx = crossfilter(data);
    var all = ndx.groupAll();
var moveMonths = ndx.dimension(function (d) {return d.month; });
var volumeByMonthGroup = moveMonths.group().reduceSum(function (d){ return d.term;});

var sales_east = moveMonths.group().reduceSum(function (d) {if (d.gender==="SUB EAST") {return d.term;}else{return 0;}});
var sales_west = moveMonths.group().reduceSum(function (d) {if (d.gender==="SUB WEST") {return d.term;}else{return 0;}});
var sales_cent = moveMonths.group().reduceSum(function (d) {if (d.gender==="CENTER") {return d.term;}else{return 0;}});

var compose1=dc.lineChart(chart)
             .dimension(moveMonths)
             .ordinalColors(["#FFF555"])
             .group(sales_east,"EAST")
             .renderArea(false);
var compose2=dc.lineChart(chart)
             .dimension(moveMonths)
             .ordinalColors(["#FA8072"])
             .group(sales_west,"WEST")
             .renderArea(false);
var compose3=dc.lineChart(chart)
             .dimension(moveMonths)
             .ordinalColors(["#B9D3EE"])
             .group(sales_cent, "CENTER")
             .renderArea(false);
    

// tooltips for row chart
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<span style='color: #f0027f'>" + d.key + "</span> : " + numberFormat(d.value);
        });

    // tooltips for pie chart
    var pieTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<span style='color: #f0027f'>" + d.data.key + "</span> : " + numberFormat(d.value);
        });

    // tooltips for bar chart
    var barTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<span style='color: #f0027f'>" + d.data.key + "</span> : " + numberFormat(d.y);
        });
		
	 // tooltips for line chart
    var lineTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<span style='color: #f0027f'>" + d.key + "</span> : " + numberFormat(d.value);
        });	
	
	 

 


    // dimension by month
    var moveMonths = ndx.dimension(function (d) {
        return d.month;
    });
    // group by total movement within month

    // group by total volume within move, and scale down result
    var volumeByMonthGroup = moveMonths.group().reduceSum(function (d) {
        return d.term;
    });
    
    var dDim = ndx.dimension(function (d) {
        return d.d;
    });
    var d_total = dDim.group().reduceSum(function (d) {
        return d.term;
    }); 

    var genderDim = ndx.dimension(function (d) {
        return d.gender;
    });
    var gender_total = genderDim.group().reduceSum(function (d) {
        return d.term;
    });
    // print_filter("gender_total");

    var nameDim = ndx.dimension(function(d){
	      return d.name;});
		  
	var name_total = nameDim.group().reduceSum(function(d){
	       return d.term;});
	
	
	var screenDim = ndx.dimension(function (d) {
	      return d.screen;
		  });
	var screen_total = screenDim.group().reduceSum(function(d) {
	      return d.term;
		  });
	
	
    var partyDim = ndx.dimension(function (d) {
        return d.party;
    });
    var party_total = partyDim.group().reduceSum(function (d) {
        return d.term;
    });
    //print_filter("party_total");

   var termDim = ndx.dimension(function (d) {
        return d.year;
    });
	 var term_total = termDim.group().reduceSum(function (d) {
        return d.term;
    });
    //print_filter("term_total");


    var stateDim = ndx.dimension(function (d) {
        return d.state;
    });
    var state_total = stateDim.group().reduceSum(function (d) {
        return d.term;
    });
    //print_filter("state_total");
	
	var channelDim = ndx.dimension(function (d) {
        return d.channel;
    });
    var channel_total = channelDim.group().reduceSum(function (d) {
        return d.term;
    });
	

    var constDim = ndx.dimension(function (d) {
        return d.constituency;
    });
    var const_total = constDim.group().reduceSum(function (d) {
        return d.term;
    });

chart
    .width(400)
    .height(150)
	.margins({top: 10, right: 50, bottom: 50, left: 50})
    .x(d3.time.scale().domain([new Date(2010, 0, 1), new Date(2013, 8, 31)]))
    .brushOn(false)
    .mouseZoomable(false)
    .round(d3.time.month.round)
    .xUnits(d3.time.months)
    .renderHorizontalGridLines(true)
    .legend(dc.legend().x(300).y(0).itemHeight(13).gap(5))
    //.yAxisLabel("Sales Unit")
    .elasticX(true)
    .compose([compose1, compose2, compose3]);
	
	chart.renderlet(function (chart) {
        chart.selectAll("g.x text")
		.attr('dx', '00')
		.attr('dy', '5')
		.attr('transform', "rotate(-30)");
    })
    

	

	
	
    genderRingChart
        .width(250)
		.height(150)
        .dimension(genderDim)
        .group(gender_total)
        .innerRadius(40)
        .renderLabel(false)
                .title(function (d) {
            ""
        })
        .legend(dc.legend().x(95).y(50).itemHeight(15).gap(3))
        .colors(d3.scale.ordinal().domain(["center", "west"," east"])
            .range(["#B9D3EE", "#FA8072","#FFF68F"]));

			
	volumeChart.width(400)
        .height(150)
        .margins({top: 10, right: 50, bottom: 50, left: 50})
        .dimension(moveMonths)
        .group(volumeByMonthGroup)
        .centerBar(true)
        .gap(1)
        .x(d3.time.scale().domain([new Date(2010, 12), new Date(2013, 8)]))
        .round(d3.time.month.round)
		.brushOn(true)
		.elasticY(true)
        .alwaysUseRounding(true)
        .xUnits(d3.time.months);
		
	  volumeChart.renderlet(function (chart) {
        chart.selectAll("g.x text")
		.attr('dx', '00')
		.attr('dy', '5')
		.attr('transform', "rotate(-30)");
    })
		



    stateRowChart.width(300)
        .height(250)
        .margins({top: 0, left: 10, right: 10, bottom: 20})
        .transitionDuration(750)
        .dimension(stateDim)
        .group(state_total)
        .renderLabel(true)
        .gap(1)
        .title(function (d) {
            ""
        })
		
        .elasticX(true)
        .colors("#B9D3EE")
        .xAxis().ticks(5).tickFormat(d3.format("s"))
    ;
    stateRowChart.data(function (group) {
        return group.top(30);
    });
	
	channelRowChart.width(300)
        .height(200)
        .margins({top: 0, left: 10, right: 10, bottom: 20})
        .transitionDuration(750)
        .dimension(channelDim)
        .group(channel_total)
        .renderLabel(true)
        .gap(1)
        .title(function (d) {
            ""
        })
        .elasticX(true)
        .colors("#B9D3EE")
        .xAxis().ticks(5).tickFormat(d3.format("s"))
    ;
    channelRowChart.data(function (group) {
        return group.top(30);
    });
	


    partyRowChart.width(300)
        .height(250)
        .margins({top: 0, left: 10, right: 10, bottom: 20})
        .transitionDuration(750)
        .dimension(partyDim)
        .group(party_total)
        .renderLabel(true)
        .gap(1)
        .title(function (d) {
            return "";
        })
        .elasticX(true)
        .colors("#B9D3EE")
        .xAxis().ticks(5).tickFormat(d3.format("s"))
    ;
    partyRowChart.data(function (group) {
        return group.top(10);
    });
	
	
	/*screenRowChart.width(300)
        .height(120)
        .margins({top: 20, left: 10, right: 10, bottom: 20})
        .transitionDuration(750)
        .dimension(screenDim)
        .group(screen_total)
        .renderLabel(true)
        .gap(1)
        .title(function (d) {
            return "";
        })
        .elasticX(true)
        .colors("#B9D3EE")
        .xAxis().ticks(5).tickFormat(d3.format("s"))
    ;
    screenRowChart.data(function (group) {
        return group.top(5);
    });*/

dRowChart.width(300)
        .height(100)
        .margins({top: 0, left: 10, right: 10, bottom: 20})
        .transitionDuration(750)
        .dimension(dDim)
        .group(d_total)
        .renderLabel(true)
        .gap(1)
        .title(function (d) {
            return "";
        })
        .elasticX(true)
        .colors("#B9D3EE")
        .xAxis().ticks(5).tickFormat(d3.format("s"))
    ;
    dRowChart.data(function (group) {
        return group.top(5);
    });
	
    constRowChart.width(300)
        .height(100)
        .margins({top: 0, left: 10, right: 10, bottom: 20})
        .transitionDuration(750)
        .dimension(constDim)
        .group(const_total)
        .renderLabel(true)
        .gap(1)
        .title(function (d) {
            return "";
        })
        .elasticX(true)
        .colors("#B9D3EE")
        .xAxis().ticks(3).tickFormat(d3.format("s"))
    ;
    constRowChart.data(function (group) {
        return group.top(3);
    });
	
	
	
	nameRowChart.width(200)
        .height(900)
        .margins({top: 20, left: 10, right: 10, bottom: 20})
        .transitionDuration(750)
        .dimension(nameDim)
        .group(name_total)
        .renderLabel(true)
        .gap(1)
        .title(function (d) {
            return "";
        })
        .elasticX(true)
        .colors("#B9D3EE")
        .xAxis().ticks(3).tickFormat(d3.format("s"))
    ;
    nameRowChart.data(function (group) {
        return group.top(35);
    });
	
	


    // dimension by term
    var allDim = ndx.dimension(function (d) {
        return +d.year;
    });


    dc.dataCount(".ls-data-count")
        .dimension(ndx)
        .group(all);


    datatable = $(".ls-data-table").dataTable({

        "bDeferRender": true,
        // Restricted data in table to 10 rows, make page load faster
// Make sure your field names correspond to the column headers in your data file. Also make sure to have default empty values.
        "aaData": allDim.top(100),
        "aaSorting": [
            [ 1, "desc" ]
        ],
        "bDestroy": true,
        "iDisplayLength": 25,
        "aoColumns": [
            { "mData": "date", "sDefaultContent": " " },
            { "mData": "term", "sDefaultContent": " " },
            { "mData": "name", "sDefaultContent": " " },
            { "mData": "state", "sDefaultContent": " " },
            { "mData": "party", "sDefaultContent": " " },
            { "mData": "constituency", "sDefaultContent": " " },
			{ "mData": "d", "sDefaultContent": " " },
			{ "mData": "channel", "sDefaultContent": " " }
        ]
    });

    function RefreshTable() {
        datatable.fnClearTable();
        datatable.fnAddData(allDim.top(Infinity));
        datatable.fnDraw();
    };

    for (var i = 0; i < dc.chartRegistry.list().length; i++) {
        var chartI = dc.chartRegistry.list()[i];
        chartI.on("filtered", RefreshTable);
    }
    RefreshTable();


    dc.renderAll();
    d3.selectAll("g.row").call(tip);
                d3.selectAll("g.row").on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                d3.selectAll(".pie-slice").call(pieTip);
                d3.selectAll(".pie-slice").on('mouseover', pieTip.show)
                    .on('mouseout', pieTip.hide);

                d3.selectAll(".bar").call(barTip);
                d3.selectAll(".bar").on('mouseover', barTip.show)
                    .on('mouseout', barTip.hide);

});