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
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
                        integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
                    <link rel="stylesheet" href="src/src/style.css" />
                    <title>enterTAGment</title>
                </head>
                <body>
                    <div class="page-header text-center">
                        <h1>enterTAGment</h1>
                    </div>
                    <div class="content">
                        <p>
                            Tjena
                        </p>
                    </div>

                <script src="src/src/app.js"></script>


                </body>
            </html>

        ';

    }
}