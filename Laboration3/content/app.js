"use strict";

var Traffic = {


    options: ["Vägtrafik", "Kollektivtrafik", "Planerad störning", "Övrigt"],
    defaultLat: 63.0,
    defaultLong: 13.0,
    defaultZoom: 5,
    incidentArray: [],
    markers: [],
    map: {},
    openStreetMapUrl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    jsonUrl: 'response.json',

    init: function(){

        //Create map
        Traffic.map = new L.Map('map', {
            center: [Traffic.defaultLat, Traffic.defaultLong], zoom: Traffic.defaultZoom
        });

        //Create the tile layer with correct attribution
        var osmAttribute = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors | <a href="http://www.openstreetmap.org/copyright/en">CC BY-SA</a>';
        var openStreetMap = new L.TileLayer(Traffic.openStreetMapUrl, {attribution: osmAttribute});

        //Set the map at Sweden
        Traffic.map.setView(new L.LatLng(Traffic.defaultLat, Traffic.defaultLong),Traffic.defaultZoom);
        Traffic.map.addLayer(openStreetMap);

        Traffic.getTraffic();
        Traffic.renderValuesInSelect();

        //If value in selectList changes redo traffic
        $('#selectList').on('change', function(){
            Traffic.getTraffic($(this).val());
        });

        //Resets application
        $('#reset').on('click', function(){
            Traffic.resetMap();
            $("#selectList").val("Alla kategorier");
            Traffic.getTraffic();
            $(".leaflet-popup-close-button")[0].click();
            $('.incidentDetails').hide();
        });
    },

    getTraffic: function(option){
        $.ajax(Traffic.jsonUrl)
            .done(function(data){
                Traffic.renderMarkers(Traffic.ifSelectValueChanges(data.messages, option));
                Traffic.renderMessages(Traffic.ifSelectValueChanges(data.messages, option));
            })
            .fail(function(){
                console.log("Ajax failed loading");
            });
    },

    ifSelectValueChanges: function(messages, option){
        if(option !== undefined && option !== 'Alla kategorier'){
            messages = jQuery.grep(messages, function(incident){
                var categoryNumber = incident.category;
                return Traffic.options[categoryNumber] === option;
            });
        }
        return messages;
    },

    renderValuesInSelect: function(){
        $('#selectList').append('<option value="Alla kategorier">Alla kategorier</option>');
        $.each(Traffic.options, function(index, category) {
            $('#selectList').append("<option value=\"" + category + "\">" + category + "</option>");
        });
    },

    renderMarkers: function(messages){
        Traffic.markers.forEach(function(marker){
            Traffic.map.removeLayer(marker);
        });

        messages.forEach(function(incident){
            Traffic.incidentArray.push(incident);

            //Based on incident lever change color on marker
            var markerColor = Traffic.getMarkerColorBasedOnIncidentLevel(incident.priority);

            var icon = L.MakiMarkers.icon({icon: "circle", color: markerColor, size: "m"});
            var marker = L.marker([incident.latitude, incident.longitude], { icon: icon}).addTo(Traffic.map);
            Traffic.markers.push(marker);

            marker.on('click', function(e){
                Traffic.map.setView([e.latlng.lat, e.latlng.lng], 14);
            });

            var getFormatDate = Traffic.formatDate(incident.createddate);
            var popupText = incident.title + "<br />" + incident.exactlocation +
                "<br /><b>Händelse inlagt den " + getFormatDate + "</b><br />" + incident.description +
                "<br /><b>Kategori:</b> " + incident.subcategory;

            marker.bindPopup(popupText);

        });
    },

    getMarkerColorBasedOnIncidentLevel: function(incidentLevel){
        var color = "";

        switch(incidentLevel){
            case 1:
                color = "FF0808";
                break;
            case 2:
                color = "FF8C08";
                break;
            case 3:
                color = "FFC508";
                break;
            case 4:
                color = "FFEF08";
                break;
            case 5:
                color = "77FF08";
                break;
        }
        return color;
    },

    renderMessages: function(incidentList){
        //Sort the list based on date
        incidentList.sort(Traffic.sortIncidentsByDate);
        incidentList.reverse();

        //If list is already rendered, clear it
        $("ul#incidentList").empty();

        incidentList.forEach(function(incident){
            var title = incident.title;
            var incidentText = incident.exactlocation +
                "<br />" + Traffic.formatDate(incident.createddate) + "<br />" + incident.description + "<br />" + incident.subcategory;


            var messageLink = document.createElement("div");
            messageLink.innerHTML = "<a href='#'>" + incident.title + "</a>";

            var messageText = document.createElement("p");
            messageText.setAttribute("class", "incidentDetails");
            messageText.innerHTML = incidentText;

            var incidentList= document.getElementById("incidentList");
            messageLink.appendChild(messageText);
            incidentList.appendChild(messageLink);

            //Don't show details until user clicks incident
            $('.incidentDetails').hide();

            messageLink.addEventListener("click", function(){
                $('.incidentDetails').hide(this);
                console.log(this);
                $(this).children().show();
                var details = $(this).next();
                details.slideDown('fast');

                Traffic.map.setView([incident.latitude, incident.longitude], 14);

                //Open popup when user clicks incident
                Traffic.markers.forEach(function(marker){
                    if(marker._popup._content.split("<br />")[0] === title){
                        marker.openPopup();
                    }
                });
            });
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

    formatDate: function(date){
        var months = [
            "Januari", "Februari", "Mars", "April", "Mars", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"
        ];

        //Remove /Date
        date = date.replace("/Date(", "");
        date = date.replace(")/", "");

        //Make it into an integer and format it nicely
        date = parseInt(date, 10);
        date = new Date(date);
        date = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

        return date;
    },

    resetMap: function(){
        Traffic.map.setView([Traffic.defaultLat, Traffic.defaultLong], Traffic.defaultZoom);
    }
};

window.onload = Traffic.init;