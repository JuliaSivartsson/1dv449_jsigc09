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
    public function render(){
        echo '<!DOCTYPE html>
            <html>
                <head>
                    <meta http-equiv="content-type" content="text/html; charset=ISO-8859-1" />
                    <!-- Latest compiled and minified CSS -->
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
                        integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
                    <link rel="stylesheet" href="src/content/style.css" />
                    <title>enterTAGment</title>
                </head>
                <body>
                    <div class="page-header text-center">
                        <h1>enterTAGment <i class="fa fa-hand-spock-o"></i></h1>
                    </div>
                    <div id="main" class="content">
                        <div class="col-md-5 chart_div_overall pull-left">
                            <h3 class="overall">Statistics overall</h3>
                            <div id="chart_div_overall" class="pull-left"></div>
                        </div>
                        <div class="col-md-5 chart_div_overall pull-right">
                            <h3 class="overall">Statistics last month</h3>
                            <div id="chart_div_month" class="pull-right"></div>
                        </div>
                    </div>

                    <div id="tagDetails">
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