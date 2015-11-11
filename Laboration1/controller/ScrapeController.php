<?php

namespace controller;

class ScrapeController{

    private $HTMLView;
    private $scrapeView;
    private $scrapeModel;
    private $dom;

    public static $baseURLlocation = "ScrapeController::baseURL";
    public static $startURLslocation = "ScrapeController::startURLS";

    public function __construct(){
        $this->HTMLView = new \view\HTMLView();
        $this->scrapeView = new \view\ScrapeView();
        $this->scrapeModel = new \model\ScrapeModel();

        $this->dom = new \DOMDocument();
    }

    public function doScrape(){

        if($this->scrapeView->userWantsToStartScrape()) {


            setcookie(self::$startURLslocation, serialize($this->scrapeModel->getStartPageURL($_COOKIE[self::$baseURLlocation])), time() + (60 * 60 * 24 * 30));
            $_COOKIE[self::$startURLslocation] = serialize($this->scrapeModel->getStartPageURL($_COOKIE[self::$baseURLlocation]));

            //$urlToScrape = $this->scrapeView->getUrlToScrape();
            //var_dump($urlToScrape);
            //$startPageURL = $this->scrapeModel->getStartPageURL($urlToScrape);

            try{
                $availableDays = $this->scrapeModel->getAvailableDays(rtrim($_COOKIE[self::$baseURLlocation], "/") .  unserialize($_COOKIE[self::$startURLslocation])[0]);

                if (empty($availableDays)) {
                    $content = $this->scrapeView->getNoDaysAvailable();
                } else {

                    $availableMovies = $this->scrapeModel->getAvailableMovies(rtrim($_COOKIE[self::$baseURLlocation], "/").  unserialize($_COOKIE[self::$startURLslocation])[1], $availableDays);

                    $content = $this->scrapeView->getAvailableOptions($availableMovies);
                }

            }catch(\ErrorException $error){
                $content = $this->scrapeView->getErrorMessage("Fel vid inläsning av HTML.");
            }

            echo $this->HTMLView->getHTML($content);
        }
        else{
            if($this->scrapeView->userWantsToViewMovie()){
                $movie = $this->scrapeView->getMovieToView();

                $restaurant = $this->scrapeModel->getRestaurantTimes($movie, rtrim($_COOKIE[self::$baseURLlocation], "/") . unserialize($_COOKIE[self::$startURLslocation])[2]);

                $content = $this->scrapeView->displayMovieAndRestaurant($movie, $restaurant, rtrim($_COOKIE[self::$baseURLlocation], "/") . unserialize($_COOKIE[self::$startURLslocation])[2]);
            }
            else{
                $content = $this->scrapeView->getStartForm();
            }

            echo $this->HTMLView->getHTML($content);
        }
    }

}