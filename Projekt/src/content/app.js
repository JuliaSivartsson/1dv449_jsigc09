"use strict";

var enterTAGment = {

    tags: ["supernatural", "doctorwho", "sherlock"],
    fileRoot: "response.json",
    tagInfoArray: [],
    recentTagInfoArray: [],
    imageArray: [],
    tagArray: [],
    response: [],

    init: function(){
        // Load the Visualization API and the piechart package.
        google.charts.load('current', {packages: ['corechart']});
        google.charts.setOnLoadCallback(enterTAGment.drawChart);

        enterTAGment.getResponse();
        enterTAGment.getRecentResponse();

        $(document).mouseup(function (e)
        {
            var container = $("#imageHolder");

            if (!container.is(e.target) // if the target of the click isn't the container...
                && container.has(e.target).length === 0) // ... nor a descendant of the container
            {
                container.remove();
                $("#darkBackground").remove();
            }
        });
    },

    //Get overall statistics
    getResponse: function(){
        enterTAGment.tags.forEach(function(tag){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (xhr.readyState === 4 && xhr.status === 200){
                    var response = JSON.parse(xhr.responseText)
                    enterTAGment.saveResponseIntoArray(response["data"]);
                }
            };
            xhr.open("GET", tag + 'response.json', false);
            xhr.send(null);
        })
    },

    //Get statistics for latest month
    getRecentResponse: function(title){
        enterTAGment.tags.forEach(function(tag) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (xhr.readyState === 4 && xhr.status === 200){
                    var response = JSON.parse(xhr.responseText)
                    enterTAGment.saveRecentResponseIntoArray(tag, response["data"]);
                }
            };
            xhr.open("GET", tag + 'responseMonth.json', false);
            xhr.send(null);
        });
    },

    //Get statistics for latest month
    /*getPictures: function(title){
        enterTAGment.tags.forEach(function(tag) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (xhr.readyState === 4 && xhr.status === 200){
                    var response = JSON.parse(xhr.responseText)
                    //enterTAGment.saveRecentResponseIntoArray(tag, response["data"]);
                    enterTAGment.displayPictures(response["data"], title);
                    console.log(response["data"]);
                }
            };
            xhr.open("GET", tag + 'responseMonth.json', false);
            xhr.send(null);
        });
    },*/

    drawChart: function() {
        //Define the chart to be drawn.
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

        var options = {
            backgroundColor: {fill: '#D0CCC5'},
            hAxis: {gridlines: {color: '#333'}, direction: 1},
            'chartArea': {top: 10}
        };
        chart.draw(data, options);

        //Draw chart for latest month
        var recentData = new google.visualization.DataTable();

        recentData.addColumn('string', 'fandoms');
        recentData.addColumn('number', 'tag count');
        recentData.addRows([

        ]);

        enterTAGment.tags.forEach(function(tag){
            var found = enterTAGment.recentTagInfoArray.some(function (el) {
                return el.name === tag;
            });

            //console.log(found);

            if(!found){
                var object = {"name": tag, "count": 0, "data": null};
                enterTAGment.recentTagInfoArray.push(object);
            }
        });

        enterTAGment.recentTagInfoArray.forEach(function(tagInfo){
            //console.log(tagInfo['name']);
            recentData.addRows([
                [tagInfo['name'], tagInfo['count'] ]
            ]);


        });

        // Instantiate and draw the chart.
        var recentChart = new google.visualization.BarChart(document.getElementById('chart_div_month'));
        recentChart.draw(recentData, options);

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

                a.addEventListener('click', function(){
                    event.preventDefault();
                    //enterTAGment.getRecentResponse(el.textContent);

                    var tagDetails = document.getElementById('tagDetails');

                    //Clear div before rendering new info
                    while (tagDetails.hasChildNodes()) {
                        tagDetails.removeChild(tagDetails.lastChild);
                    }
                    enterTAGment.imageArray = [];

                    var p = document.createElement('p');
                    p.innerHTML = "<h1 class='title'>#"+ el.textContent +"</h1>";
                    p.setAttribute('class', 'detailsTitle');

                    tagDetails.appendChild(p);
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

                    enterTAGment.recentTagInfoArray.forEach(function(tagInfo){
                        console.log(tagInfo['name'], tagInfo['data']);
                        enterTAGment.displayPictures(tagInfo['data'], el.textContent);
                    });

                    $('html, body').animate({
                        scrollTop: $("#centerDiv").offset().top
                    }, 1000);
                });
            }
        });
},

    saveRecentResponseIntoArray: function(tagName, data){
        // Loop through the data and only add the images that match a certain user ID

        var count = 0;
        var array = [];
        var object = {};
        data.forEach(function(result){
            if (result["created_time"] > 1451347200) {

                /*count++;
                object = {"name": tagName, "count": count, "data": result};
                enterTAGment.recentTagInfoArray.push(object);
*/
                var banan = $.grep(enterTAGment.recentTagInfoArray, function(e){ return e.name == tagName; });
                if(banan == 0){
                    count++;
                    array.push(result);
                    object = {"name": tagName, "count": count, "data": array};
                    enterTAGment.recentTagInfoArray.push(object);
                }
                else{
                    banan[0].count = banan[0].count + 1;
                    array.push(result);
                    banan[0].data = array;
                    console.log(array);
                }

                /*var found = enterTAGment.recentTagInfoArray.some(function (el) {
                    return el.name === tagName;
                });

                console.log(found);

                if(!found){
                    count++;
                    object = {"name": tagName, "count": count, "data": result};
                    enterTAGment.recentTagInfoArray.push(object);
                }
                if(found){

                }*/

            }
        });

        /*for (var i = 0; i < imgLimit; i++) {
            var usertag = data.data[i].user.id;
            if (usertag === "USER_ID_OF_CHOICE") {
                // Add image to page
                addImage(data.data[i]);
            }
        }*/
        /*data.forEach(function(){
            count++;
        });
        var object = {"name": tagName, "count": count, "data": data};
        enterTAGment.recentTagInfoArray.push(object);

        console.log(enterTAGment.recentTagInfoArray);*/
    },

    saveResponseIntoArray: function(data){
        var object = {"name": data['name'], "count": data['media_count']};
        enterTAGment.tagInfoArray.push(object);
    },

    displayPictures: function(data, title){

        var centerDiv = document.getElementById('centerDiv');

        if(data === null){
            console.log(data);

        }
        else if(data !== null){

            data.forEach(function(tag) {
                tag['tags'].forEach(function (imgTag) {

                    if (imgTag == title) {
                        var same = document.getElementById(tag['id']);

                        var pExists = document.getElementById('tag-info');
                        if(pExists){
                           pExists.remove();
                        }
                        //Only display each image once
                        if (same === null) {
                            var thumbnail = document.createElement('div');
                            thumbnail.setAttribute('class', 'col-xs-6 col-md-3');
                            thumbnail.setAttribute('id', tag['id']);

                            var aLink = document.createElement('a');
                            aLink.href = '#';
                            aLink.setAttribute('class', 'thumbnail');

                            var img = document.createElement('img');
                            img.src = tag['images']['standard_resolution']['url'];

                            enterTAGment.tagArray.push(tag);

                            aLink.appendChild(img);
                            thumbnail.appendChild(aLink);
                            var row = document.getElementById('row');
                            row.appendChild(thumbnail);

                            aLink.addEventListener('click', function () {
                                event.preventDefault();
                                enterTAGment.showPopup(tag);
                            });
                        }
                    }

                });
            });
        }


        var thumb = document.getElementsByClassName('thumbnail');
        console.log(thumb.length === 0);
        if(thumb.length === 0){
            var row = document.getElementById('row');
            var pExists = document.getElementById('tag-info');
            if(!pExists){
                var p = document.createElement('p');
                p.setAttribute('id', 'tag-info');
                p.setAttribute('class', 'alert alert-info text-center');
                p.innerHTML = "No images with this tag has been posted in the last month!";
                row.appendChild(p);
            }
        }

    },

    showPopup: function(tag){


        var darkBackground = document.createElement('div');
        darkBackground.setAttribute('id', 'darkBackground');


        var imageHolder = document.createElement('div');
        imageHolder.setAttribute('id', 'imageHolder');
        imageHolder.setAttribute('class', 'imageHolder');

        imageHolder.style.top = screen.height/2 + "px";
        imageHolder.style.left = screen.width/3 + "px";

        var thumbnail = document.createElement('div');
        thumbnail.setAttribute('class', 'thumbnail');

        var img = document.createElement('img');
        img.setAttribute('class', 'col-md-9 padding-bottom');
        img.src = tag['images']['standard_resolution']['url'];

        var caption = document.createElement('div');
        caption.innerHTML = "<h3>" + tag['caption']['text'] + "</h3>";

        var close = document.createElement('a');
        close.src = "#";
        close.style.cursor = "pointer";
        close.innerHTML = ' <i class="fa fa-times fa-lx"></i>';

        var previous = document.createElement('div');
        previous.setAttribute('class', 'col-md-2 margin-top-left');
        previous.style.cursor = "pointer";
        previous.innerHTML = '<i class="fa fa-caret-left fa-2x"></i>';

        var next = document.createElement('div');
        next.setAttribute('class', 'col-md-1 margin-top-right');
        next.style.cursor = "pointer";
        next.innerHTML = '<i class="fa fa-caret-right fa-2x"></i>';

        close.addEventListener('click', function(){
            this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
            $("#darkBackground").remove();
            return false;
        });

        previous.addEventListener('click', function(){
            enterTAGment.openPreviousImage(tag);
        });

        next.addEventListener('click', function(){
           enterTAGment.openNextImage(tag);
        });

        var userP = document.createElement('p');
        userP.innerHTML = "<p>user: "+ tag['user']['username'] +"</p>";

        var createdP = document.createElement('p');
        createdP.innerHTML = "<p>created: "+ enterTAGment.formatDate(tag['created_time']) +"</p>";

        caption.appendChild(userP);
        caption.appendChild(createdP);
        thumbnail.appendChild(close);
        thumbnail.appendChild(previous);
        thumbnail.appendChild(img);
        thumbnail.appendChild(next);
        thumbnail.appendChild(caption);
        imageHolder.appendChild(thumbnail);
        document.body.appendChild(darkBackground);
        document.body.appendChild(imageHolder);
    },

    openPreviousImage: function(tag){

        var index = enterTAGment.tagArray.indexOf(tag);
        var previousImage = enterTAGment.tagArray[index - 1];

        var firstElement = enterTAGment.tagArray[0];
        var indexOfFirstElement = enterTAGment.tagArray.indexOf(firstElement);
        if(index == indexOfFirstElement){
            console.log("first");
        }
        else{
            document.getElementById("imageHolder").remove();
            $("#darkBackground").remove();
            enterTAGment.showPopup(previousImage);
        }
    },

    openNextImage: function(tag){

        var index = enterTAGment.tagArray.indexOf(tag);
        var nextImage = enterTAGment.tagArray[index + 1];

        var lastElement = enterTAGment.tagArray[enterTAGment.tagArray.length -1];
        var indexOfLastElement = enterTAGment.tagArray.indexOf(lastElement);

        if(index == indexOfLastElement){
            console.log("last");
        }
        else{
            document.getElementById("imageHolder").remove();
            $("#darkBackground").remove();
            enterTAGment.showPopup(nextImage);
        }
    },

    formatDate: function(datum){

        //Thanks to https://gist.github.com/kmaida/6045266 for help with this
        var d = new Date(datum * 1000),	// Convert the passed timestamp to milliseconds
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
            dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
            ampm = 'AM',
            time;

        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh == 0) {
            h = 12;
        }

        // ie: 2013-02-18, 8:35 AM
        time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

        return time;
    }
};
window.onload = enterTAGment.init;