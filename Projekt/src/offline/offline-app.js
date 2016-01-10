"use strict";

var enterTAGment = {

    tags: ["supernatural", "doctorwho", "sherlock", "lotr", "harrypotter"],
    tagInfoArray: [],
    recentTagInfoArray: [],

    current_page: 1,
    records_per_page: 4,
    index: 0,
    array: [],
    imagesToShow: [],

    init: function(){
        enterTAGment.getResponse("response.json");
        enterTAGment.getResponse("responseMonth.json");

        //After one secound run drawStatistics
        setTimeout(function(){
            enterTAGment.drawStatistics();
        }, 1000);

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

    //Get result from file
    getResponse: function(fileName){
        enterTAGment.tags.forEach(function(tag){
            $.ajax(tag + fileName)
                .done(function(data){
                    var response = JSON.parse(data);
                    enterTAGment.saveResponseIntoArray(tag, response['data']);
                })
                .fail(function(){
                    console.log("Ajax failed loading");
                });
        });
    },

    drawStatistics: function(){

        enterTAGment.tags.forEach(function(tag){
            var found = enterTAGment.recentTagInfoArray.some(function (el) {
                return el.name === tag;
            });

            if(!found){
                var object = {"name": tag, "count": 0, "data": null};
                enterTAGment.recentTagInfoArray.push(object);
            }
        });

        var tableContainerOverall = document.getElementById('info-overall');
        var tbl = document.createElement('table');
        tbl.setAttribute('class', 'table table-striped text text-left');

        var tbdy = document.createElement('tbody');
        var trHead = document.createElement('tr');
        var thHead = document.createElement('th');
        thHead.innerHTML = "Fandom";
        var thHead1 = document.createElement('th');
        thHead1.innerHTML = "Count";
        trHead.appendChild(thHead);
        trHead.appendChild(thHead1);
        tbdy.appendChild(trHead);
        enterTAGment.tagInfoArray.forEach(function(tag){
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            var td1 = document.createElement('td');

            var a = document.createElement('a');
            a.href = "#";
            a.innerHTML = tag['name'];

            td.appendChild(a);
            td1.appendChild(document.createTextNode(tag['count']));
            tr.appendChild(td);
            tr.appendChild(td1);
            tbdy.appendChild(tr);

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
                p.innerHTML = "<h1 class='title'>#"+ tag['name'] +"</h1>";
                p.setAttribute('class', 'detailsTitle');

                tagDetails.appendChild(p);
                tagDetails.setAttribute('class', 'tagDetails');

                var centerDiv = document.createElement('div');
                centerDiv.setAttribute('id', 'centerDiv');
                centerDiv.setAttribute('class', 'centerDiv');
                tagDetails.appendChild(centerDiv);

                $('#tagDetails').show();

                enterTAGment.imagesToShow.forEach(function(tagInfo){
                    enterTAGment.saveImagesForPagination(tagInfo['data'], tag['name']);
                });

                $('html, body').animate({
                    scrollTop: $("#centerDiv").offset().top
                }, 1000);
            });
        });

        tbl.appendChild(tbdy);
        tableContainerOverall.appendChild(tbl);


        var tableContainerMonth = document.getElementById('info-month');
        var tblMonth = document.createElement('table');
        tblMonth.setAttribute('class', 'table table-striped text text-left');

        var tbdyMonth = document.createElement('tbody');
        var trHeadMonth = document.createElement('tr');
        var thHeadMonth = document.createElement('th');
        thHeadMonth.innerHTML = "Fandom";
        var thHead1Month = document.createElement('th');
        thHead1Month.innerHTML = "Count";
        trHeadMonth.appendChild(thHeadMonth);
        trHeadMonth.appendChild(thHead1Month);
        tbdyMonth.appendChild(trHeadMonth);
        enterTAGment.recentTagInfoArray.forEach(function(tag) {
            var trMonth = document.createElement('tr');
            var tdMonth = document.createElement('td');
            var td1Month = document.createElement('td');

            var aMonth = document.createElement('a');
            aMonth.href = "#";
            aMonth.innerHTML = tag['name'];

            aMonth.addEventListener('click', function() {

                enterTAGment.array = [];
                event.preventDefault();
                var tagDetails = document.getElementById('tagDetails');

                //Clear div before rendering new info
                while (tagDetails.hasChildNodes()) {
                    tagDetails.removeChild(tagDetails.lastChild);
                }
                enterTAGment.current_page = 1;

                var p = document.createElement('p');
                p.innerHTML = "<h1 class='title'>#" + tag['name'] + "</h1>";
                p.setAttribute('class', 'detailsTitle');

                tagDetails.appendChild(p);
                tagDetails.setAttribute('class', 'tagDetails');

                var centerDiv = document.createElement('div');
                centerDiv.setAttribute('id', 'centerDiv');
                centerDiv.setAttribute('class', 'centerDiv');
                tagDetails.appendChild(centerDiv);

                $('#tagDetails').show();

                enterTAGment.imagesToShow.forEach(function (tagInfo) {
                    enterTAGment.saveImagesForPagination(tagInfo['data'], tag['name']);
                });

                $('html, body').animate({
                    scrollTop: $("#centerDiv").offset().top
                }, 1000);

            });
            tdMonth.appendChild(aMonth);
            td1Month.appendChild(document.createTextNode(tag['count']));
            trMonth.appendChild(tdMonth);
            trMonth.appendChild(td1Month);
            tbdyMonth.appendChild(trMonth);
        });

        tblMonth.appendChild(tbdyMonth);
        tableContainerMonth.appendChild(tblMonth);
    },

    saveResponseIntoArray: function(tagName, data){
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
                var thirtyDaysAgo = new Date().setDate(new Date().getDate() - 30)/1000;

                if (result["created_time"] > thirtyDaysAgo) {
                    console.log(result["created_time"]);

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

    },

    showPopup: function(tag){

        var darkBackground = document.createElement('div');
        darkBackground.setAttribute('id', 'darkBackground');

        var imageHolder = document.createElement('div');
        imageHolder.setAttribute('id', 'imageHolder');
        imageHolder.setAttribute('class', 'imageHolder');

        //imageHolder.style.top = screen.height/2 + "px";
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


        console.log(img.offsetHeight);
        if(img.offsetHeight < 40){
            var imgError = document.createElement('img');
            imgError.setAttribute('class', 'col-md-10 padding-bottom');
            imgError.src = "src/content/img/error.jpg";
            while (thumbnail.firstChild) {
                thumbnail.removeChild(thumbnail.firstChild);
            }
            caption.appendChild(userP);
            thumbnail.appendChild(close);
            thumbnail.appendChild(previous);
            thumbnail.appendChild(imgError);
            thumbnail.appendChild(next);

        }

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

            var imgError = document.createElement('img');
            imgError.src = "src/content/img/error.jpg";

            aLink.appendChild(img);
            thumbnail.appendChild(aLink);
            paginationContainer.appendChild(thumbnail);

            if (thumbnail.offsetHeight > 40) {
                aLink.addEventListener('click', function () {
                    event.preventDefault();
                    enterTAGment.showPopup(image);
                });
            }
            else {
                console.log(thumbnail);
                aLink.removeChild(img);
                aLink.addEventListener('click', function () {
                    event.preventDefault();
                });
                aLink.appendChild(imgError);
            }
        }
    }

};
window.onload = enterTAGment.init;