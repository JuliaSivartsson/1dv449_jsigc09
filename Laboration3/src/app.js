$(document).ready(function() {
    var defaultLat = 62.456514;
    var defaultLong = 15.024573;
    var defaultZoom = 5;

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

});