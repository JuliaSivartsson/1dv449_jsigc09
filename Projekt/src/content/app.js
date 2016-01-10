"use strict";

var enterTAGment = {

    tags: tagArray,
    //fileRoot: "response.json",
    tagInfoArray: [],
    recentTagInfoArray: [],
    //imageArray: [],
    //tagArray: [],
    //response: [],

    current_page: 1,
    records_per_page: 4,
    index: 0,
    array: [],
    imagesToShow: [],


init: function(){

        // Load the Visualization API and the barchart package.
        google.charts.load('current', {packages: ['corechart']});
        google.charts.setOnLoadCallback(enterTAGment.drawChart);

        enterTAGment.getResponse("response.json");
        enterTAGment.getResponse("responseMonth.json");

        $(document).mouseup(function (e)
        {
            var container = $("#imageHolder");

            //Click isn't the container, descendant of container or scrollbar
            if (!container.is(e.target) && container.has(e.target).length === 0 && e.target != $('html').get(0))
            {
                container.remove();
                $("#darkBackground").remove();
            }
        });
    },

    //Get overall statistics
    getResponse: function(fileName){

        enterTAGment.tags.forEach(function(tag){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (xhr.readyState === 4 && xhr.status === 200){
                    var response = JSON.parse(xhr.responseText);
                    enterTAGment.saveResponseIntoArray(tag, response["data"]);

                    var divExists = document.getElementById("error");
                    if(divExists) {
                        divExists.remove();
                    }
                }
                else{
                    enterTAGment.handleError();
                }
            };
            xhr.open("GET", tag + fileName, false);
            xhr.send(null);
        })
    },

    handleError: function(){
        var divExists = document.getElementById("error");
        if(!divExists){
            var div = document.createElement("div");
            div.setAttribute("id", "error");
            div.setAttribute("class", "label-danger custom-error");
            var p = document.createElement("p");
            p.innerHTML = "Something went wrong, data could not be presented.";
            div.appendChild(p);

            var headerDiv = document.getElementById("page-header");
            headerDiv.appendChild(div);
            return false;
        }
    },

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

            if(!found){
                var object = {"name": tag, "count": 0, "data": null};
                enterTAGment.recentTagInfoArray.push(object);
            }
        });

        enterTAGment.recentTagInfoArray.forEach(function(tagInfo){
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

                    enterTAGment.array = [];
                    event.preventDefault();
                    var tagDetails = document.getElementById('tagDetails');

                    //Clear div before rendering new info
                    while (tagDetails.hasChildNodes()) {
                        tagDetails.removeChild(tagDetails.lastChild);
                    }
                    enterTAGment.current_page = 1;

                    var p = document.createElement('p');
                    p.innerHTML = "<h1 class='title'>#"+ el.textContent +"</h1>";
                    p.setAttribute('class', 'detailsTitle');

                    tagDetails.appendChild(p);
                    tagDetails.setAttribute('class', 'tagDetails');

                    var centerDiv = document.createElement('div');
                    centerDiv.setAttribute('id', 'centerDiv');
                    centerDiv.setAttribute('class', 'centerDiv');
                    tagDetails.appendChild(centerDiv);

                    $('#tagDetails').show();

                    console.log("imagesToShow: ", enterTAGment.imagesToShow);
                    enterTAGment.imagesToShow.forEach(function(tagInfo){
                        enterTAGment.saveImagesForPagination(tagInfo['data'], el.textContent);
                    });

                    $('html, body').animate({
                        scrollTop: $("#centerDiv").offset().top
                    }, 1000);
                });
            }
        });
    },

    saveResponseIntoArray: function(tagName, data){
        var thirtyDaysAgo = new Date().setDate(new Date().getDate() - 30)/1000;
        console.log("thirty: ", thirtyDaysAgo);

        if(data['media_count']){
            var object = {"name": data['name'], "count": data['media_count']};
            enterTAGment.tagInfoArray.push(object);
        }
        else{

            var count = 0;
            var array = [];
            var object = {};

            //Loop through array and save info about latest month
            data.forEach(function(result){
                if (result["created_time"] > thirtyDaysAgo) {

                    var ifItAlreadyIsInArray = $.grep(enterTAGment.recentTagInfoArray, function(e){ return e.name == tagName; });
                    if(ifItAlreadyIsInArray == 0){
                        count++;
                        array.push(result);
                        object = {"name": tagName, "count": count, "data": array};
                        enterTAGment.recentTagInfoArray.push(object);
                    }
                    else{
                        ifItAlreadyIsInArray[0].count = ifItAlreadyIsInArray[0].count + 1;
                        array.push(result);
                        ifItAlreadyIsInArray[0].data = array;
                    }
                }

                var ifExistsInImageArray = $.grep(enterTAGment.imagesToShow, function(e){ return e.name == tagName; });
                if(ifExistsInImageArray == 0){
                    count++;
                    array.push(result);
                    object = {"name": tagName, "count": count, "data": array};
                    enterTAGment.imagesToShow.push(object);
                }
                else{
                    ifExistsInImageArray[0].count = ifExistsInImageArray[0].count + 1;
                    array.push(result);
                    ifExistsInImageArray[0].data = array;
                }
            });
        }
    },

    saveImagesForPagination: function(data, title){
        if(data !== null){
            data.forEach(function(tag) {

                tag['tags'].forEach(function (imgTag) {
                    if (imgTag == title) {

                        var pExists = document.getElementById('tag-info');
                        if(pExists){
                           pExists.remove();
                        }

                        //Only display each image once
                        var inArray = $.inArray(tag, enterTAGment.array);
                        var same = document.getElementById(tag['id']);
                        if(inArray === -1 && same === null){
                            console.log('hej');
                            enterTAGment.array.push(tag);
                            enterTAGment.changePage(1);
                        }
                    }
                });
            });
        }

        var thumb = document.getElementsByClassName('thumbnail');
        if(thumb.length === 0){
            var tagDetails = document.getElementById('tagDetails');
            var pExists = document.getElementById('tag-info');
            if(!pExists){
                var p = document.createElement('p');
                p.setAttribute('id', 'tag-info');
                p.setAttribute('class', 'alert alert-info text-center');
                p.innerHTML = "No images with this tag has been posted in the last month!";
                tagDetails.appendChild(p);
            }
        }

    },

    showPopup: function(tag){

        var darkBackground = document.createElement('div');
        darkBackground.setAttribute('id', 'darkBackground');

        var imageHolder = document.createElement('div');
        imageHolder.setAttribute('id', 'imageHolder');
        imageHolder.setAttribute('class', 'imageHolder');

        imageHolder.style.left = screen.width/3 + "px";

        var thumbnail = document.createElement('div');
        thumbnail.setAttribute('class', 'thumbnail');

        var img = document.createElement('img');
        img.setAttribute('class', 'col-md-10 padding-bottom');
        img.src = tag['images']['standard_resolution']['url'];

        var caption = document.createElement('div');
        caption.setAttribute('id', 'caption');
        caption.innerHTML = "<h3>" + tag['caption']['text'] + "</h3>";

        var close = document.createElement('a');
        close.setAttribute('class', 'height');
        close.src = "#";
        close.style.cursor = "pointer";
        close.innerHTML = ' <i class="fa fa-times fa-lx"></i>';

        var previous = document.createElement('div');
        previous.setAttribute('class', 'col-md-1 margin-top-left');
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
        userP.innerHTML = "<p>"+tag['user']['username'] +", "+enterTAGment.formatDate(tag['created_time'])+"</p>";

        caption.appendChild(userP);
        thumbnail.appendChild(close);
        thumbnail.appendChild(previous);
        thumbnail.appendChild(img);
        thumbnail.appendChild(next);
        thumbnail.appendChild(caption);
        imageHolder.appendChild(thumbnail);
        document.body.appendChild(darkBackground);
        document.body.appendChild(imageHolder);


        var imgHolder = document.getElementById('imageHolder');
        var imgHolderHeight = $('#imageHolder').height();
        imgHolder.style.marginTop = "-" + imgHolderHeight / 2 + "px";
    },

    openPreviousImage: function(tag){

        var index = enterTAGment.array.indexOf(tag);
        var previousImage = enterTAGment.array[index - 1];

        var firstElement = enterTAGment.array[0];
        var indexOfFirstElement = enterTAGment.array.indexOf(firstElement);
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

        var index = enterTAGment.array.indexOf(tag);
        var nextImage = enterTAGment.array[index + 1];

        var lastElement = enterTAGment.array[enterTAGment.array.length -1];
        var indexOfLastElement = enterTAGment.array.indexOf(lastElement);

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
    },

    prevPage: function() {
        if (enterTAGment.current_page > 1) {
            enterTAGment.current_page--;
            enterTAGment.changePage(enterTAGment.current_page);
        }
    },

    nextPage: function() {
        if (enterTAGment.current_page < enterTAGment.numPages()) {
            enterTAGment.current_page++;
            enterTAGment.changePage(enterTAGment.current_page);
        }
    },

    numPages: function() {
        return Math.ceil(enterTAGment.array.length / enterTAGment.records_per_page);
    },

    //Found help with the solution here: http://stackoverflow.com/questions/25434813/simple-pagination-in-javascript
    changePage: function(page) {

        var listing_tableExists = document.getElementById("paginationContainer");
        var renderPage;
        var paginationContainer;
        var btnNext;
        var btnPrev;



        if(!listing_tableExists){

            var btnContainer = document.createElement('div');
            btnContainer.setAttribute('class', 'btnContainer');

            //Create div for page info
            renderPage = document.createElement("div");
            renderPage.setAttribute("id", "page");

            //Create prev button
            btnPrev = document.createElement("a");
            btnPrev.setAttribute("id", "btnPrev");
            var prevText = document.createTextNode("Prev");
            btnPrev.appendChild(prevText);
            btnPrev.href = "javascript:enterTAGment.prevPage()";

            //Create next button
            btnNext = document.createElement("a");
            btnNext.setAttribute("id", "btnNext");
            var nextText = document.createTextNode("Next");
            btnNext.appendChild(nextText);
            btnNext.href = "javascript:enterTAGment.nextPage()";

            btnContainer.appendChild(renderPage);
            btnContainer.appendChild(btnPrev);
            btnContainer.appendChild(btnNext);

            //Create div that contains pagination
            paginationContainer = document.createElement("div");
            paginationContainer.setAttribute("id", "paginationContainer");

            var tagDetails = document.getElementById("tagDetails");
            tagDetails.appendChild(btnContainer);
            tagDetails.appendChild(paginationContainer);
        }
        else{
            btnNext = document.getElementById("btnNext");
            btnPrev = document.getElementById("btnPrev");
            paginationContainer = document.getElementById("paginationContainer");
            renderPage = document.getElementById("page");
        }


        // Validate page
        if (page < 1) page = 1;
        if (page > enterTAGment.numPages()) page = enterTAGment.numPages();

        paginationContainer.innerHTML = "";

        for (var i = (page-1) * enterTAGment.records_per_page; i < (page * enterTAGment.records_per_page) && i < enterTAGment.array.length; i++) {
            enterTAGment.displayPictures(enterTAGment.array[i]);
        }
        renderPage.innerHTML = page + "/" + enterTAGment.numPages();

        if (page == 1) {
            btnPrev.style.pointerEvents = "none";
            btnPrev.style.textDecoration = "none";
            btnPrev.style.color = "#eee";
        } else {
            btnPrev.style.pointerEvents = "auto";
            btnPrev.style.textDecoration = "underline";
            btnPrev.style.color = "#000";
        }

        if (page == enterTAGment.numPages()) {
            btnNext.style.pointerEvents = "none";
            btnNext.style.textDecoration = "none";
            btnNext.style.color = "#eee";
        } else {
            btnNext.style.pointerEvents = "auto";
            btnNext.style.textDecoration = "underline";
            btnNext.style.color = "#000";
        }
    },

    displayPictures: function(image){
        var same = document.getElementById(image['id']);
        if(same === null) {

            var paginationContainer = document.getElementById("paginationContainer");

            var thumbnail = document.createElement('div');
            thumbnail.setAttribute('class', 'col-xs-6 col-md-3 center-block');
            thumbnail.setAttribute('id', image['id']);

            var aLink = document.createElement('a');
            aLink.href = '#';
            aLink.setAttribute('class', 'thumbnail');

            var img = document.createElement('img');
            img.src = image['images']['standard_resolution']['url'];

            aLink.appendChild(img);
            thumbnail.appendChild(aLink);
            paginationContainer.appendChild(thumbnail);

            aLink.addEventListener('click', function () {
                event.preventDefault();
                enterTAGment.showPopup(image);
            });
        }
    }

};
window.onload = enterTAGment.init;