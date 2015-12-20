"use strict";

var Traffic = {

    options: ["Vägtrafik", "Kollektivtrafik", "Planerad störning", "Övrigt"],
    defaultLat: 63.0,
    defaultLong: 13.0,
    defaultZoom: 5,
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
            Traffic.map.closePopup();
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
                var category = incident.category;
                return Traffic.options[category] === option;
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
        //Remove existing markers
        Traffic.markers.forEach(function(marker){
            Traffic.map.removeLayer(marker);
        });

        messages.forEach(function(incident){
            //Based on incident lever change color on marker
            var markerColor = Traffic.getMarkerColorBasedOnIncidentLevel(incident.priority);
            var markerIcon = Traffic.getMarkerIconBasedOnIncidentLevel(incident.priority);

            //Create icon from https://github.com/coryasilva/Leaflet.ExtraMarkers
            var icon = L.ExtraMarkers.icon({
                icon: markerIcon,
                markerColor: markerColor,
                shape: 'square',
                prefix: 'fa'
            });
            var marker = L.marker([incident.latitude, incident.longitude], { icon: icon}).addTo(Traffic.map);
            Traffic.markers.push(marker);

            //If user clicks marker
            marker.addEventListener('click', function(mark){
                Traffic.map.setView([mark.latlng.lat, mark.latlng.lng], 14);

                //Open info in list
                $("a").each(function() {

                    //If link text is same as incident title
                    if($(this).text() === incident.title){

                        //Find parentDiv and show children
                        var parentDiv = $(this).parent();
                        $('.incidentDetails').hide(this);
                        parentDiv.children().show();
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

    renderMessages: function(incidentList){
        //Sort the list based on date
        incidentList.sort(Traffic.sortIncidentsByDate);
        incidentList.reverse();

        //If list is already rendered, clear it
        $("ul#incidentList").empty();

        incidentList.forEach(function(incident){
            var title = incident.title;
            var incidentText = incident.exactlocation +
                "<br /><b>Händelse inlagd kl " + Traffic.formatDate(incident.createddate) + "</b><br />" + incident.description + "<br />Kategori: " + incident.subcategory;

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

            //If user clicks on incident link then show details, zoom in and open popup
            messageLink.addEventListener("click", function(){
                Traffic.renderDetails(this, incident);
            });
        });
    },

    renderDetails: function(link, incident){
        //Hide details so not more than one detail can show at once
        $('.incidentDetails').hide(link);
        $(link).children().show();

        Traffic.map.setView([incident.latitude, incident.longitude], 12);

        //Open popup when user clicks incident
        Traffic.markers.forEach(function(marker){
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

    resetMap: function(){
        Traffic.map.setView([Traffic.defaultLat, Traffic.defaultLong], Traffic.defaultZoom);
    }
};

window.onload = Traffic.init;