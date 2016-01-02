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
                    <meta http-equiv="content-type" content="text/html; charset=ISO-8859-1" />
                    <!-- Latest compiled and minified CSS -->
                    <script src="src/lib/pouchdb-5.1.0.min.js"></script>
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
                        integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
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
                <!--Load the AJAX API-->
                <script type="text/javascript" src="https://www.google.com/jsapi"></script>
                <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
                <script src="src/lib/jquery-1.11.3.min.js"></script>
                <script src="src/content/app.js"></script>


                </body>
            </html>

        ';

    }
}