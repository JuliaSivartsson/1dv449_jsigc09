<?php

class HtmlView
{

    public function render(){
        echo '<!DOCTYPE html>
            <html>
                <head>
                    <meta http-equiv="content-type" content="text/html; charset=ISO-8859-1" />
                    <!-- Latest compiled and minified CSS -->
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
                        integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
                    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css" />
                    <link rel="stylesheet" href="content/style.css" />
                    <title>Mashup</title>
                </head>
                <body>
                    <div class="page-header text-center">
                        <h1>Trafikkarta</h1>
                    </div>
                    <div id="content">
                        <div id="map" class="pull-left"></div>
                        <div class="col-md-3 pull-right margin-right">
                            <div class="form-group">
                                <label for="selectList">Välj kategori:</label>
                                <select id="selectList" class="form-control"></select>
                            </div>
                                <ul class="form-group" id="incidentList"></ul>
                            <div>
                                <button class="btn btn-primary form-control" id="reset">Återställ</button>
                            </div>

                            <div id="messages">

                            </div>

                            <div class="incident-level margin-top">
                                <img src="content/img/1.jpg"><p class="small">1 = Mycket allvarlig händelse</p>
                            </div>
                            <div class="incident-level">
                                 <img src="content/img/2.jpg"><p class="small">2 = Stor händelse</p>
                            </div>
                            <div class="incident-level">
                                 <img src="content/img/3.jpg"><p class="small">3 = Störning</p>
                             </div>
                             <div class="incident-level">
                                 <img src="content/img/4.jpg"><p class="small">4 = Information</p>
                             </div>
                             <div class="incident-level">
                                 <img src="content/img/5.jpg"><p class="small">5 = Mindre störning</p>
                             </div>
                        </div>
                    </div>

                <script src="lib/leaflet.js"></script>
                <script src="lib/jquery-1.11.3.min.js"></script>
                <script src="lib/Leaflet.MakiMarkers.js"></script>
                <script src="content/app.js"></script>


                </body>
            </html>

        ';

    }
}