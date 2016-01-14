"use strict";

var Traffic = {


    valuesArray: ["Vägtrafik", "Kollektivtrafik", "Planerad störning", "Övrigt", "Se alla"],
    openStreetMapUrl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    defaultLat: 63.0,
    defaultLong: 13.0,
    defaultZoom: 5,
    jsonUrl: 'response.json',
    markers: [],
    map: {},

    init: function(){

        //Create map
        Traffic.map = new L.Map('map', {
            center: [Traffic.defaultLat, Traffic.defaultLong], zoom: Traffic.defaultZoom
        });

        //Create tile layer with attribution
        var osmAttribute = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors | <a href="http://www.openstreetmap.org/copyright/en">CC BY-SA</a>';
        var openStreetMap = new L.TileLayer(Traffic.openStreetMapUrl, {attribution: osmAttribute});

        //Set it to Sweden
        Traffic.map.setView(new L.LatLng(Traffic.defaultLat, Traffic.defaultLong), Traffic.defaultZoom);
        Traffic.map.addLayer(openStreetMap);

        Traffic.getTraffic();
        Traffic.renderValues();

        //If user presses the resetButton then reset application
        var resetButton = document.getElementById('reset');
        resetButton.addEventListener('click', function(){
           Traffic.resetMap();
            Traffic.getTraffic();
            Traffic.map.closePopup();

            //Remove all "active" classes
            $("a").each(function() {
                if (this.classList.contains('active')) {
                    this.className = "valueLink";
                }
            });

            //Set "Se alla" as default value
            $("span").children().last().removeClass("valueLink").addClass("active");
        });

    },

    renderValues: function(){
      var div = document.getElementById('values');
        var id = 0;
        Traffic.valuesArray.forEach(function(value){
            var span = document.createElement('span');
            span.setAttribute('class', 'spanClass');
            var a = document.createElement('a');
            a.href = "#";
            a.setAttribute('id', id++);
            a.setAttribute('class', 'valueLink');
            a.innerHTML = value;
            span.appendChild(a);

            a.addEventListener('click', function(){
                $("a").each(function() {
                    if(this.classList.contains('active')){
                        this.className = "valueLink";
                    }
                });
                a.setAttribute('class', 'active');
               Traffic.changeValue(a.innerHTML);
            });
            div.appendChild(span);
        });

        //Set "Se alla" as default value
        $("span").children().last().removeClass("valueLink").addClass("active");
    },

    getTraffic: function(value, category){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4 && xhr.status === 200){
                var response = JSON.parse(xhr.responseText);
                Traffic.renderMarkers(Traffic.filterResponse(response['messages'], value));
                Traffic.renderMessages(Traffic.filterResponse(response['messages'], value));
            }
        };
        xhr.open("GET", Traffic.jsonUrl, false);
        xhr.send(null);
    },

    renderMessages: function(messages){
        //Sort list based on date
        messages.sort(Traffic.sortIncidentsByDate);
        messages.reverse();
        var incidentListContainer = document.getElementById("incidentList");

        //If list is rendered clear it
        incidentListContainer.innerHTML = "";

        //For each message render it under category
        messages.forEach(function(incident){
            var incidentText = incident.exactlocation +
                "<br /><b>Händelse inlagd kl " + Traffic.formatDate(incident.createddate) + "</b><br />" + incident.description + "<br />Kategori: " + incident.subcategory;

            var messageLink = document.createElement("div");
            messageLink.innerHTML = "<a href='#'>" + incident.title + "</a>";

            var messageText = document.createElement("p");
            messageText.setAttribute("class", "incidentDetails");
            messageText.innerHTML = incidentText;

            messageLink.appendChild(messageText);
            incidentListContainer.appendChild(messageLink);

            //Hide details
            $(".incidentDetails").hide();

            //If user clicks on incident then show details
            messageLink.addEventListener('click', function(){
               Traffic.renderDetails(this, incident);
            });
        });
    },

    renderDetails: function(link, incident){
        //Hide other details so only one can show
        $(".incidentDetails").hide(link);
        $(link).children().show();

        //Set view and open popup
        Traffic.map.setView([incident.latitude, incident.longitude], 12);
        Traffic.markers.forEach(function(marker){
            //If first row of popup is same as the incident title then open it
            if(marker._popup._content.split("<br />")[0] === incident.title){
                marker.openPopup();
            }
        });
    },

    sortIncidentsByDate: function(incident1, incident2){
        if(incident1['createddate'] < incident2['createddate']){
            return -1;
        }
        if(incident1['createddate'] > incident2['createddate']){
            return 1;
        }
        return 0;
    },

    //Sort messages based on category
    filterResponse: function(messages, value){
        if(value !== undefined && value !== 'Se alla'){
            messages = jQuery.grep(messages, function(incident){
                var incidentCategory = incident.category;
                return Traffic.valuesArray[incidentCategory] === value;
            });
        }
        return messages;
    },

    changeValue: function(value){
        Traffic.getTraffic(value);
    },

    renderMarkers: function(messages){
        //Remove existing markers
        Traffic.markers.forEach(function (marker) {
            Traffic.map.removeLayer(marker);
        });

        //Get info for each message
        messages.forEach(function(incident){
            var markerColor = Traffic.getMarkerColorBasedOnIncidentLevel(incident.priority);
            var markerIcon = Traffic.getMarkerIconBasedOnIncidentLevel(incident.priority);

            //Create icon from https://github.com/coryasilva/Leaflet.ExtraMarkers
            var icon = L.ExtraMarkers.icon({
                icon: markerIcon,
                markerColor: markerColor,
                shape: 'square',
                prefix: 'fa'
            });
            var marker = L.marker([incident.latitude, incident.longitude], {icon: icon}).addTo(Traffic.map);
            Traffic.markers.push(marker);

            //If user clicks on a marker
            marker.addEventListener('click', function(mark){
                Traffic.map.setView([mark.latlng.lat, mark.latlng.lng], 12);

                //Open info in list
                $("a").each(function() {
                    if($(this).text() === incident.title){
                        var details = this.parentNode.children[1];
                        $(".incidentDetails").hide();
                        details.style.display = "block";
                    }
                });
            });

            var getFormatDate = Traffic.formatDate(incident.createddate);
            var popupText = incident.title +
                "<br />" + incident.exactlocation +
                "<br /><b>Händelse inlagt kl " + getFormatDate +
                "</b><br />" + incident.description +
                "<br /><b>Kategori:</b> " + incident.subcategory;

            marker.bindPopup(popupText);
        });
    },

    formatDate: function(date){
        //Remove /Date(
        date = date.replace("/Date(", "");
        //Remove /
        date = date.replace(")/", "");

        //For some reason it needs two of the same before the other days
        var days = [
            "mån", "mån", "tis", "ons", "tors", "fre", "lör", "sön"
        ];

        //Same problem here as above
        var months = [
            "Januari", "Januari", "februari", "mars", "april", "juni", "juli", "augusti", "september", "oktober", "november", "december"
        ];

        //Make it into an integer and format it nicely
        date = parseInt(date, 10);
        date = new Date(date);

        var hours;
        var minutes;
        if (date.getHours() < 10) {
            hours = "0"+ date.getHours();
        }
        else{
            hours = date.getHours();
        }
        if (date.getMinutes() < 10) {
            minutes = "0"+ date.getMinutes();
        }
        else{
            minutes = date.getMinutes();
        }
        date = hours + ":" + minutes + " " + days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

        return date;
    },

    getMarkerColorBasedOnIncidentLevel: function(incidentLevel){
        var color = "";

        switch(incidentLevel){
            case 1:
                color = "orange-dark";
                break;
            case 2:
                color = "orange";
                break;
            case 3:
                color = "yellow";
                break;
            case 4:
                color = "cyan";
                break;
            case 5:
                color = "green-light";
                break;
        }
        return color;
    },

    getMarkerIconBasedOnIncidentLevel: function(incidentLevel){
        var fontAwesomeIcon = "";

        switch(incidentLevel){
            case 1:
                fontAwesomeIcon = "fa-warning";
                break;
            case 2:
                fontAwesomeIcon = "fa-exclamation-circle";
                break;
            case 3:
                fontAwesomeIcon =  "fa-exclamation";
                break;
            case 4:
                fontAwesomeIcon = "fa-info-circle";
                break;
            case 5:
                fontAwesomeIcon = "fa-info";
                break;
        }
        return fontAwesomeIcon;
    },

    resetMap: function(){
        Traffic.map.setView([Traffic.defaultLat, Traffic.defaultLong], Traffic.defaultZoom);
    }



};
window.onload = Traffic.init;