<?php
/**
 * Created by PhpStorm.
 * User: julia
 * Date: 2015-12-16
 * Time: 17:19
 */

namespace view;


class DefaultView
{
    public function render($result){

        $resultLabel = "";
        if($result !== ""){
            $resultLabel = '<p class="label-danger custom-error">'.$result.'</p>';
        }

        echo '<!DOCTYPE html>
            <html>
                <head>
                    <script>
                        var run = function(){
                         if (Offline.state === "up")
                         Offline.check();
                         };
                         setInterval(run, 5000);
                    </script>
                    <meta http-equiv="content-type" content="text/html; charset=ISO-8859-1" />

                    <link rel="icon" type="image/png" href="src/content/img/fav.png">
                    <script src="//fast.eager.io/3XbiE24uTU.js"></script>
                    <link rel="stylesheet" href="src/lib/font-awesome/css/font-awesome.min.css">
                    <link rel="stylesheet" href="src/lib/bootstrap-3.3.6-dist/css/bootstrap.min.css">
                    <link rel="stylesheet" href="src/content/style.css" />
                    <title>enterTAGment</title>
                </head>
                <body>
                    <div class="overlay">
                        <div class="page-header text-center">
                            <h1 class="title">enterTAGment <i class="fa fa-hand-spock-o"></i></h1>
                            '. $resultLabel .'
                        </div>
                        <div id="main" class="content">
                        <noscript>
                                <div class="label-danger custom-error">
                                    <p>
                                        JavaScript seems to be disabled, please enable it to enjoy the full potential of this site.
                                    </p>
                                    <p>
                                        <a href="http://www.enable-javascript.com" target="_blank">Here you can find instructions on how to enable JavaScript</a>
                                    </p>
                                </div>
                            </noscript>
                            <div class="col-md-6 chart_div_overall pull-left">
                                <h3 class="overall">Statistics overall</h3>
                                <div id="chart_div_overall" class="pull-left"></div>
                            </div>
                            <div class="col-md-6 chart_div_overall pull-right">
                                <h3 class="overall">Statistics last month</h3>
                                <div id="chart_div_month" class="pull-right"></div>
                            </div>
                        </div>

                        <div id="tagDetails">
                        </div>
                    </div>

                    <!-- Script for offline experience! - Using upup-->
                    <script src="/upup.min.js"></script>
                    <script>
                        UpUp.start({
                          "content-url": "src/offline/offline-content.html",
                          "assets": ["src/lib/font-awesome/css/font-awesome.min.css",
                          "src/lib/bootstrap-3.3.6-dist/css/bootstrap.min.css",
                          "src/content/style.css",
                          "src/lib/font-awesome/css/font-awesome.min.css",
                          "src/content/img/fandom.jpg",
                          "src/content/font/Distant_Stroke_Medium.otf",
                          "src/offline/offline-app.js",
                          "src/offline/offline-style.css"]
                        });
                    </script>

                    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
                    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
                    <script src="src/lib/jquery-1.11.3.min.js"></script>
                    <script src="src/content/app.js"></script>
                </body>
            </html>

        ';

    }
}