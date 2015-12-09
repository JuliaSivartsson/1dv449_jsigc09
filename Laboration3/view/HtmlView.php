<?php

class HtmlView
{

    public function render(){
        echo '<!DOCTYPE html>
            <html>
                <head>
                    <meta http-equiv="content-type" content="text/html; charset=ISO-8859-1" />
                    <link rel="stylesheet" href="lib/leaflet.css" />
                    <link rel="stylesheet" href="lib/bootstrap.min.css" />
                    <link rel="stylesheet" href="src/style.css" />
                    <title>Mashup</title>
                </head>
                <body>
                    <div class="page-header text-center">
                        <h1>Trafikkarta</h1>
                    </div>
                    <div id="content">
                        <div id="map"></div>
                        <div class="col-md-5">
                            <div class="form-group">
                                <label for="filter">Välj kategori:</label>
                                <select id="filter" class="form-control"></select>
                            </div>
                                <ul class="form-group" id="list"></ul>
                            <div>
                                <button class="btn btn-primary form-control" id="reset">Återställ</button>
                            </div>
                        </div>

                    </div>

                <script src="lib/leaflet.js"></script>
                <script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false&key=AIzaSyCZDfZaBKd7QqOSgt_OU3G0OS3OB0TaJmI"></script>
                <script src="lib/leaflet-google.js"></script>
                <script src="lib/Leaflet.MakiMarkers.js"></script>
                <script src="lib/jquery-1.11.3.min.js"></script>
                <script src="src/app.js"></script>


                </body>
            </html>

        ';

    }
}