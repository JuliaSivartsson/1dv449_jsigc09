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
        enterTAGment.getRecentResponse();
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

    getRecentResponse: function(){
        enterTAGment.tags.forEach(function(tag){
            $.ajax(tag + 'responseMonth.json')
                .done(function(data){
                    enterTAGment.saveRecentResponeIntoArray(data.data);
                })
                .fail(function(){
                    console.log("Ajax failed loading");
                });
        })
    },

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

        var recentData = new google.visualization.DataTable();

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
        recenChart.draw(recentData, null);
    },

    saveResponseIntoArray: function(data){
        var object = {"name": data['name'], "count": data['media_count']};
        enterTAGment.tagInfoArray.push(object);
    },

    saveRecentResponeIntoArray: function(data){
        var object = {"name": data['name'], "count": data['media_count']};
        enterTAGment.recentTagInfoArray.push(object);

        console.log(enterTAGment.recentTagInfoArray);
    }
};
window.onload = enterTAGment.init;