"use strict";

var Traffic = {


    valuesArray: ["Vägtrafik", "Kollektivtrafik", "Planerad störning", "Övrigt", "Se alla"],
    openStreetMapUrl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    defaultLat: 63.0,
    defaultLong: 13.0,
    defaultZoom: 5,
    jsonUrl: 'response.json',
    markers: [],

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

        var resetButton = document.getElementById('reset');
        resetButton.addEventListener('click', function(){
           Traffic.resetMap();
            Traffic.getTraffic();
            Traffic.map.closePopup();
        });

    },

    renderValues: function(){
      var div = document.getElementById('values');
        var id = 0;
        Traffic.valuesArray.forEach(function(value){
            var p = document.createElement('p');
            var a = document.createElement('a');
            a.href = "#";
            a.setAttribute('id', id++);
            a.innerHTML = value;
            p.appendChild(a);

            a.addEventListener('click', function(){
               Traffic.changeValue(a.innerHTML, a.id);
            });
            div.appendChild(p);
        });
    },

    getTraffic: function(value, category){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4 && xhr.status === 200){
                var response = JSON.parse(xhr.responseText);
                Traffic.renderMarkers(Traffic.filterResponse(response['messages'], value, category));
            }
        };
        xhr.open("GET", Traffic.jsonUrl, false);
        xhr.send(null);
    },

    filterResponse: function(messages, value, category){
        if(value !== undefined && value !== 'Se alla'){
            messages = jQuery.grep(messages, function(incident){
                var incidentCategory = incident.category;
                return Traffic.valuesArray[incidentCategory] === value;
            });
        }
        return messages;
    },

    changeValue: function(value, category){
        Traffic.getTraffic(value, category);
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
                console.log(mark);
                Traffic.map.setView([mark.latlng.lat, mark.latlng.lng], 14);

                //Open info in list
                $("a").each(function() {
                    console.log($(this).text());
                    console.log(incident.title);
                    if($(this).text() === incident.title){
                      console.log(incident.title);
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

        //For some reason it comes one day ahead if I don't add "" before the other days
        var days = [
            "", "mån", "tis", "ons", "tors", "fre", "lör", "sön"
        ];

        //Same problem here as above
        var months = [
            "", "Januari", "februari", "mars", "april", "juni", "juli", "augusti", "september", "oktober", "november", "december"
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