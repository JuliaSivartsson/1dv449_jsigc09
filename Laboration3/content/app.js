"use strict";

var Traffic = {


    valuesArray: ["Se alla", "Vägtrafik", "Kollektivtrafik", "Planerad störning", "Övrigt"],
    openStreetMapUrl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    defaultLat: 63.0,
    defaultLong: 13.0,
    defaultZoom: 5,
    jsonUrl: 'response.json',

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
        Traffic.valuesArray.forEach(function($value){
           var p = document.createElement('p');
            p.innerHTML = $value;
            div.appendChild(p);
        });
    },

    getTraffic: function(){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4 && xhr.status === 200){
                var response = JSON.parse(xhr.responseText);
                Traffic.renderMarkers(response['messages']);
            }
        };
        xhr.open("GET", Traffic.jsonUrl, false);
        xhr.send(null);
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

    renderMarkers: function(messages){

    },

    resetMap: function(){
        Traffic.map.setView([Traffic.defaultLat, Traffic.defaultLong], Traffic.defaultZoom);
    }



};
window.onload = Traffic.init;