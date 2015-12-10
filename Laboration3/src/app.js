$(document).ready(function() {
    var defaultLat = 62.456514;
    var defaultLong = 15.024573;
    var defaultZoom = 5;

    var markers = [];
    var incidentArray = [];

    var categories = {
        "0" : "Vägtrafik",
        "1" : "Kollektivtrafik",
        "3" : "Planerad störning",
        "4" : "Övrigt"
    }

    //Create map
    var map = new L.Map('map', {
        center: new L.LatLng(defaultLat, defaultLong), zoom: defaultZoom
    });

    //Render Google map
    var googleLayer = new L.Google('ROADMAP');
    map.addLayer(googleLayer);

    renderTraffic();
    renderValuesInSelect();


    function renderTraffic(filter){
        $.ajax('response.json')
            .done(function(data){
                renderMarkers(filterArray(data.messages, filter));
                renderList(filterArray(data.messages, filter));
            })
            .fail(function(){
                console.log("Ajax failed loading");
            });
    }

    //If  select tag i changed, render new list
    $('#filter').on('change', function(){
        var filteredList = filterArray(incidentArray, $(this).val());
        renderTraffic($(this).val());
    });

    //Render list based on which category is active
    function filterArray(list, filter){
        if(filter !== undefined && filter !== 'Alla kategorier'){
            list = jQuery.grep(list, function(incident){
                var categoryNumber = incident.category;
                return categories[categoryNumber] === filter;
            });
        }
        return list;
    }

    //Show values in select list
    function renderValuesInSelect(){
        $('#filter').append('<option value="Alla kategorier">Alla kategorier</option>');
        $.each(categories, function(index, category) {
            $('#filter').append("<option value=\"" + category + "\">" + category + "</option>");
        });
    }

    function renderMarkers(messages){
        //If markers exists, remove them
        markers.forEach(function(marker){
            map.removeLayer(marker);
        });
        markers = [];
        incidentArray = [];

        //Draw new markers
        messages.forEach(function(incident){
            incidentArray.push(incident);

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

            //Create icon from MakiMarkers
            var icon = L.MakiMarkers.icon({ icon: "circle", color: markerColor, size: "m"});

            //Create the marker
            var marker = L.marker([incident.latitude, incident.longitude], { icon: icon}).addTo(map);
            markers.push(marker);
            //When user click on marker, zoom to it
            marker.on('click', function(e) {
                map.setView([e.latlng.lat, e.latlng.lng], 14);

                //And view incident in list
                var popupTitle = e.target._popup._content.split("<br />")[0];
                $('.incident').each(function(index, incident) {
                    if (incident.text === popupTitle) {
                        $(this).next().slideDown('fast');
                    }
                });
            });

            var parsedDate = formatDate(incident.createddate);
            var popupText = incident.title + "<br />" + incident.exactlocation +
                "<br />" + parsedDate + "<br />" + incident.description +
                "<br />" + incident.subcategory;

            marker.bindPopup(popupText);
        });
    }

    function renderList(incidentList){
        //Sort the list based on date
        incidentList.sort(sortIncidentsByDate);
        incidentList.reverse();

        //If list is already rendered, clear it
        $("ul#list").empty();

        incidentList.forEach(function(incident){
            var title = incident.title;
            var incidentText = incident.exactlocation +
                "<br />" + formatDate(incident.createddate) + "<br />" + incident.description + "<br />" + incident.subcategory;

            $("ul#list").append("<li><a class='incident priority" + incident.priority + "' href='#'>" + incident.title + "</a><p class='incidentdetails'>" + incidentText + "</p></li>");

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

                incidentArray.forEach(function(incident) {
                    if (incident.title === title) {
                        latitude = incident.latitude;
                        longitude = incident.longitude;
                    }
                });

                map.setView([latitude, longitude], 14);

                //Open popup when user clicks incident
                markers.forEach(function(marker){
                    if(marker._popup._content.split("<br />")[0] === title){
                        marker.openPopup();
                    }
                });
            });
        });
    }

    function formatDate(date){
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
    }

    function sortIncidentsByDate(incident1, incident2){
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
    }

    //Reset map to default view
    function resetMap(){
        map.setView([defaultLat, defaultLong], defaultZoom);
    }

    //Resets application
    $('#reset').on('click', function() {
        resetMap();
        $('#filter').val('Alla kategorier');
        renderTraffic();

        $(".leaflet-popup-close-button")[0].click();
    });
});