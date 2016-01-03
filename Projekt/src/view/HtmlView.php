<?php
namespace view;

class HtmlView
{

    public function render($authenticationLink){
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
                    <div class="page-header text-center">
                        <h1 class="title">enterTAGment <i class="fa fa-hand-spock-o"></i></h1>
                    </div>
                    <div class="content">
                        <div class="index-info">
                        <img class="pull-left" src="src/content/img/fandom.jpg">
                            <p>
                                Welcome to the site that is filled with fandoms! <br/>
                                Our goal is for you to have an awesome experience<br/>
                                and find all the information you want about the fandoms that you care about.<br/>
                                To get started you will need to log into an instagram account.<br/>
                                So lets get started! :)<br/><br/>
                                <a class="btn btn-primary" href="'. $authenticationLink .'">Log in to Instagram here</a>
                            </p>
                        </div>
                    </div>

                    <!-- Script for offline experience! - Using upup-->
                    <script src="/upup.min.js"></script>
                    <script>
                        UpUp.start({
                          "content-url": "src/offline/offline-index.html",
                          "assets": ["src/lib/font-awesome/css/font-awesome.min.css",
                          "src/lib/bootstrap-3.3.6-dist/css/bootstrap.min.css",
                          "src/content/style.css",
                          "src/lib/font-awesome/css/font-awesome.min.css",
                          "src/content/img/fandom.jpg",
                          "src/content/font/Distant_Stroke_Medium.otf"]
                        });
                    </script>
                </body>
            </html>

        ';

    }
}