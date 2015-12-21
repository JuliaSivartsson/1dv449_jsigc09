"use strict";

var enterTAGment = {

    tags: ["supernatural", "doctorwho", "sherlock"],
    fileRoot: "response.json",
    tagInfoArray: [],
    recentTagInfoArray: [],

    init: function(){
        // Load the Visualization API and the piechart package.
        google.charts.load('current', {packages: ['corechart']});
        google.charts.setOnLoadCallback(enterTAGment.drawChart);

        enterTAGment.getResponse();
        //enterTAGment.getRecentResponse();
    },

    getResponse: function(){
        enterTAGment.tags.forEach(function(tag){
            $.ajax(tag + 'response.json')
                .done(function(data){
                    enterTAGment.saveResponseIntoArray(data.data);
                })
                .fail(function(){
                    console.log("Ajax failed loading");
                });
        })
    },

    /*getRecentResponse: function(){
        enterTAGment.tags.forEach(function(tag){
            $.ajax(tag + 'responseMonth.json')
                .done(function(data){
                    enterTAGment.saveRecentResponeIntoArray(data.data);
                })
                .fail(function(){
                    console.log("Ajax failed loading");
                });
        })
    },*/

    drawChart: function() {
// Define the chart to be drawn.
        var data = new google.visualization.DataTable();



        data.addColumn('string', 'fandoms');
        data.addColumn('number', 'tag count');
        data.addRows([

        ]);
        enterTAGment.tagInfoArray.forEach(function(tagInfo){
            data.addRows([
                [tagInfo['name'], tagInfo['count'] ]
            ]);
        });

        // Instantiate and draw the chart.
        var chart = new google.visualization.BarChart(document.getElementById('chart_div_overall'));
        chart.draw(data, null);

        //Found help with this solution here: http://stackoverflow.com/questions/12701772/insert-links-into-google-charts-api-data
        var xDelta = 75;
        var yDelta = 13;
        $('text').each(function(i, el) {
            if (enterTAGment.tags.indexOf(el.textContent) != -1) {
                var g = el.parentNode;
                var x = el.getAttribute('x');
                var y = el.getAttribute('y');
                var width = el.getAttribute('width') || 50;
                var height = el.getAttribute('height') || 15;

                // A "ForeignObject" tag is how you can inject HTML into an SVG document.
                var fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject")
                fo.setAttribute('x', x - xDelta);
                fo.setAttribute('y', y - yDelta);
                fo.setAttribute('height', height);
                fo.setAttribute('width', width);
                var body = document.createElementNS("http://www.w3.org/1999/xhtml", "BODY");
                var a = document.createElement("A");
                a.href = "/" + el.textContent;
                a.setAttribute("style", "color:black;");
                a.innerHTML = el.textContent;
                body.appendChild(a);
                fo.appendChild(body);

                // Remove the original SVG text and replace it with the HTML.
                g.removeChild(el);
                g.appendChild(fo);
            }
        });

        /*var recentData = new google.visualization.DataTable();

        recentData.addColumn('string', 'fandoms');
        recentData.addColumn('number', 'tag count');
        recentData.addRows([

        ]);
        enterTAGment.tagInfoArray.forEach(function(tagInfo){
            recentData.addRows([
                [tagInfo['name'], tagInfo['count'] ]
            ]);
        });

        // Instantiate and draw the chart.
        var recenChart = new google.visualization.BarChart(document.getElementById('chart_div_month'));
        recenChart.draw(recentData, null);*/
    },

    saveResponseIntoArray: function(data){
        //document.body.appendChild(aLink);
        var object = {"name": data['name'], "count": data['media_count']};
        enterTAGment.tagInfoArray.push(object);
    }

    /*saveRecentResponeIntoArray: function(data){
        var object = {"name": data['name'], "count": data['media_count']};
        enterTAGment.recentTagInfoArray.push(object);

        console.log(enterTAGment.recentTagInfoArray);
    }*/
};
window.onload = enterTAGment.init;