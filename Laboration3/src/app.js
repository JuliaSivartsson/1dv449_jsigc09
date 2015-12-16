"use strict";

var Traffic = {


    options: ["Vägtrafik", "Kollektivtrafik", "Planerad störning", "Övrigt"],
    defaultLat: 60.2,
    defaultLong: 12.0,
    defaultZoom: 5,
    incidentArray: [],
    markers: [],
    map: {},

    init: function(){
        //Create map
        Traffic.map = new L.Map('map', {
           center: [Traffic.defaultLat, Traffic.defaultLong], zoom: Traffic.defaultZoom
        });

        //Render map
        var googleMap = new L.Google('ROADMAP');
        Traffic.map.addLayer(googleMap);

        Traffic.getTraffic();
        Traffic.renderValuesInSelect();

        $('#selectList').on('change', function(){
            Traffic.getTraffic($(this).val());
        });

        $('#reset').on('click', function(){
            Traffic.resetMap();
            $("#selectList").val("Alla kategorier");
            Traffic.getTraffic();
            $(".leaflet-popup-close-button")[0].click();
            $('.incidentdetails').hide();
        });
    },

    getTraffic: function(option){
        $.ajax('response.json')
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
            var markerColor = "";
            switch (incident.priority){
                case 1:
                    markerColor = "FF0808";
                    break;
                case 2:
                    markerColor = "FF8C08";
                    break;
                case 3:
                    markerColor = "FFC508";
                    break;
                case 4:
                    markerColor = "FFEF08";
                    break;
                case 5:
                    markerColor = "77FF08";
                    break;
            }

            var icon = L.MakiMarkers.icon({icon: "circle", color: markerColor, size: "m"});
            var marker = L.marker([incident.latitude, incident.longitude], { icon: icon}).addTo(Traffic.map);
            Traffic.markers.push(marker);

            marker.on('click', function(e){
                Traffic.map.setView([e.latlng.lat, e.latlng.lng], 14);

                //And view incident in list
                var popupTitle = e.target._popup._content.split("<br />")[0];
                $('.incident').each(function(index, incident) {
                    if (incident.text === popupTitle) {
                        $(this).next().slideDown('fast');
                    }
                });
            });

            var parsedDate = Traffic.formatDate(incident.createddate);
            var popupText = incident.title + "<br />" + incident.exactlocation +
                "<br />" + parsedDate + "<br />" + incident.description +
                "<br />" + incident.subcategory;

            marker.bindPopup(popupText);

        });
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

            $("ul#incidentList").append("<li><a class='incident priority" + incident.priority + "' href='#'>" + incident.title + "</a><p class='incidentdetails'>" + incidentText + "</p></li>");

            //Don't show details until user clicks incident
            $('.incidentdetails').hide();

            $('.incident').on('click', function(event) {
                event.preventDefault();
                $('.incidentdetails').hide();
                var details = $(this).next();
                details.slideDown('fast');

                // Also zoom map on clicked incident
                var latitude;
                var longitude;
                var title = $(this).html();

                Traffic.incidentArray.forEach(function(incident) {
                    if (incident.title === title) {
                        latitude = incident.latitude;
                        longitude = incident.longitude;
                    }
                });
                Traffic.map.setView([latitude, longitude], 14);

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
        var date1 = incident1.createddate.replace("/Date(", "");
        date1 = date1.replace(")/", "");

        var date2 = incident2.createddate.replace("/Date(", "");
        date2 = date2.replace(")/", "");

        if(date1 < date2){
            return -1;
        }
        if(date1 > date2){
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