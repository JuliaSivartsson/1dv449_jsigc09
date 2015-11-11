<?php

namespace view;

class ScrapeView{
    private static $urlLocation = "ScrapeView::url";
    private static $submitLocation = "ScrapeView::submit";
    private static $getMovie = "movie";
    private static $getTime = "time";
    private static $getDay = "day";

    public function getStartForm(){
        return "<form method='post'>
            <label>Ange URL: </label>
            <input type='text' name='". self::$urlLocation ."'>
            <input type='submit' value='Start!' name='". self::$submitLocation ."'>
            </form>";
    }

    public function userWantsToStartScrape(){
        return isset($_POST[self::$submitLocation]);
    }

    public function userWantsToBookTable(){
        return isset($_POST[self::$getMovie]);
    }

    public function getMovieToView(){
        return false;
    }

    public function getUrlToScrape(){
        if(isset($_POST[self::$urlLocation])) {
            return $_POST[self::$urlLocation];
        }
        return null;
    }

    public function getNoDaysAvailable(){
        $ret = '<div class="jumbotron">';
        $ret .= '<h3>Inga dagar är tillgängliga den här helgen!</h3>';
        $ret .= '</div>';

        return $ret;
    }

    public function getNoTablesAvailable(){
        $ret = '<div class="jumbotron">';
        $ret .= '<h3>Det fanns inga lediga tider :(</h3>';
        $ret .= '</div>';

        return $ret;
    }

    public function getAvailableOptions($availableMovies){
        //Translate day to swedish for presentation
        $dayTranslation = array("Friday" => "Fredag", "Saturday" => "Lördag", "Sunday" => "Söndag");

        if(empty($availableMovies)){
            $ret = '<div class="jumbotron">';
            $ret .= '<h3>Inga filmer hittades för de dagar som är tillgängliga!</h3>';
            $ret .= '</div>';
        }
        else {
            $ret = '<div class="jumbotron">';
            $ret .= '<h3>Följande filmer hittades:</h3>';
            $ret .= '<div class="row">';
            $ret .= '<table class="table table-striped">';
            foreach ($availableMovies as $movie) {
                $translateDayToSwedish = $dayTranslation[$movie['dayofmovie']];
                $ret .= '<tr>';
                $ret .= '<td>Filmen <b>' . $movie["nameofmovie"] . '</b> klockan ' . $movie["time"] . ' på ' . $translateDayToSwedish .'</td>';
                $ret .= '<td> <a href="?' . self::$getMovie .'='. $movie["nameofmovie"].'&' . self::$getTime . '='.$movie["time"] .'&' . self::$getDay. '='.$movie["dayofmovie"].'">Välj denna och boka bord</a></td>';
                $ret .= '</tr>';
            }
            $ret .= '</table>';
            $ret .= '</div>';
            $ret .= '</div>';
        }
        return $ret;
    }

    public function getErrorMessage($message){
        $ret = '<div class="jumbotron">';
        $ret .= '<h3>'. $message .'</h3>';
        $ret .= '</div>';

        return $ret;
    }
}