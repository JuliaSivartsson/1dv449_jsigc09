<?php

class HtmlView
{

    public function render($result){
        $resultLabel = "";
        if($result !== ""){
            $resultLabel = '<p class="label-danger custom-error">'.$result.'</p>';
        }

        echo '<!DOCTYPE html>
            <html>
                <head>
                    <meta http-equiv="content-type" content="text/html; charset=ISO-8859-1" />
                    <!-- Latest compiled and minified CSS -->
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
                        integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
                    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css" />
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
                    <link rel="stylesheet" href="lib/css/leaflet.extra-markers.min.css">
                    <link rel="stylesheet" href="content/style.css" />
                    <title>Mashup</title>
                </head>
                <body>
                    <div id="page-header" class="page-header text-center">
                        <h1>Trafikkarta</h1>
                         '. $resultLabel .'
                        <noscript>
                            <div class="label-danger custom-error">
                                <p>
                                    JavaScript verkar inte vara aktiverat i din webbläsare, slå på för att ta del av sidans innehåll.
                                </p>
                                <p>
                                    <a href="http://www.enable-javascript.com" target="_blank">Här finns instruktioner om hur du aktiverar JavaScript</a>
                                </p>
                            </div>
                        </noscript>
                    </div>
                    <div id="content">
                        <div id="map" class="pull-left"></div>
                        <div class="col-md-4 pull-right">
                                <div class="valueContainer">
                                    <div id="values"></div>
                                </div>
                                <ul class="form-group" id="incidentList"></ul>
                            <div class="resetButton col-md-5">
                                <button class="btn btn-primary form-control" id="reset">Återställ</button>
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
                    <script src="lib/js/leaflet.extra-markers.min.js"></script>
                    <script src="content/app.js"></script>

                </body>
            </html>

        ';

    }
}