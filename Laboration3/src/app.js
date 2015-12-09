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
    renderValueInSelect();

    
    function renderTraffic(filter){
        $.ajax('response.json')
            .done(function(data){
            renderMarkers(filterArray(data.messages, filter));
            renderList(filterarray(data.messages, filter));
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

    //Show values in select list
    function renderValueInSelect(){
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
        });
    }
});