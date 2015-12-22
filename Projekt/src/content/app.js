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

    getRecentResponse: function(title){
        enterTAGment.tags.forEach(function(tag) {
            $.ajax(tag + 'responseMonth.json')
                .done(function (data) {
                    enterTAGment.displayPictures(data.data, title);
                })
                .fail(function () {
                    console.log("Ajax failed loading");
                });
        });
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
                a.href = "#";
                a.setAttribute("style", "color:black;");
                a.innerHTML = el.textContent;
                body.appendChild(a);
                fo.appendChild(body);

                // Remove the original SVG text and replace it with the HTML.
                g.removeChild(el);
                g.appendChild(fo);

                a.addEventListener('click', function(link){
                    enterTAGment.getRecentResponse(el.textContent);

                    var tagDetails = document.getElementById('tagDetails');
                    tagDetails.innerHTML = el.textContent;
                    tagDetails.setAttribute('class', 'tagDetails');

                    var centerDiv = document.createElement('div');
                    centerDiv.setAttribute('id', 'centerDiv');
                    centerDiv.setAttribute('class', 'centerDiv');
                    tagDetails.appendChild(centerDiv);

                    var row = document.createElement('div');
                    row.setAttribute('id', 'row');
                    row.setAttribute('class', 'row');
                    centerDiv.appendChild(row);
                    $('#tagDetails').show();
                });
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
        var object = {"name": data['name'], "count": data['media_count']};
        enterTAGment.tagInfoArray.push(object);
    },

    displayPictures: function(data, title){

        var centerDiv = document.getElementById('centerDiv');
        var row = document.getElementById('row');
        //centerDiv.appendChild(row);

        data.forEach(function(tag){
            tag['tags'].forEach(function(imgTag){

                if(imgTag == title){
                    var same = document.getElementById(tag['id']);

                    //Only display each image once
                    if(same === null) {
                        var thumbnail = document.createElement('div');
                        thumbnail.setAttribute('class', 'col-xs-6 col-md-3');
                        thumbnail.setAttribute('id', tag['id']);

                        var aLink = document.createElement('a');
                        aLink.href = '#';
                        aLink.setAttribute('class', 'thumbnail');

                        var img = document.createElement('img');
                        img.src = tag['images']['thumbnail']['url'];

                        aLink.appendChild(img);
                        thumbnail.appendChild(aLink);
                        row.appendChild(thumbnail);
                    }
                }

            });
        });
    }
};
window.onload = enterTAGment.init;