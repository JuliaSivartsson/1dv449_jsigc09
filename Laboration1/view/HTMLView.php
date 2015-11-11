<?php

namespace view;

class HTMLView{
    public function getHTML($body){
        return "<!DOCTYPE html>
            <html>
                <head>
                    <link href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css' rel='stylesheet'>
                    <meta http-equiv='content-type' content='text/html; charset=utf-8'/>
                    <title>Site scrape</title>
                </head>
                <body>
                    <div class='container'>
                        <div class='jumbotron'>
                            {$body}
                        </div>
                    </div>
                </body>
            </html>";
    }

}