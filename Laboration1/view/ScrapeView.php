<?php

namespace view;

use model\MovieModel;

class ScrapeView{
    private static $urlLocation = "ScrapeView::url";
    private static $submitLocation = "ScrapeView::submit";
    private static $getMovie = "movie";
    private static $getTime = "time";
    private static $getDay = "day";
    private static $getStart = "start";
    private static $tableValue = "tableValue";

    public function getStartForm(){
        return "<form method='post'>
            <label>Ange URL: </label>
            <input type='text' name='". self::$urlLocation ."'>
            <input type='submit' value='Start!' name='". self::$submitLocation ."'>
            </form>";
    }

    public function userWantsToStartScrape(){
        if (isset($_POST[self::$submitLocation])) {
            //Set cookie to match user input
            setcookie(\controller\ScrapeController::$baseUrlLocation, $_POST[self::$urlLocation], time() + (60 * 60 * 24 * 30));
            $_COOKIE[\controller\ScrapeController::$baseUrlLocation] = $_POST[self::$urlLocation];
        }
        return isset($_POST[self::$submitLocation]);
    }

    public function userWantsToViewMovie(){
        return isset($_GET[self::$getMovie]);
    }

    public function getMovieToView(){
        return new \model\MovieModel($_GET[self::$getMovie], $_GET[self::$getTime], $_GET[self::$getDay]);
    }

    public function displayMovieAndRestaurant($movie, $restaurantTimes){
        if(!empty($restaurantTimes)){
            $dayTranslation = array("Friday" => "fredag", "Saturday" => "lordag", "Sunday" => "sondag");

            $ret = '<div class="jumbotron">';
            $ret .= '<h3>Följande tider är lediga att boka på zekes restaurang:</h3>';
            $ret .= '<table class="table table-striped table-hover">';
            foreach($restaurantTimes as $time){
                $startTime = substr($time, 3,2);
                $endTime = substr($time, 5,2);
                $translateDayToSwedish = $dayTranslation[$movie->getDay()];

                $ret .= '<tr>';
                $ret .= '<td>Det finns ett ledigt bord mellan klockan '. $startTime .' och '. $endTime .' efter att ha sett filmen '. $movie->getName() .' klockan '. $movie->getTime().'</td>';
                $ret .= '<td><a href="?' . self::$getDay .'='. $translateDayToSwedish .'&' . self::$getStart . '='. $startTime .'&' . self::$tableValue. '='. $time .'">Boka detta bord</a></td>';
                $ret .= '</tr>';
            }
            $ret .= '</table>';
            $ret .= '</div>';
        }
        else{

            $ret = '<div class="jumbotron">';
            $ret .= '<h3>Det finns tyvärr inga lediga tider på restaurangen för det här tillfället :(</h3>';
            $ret .= '</div>';
        }
        return $ret;
    }

    public function userWantsToBookTable(){
        return isset($_GET[self::$tableValue]);
    }

    public function getTableValue(){
        if(isset($_GET[self::$tableValue])) {
            return $_GET[self::$tableValue];
        }
        return null;
    }

    public function displayBookingResult($message){
        $ret = '<div class="jumbotron">';
        $ret .= '<h3>'. $message .'</h3>';
        $ret .= '</div>';

        return $ret;
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