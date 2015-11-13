<?php

namespace controller;

class ScrapeController{

    private $HTMLView;
    private $scrapeView;
    private $scrapeModel;
    private $dom;

    public static $baseUrlLocation = "ScrapeController::baseURL";
    public static $startURLlocation = "ScrapeController::startURLS";

    public function __construct(){
        $this->HTMLView = new \view\HTMLView();
        $this->scrapeView = new \view\ScrapeView();
        $this->scrapeModel = new \model\ScrapeModel();

        $this->dom = new \DOMDocument();
    }

    public function doScrape(){

        //If user enters an URL
        if($this->scrapeView->userWantsToStartScrape()) {
            try{
                //Check Calendar page
                $availableDays = $this->scrapeModel->getAvailableDays(rtrim($_COOKIE[self::$baseUrlLocation], "/") .  unserialize($_COOKIE[self::$startURLlocation])[0]);

                if (empty($availableDays)) {
                    $content = $this->scrapeView->getNoDaysAvailable();
                } else {

                    //Check Cinema page
                    $availableMovies = $this->scrapeModel->getAvailableMovies(rtrim($_COOKIE[self::$baseUrlLocation], "/").  unserialize($_COOKIE[self::$startURLlocation])[1], $availableDays);
                    $content = $this->scrapeView->getAvailableOptions($availableMovies);
                }

            }catch(\ErrorException $error){
                $content = $this->scrapeView->getErrorMessage("Fel vid inläsning av HTML.");
            }

            echo $this->HTMLView->getHTML($content);
        }
        else{
            //If user pressed link to view movie details and available tables
            if($this->scrapeView->userWantsToViewMovie()){
                $movie = $this->scrapeView->getMovieToView();

                //Check Dinner page
                $restaurant = $this->scrapeModel->getRestaurantTimes($movie, rtrim($_COOKIE[self::$baseUrlLocation], "/") . unserialize($_COOKIE[self::$startURLlocation])[2]);
                $content = $this->scrapeView->displayMovieAndRestaurant($movie, $restaurant);
            }
            else{
                $content = $this->scrapeView->getStartForm();
            }

            //If user pressed link to book table
            if($this->scrapeView->userWantsToBookTable()){
                $tableValue = $this->scrapeView->getTableValue();
                $bookTable = $this->scrapeModel->bookTable($tableValue, rtrim($_COOKIE[self::$baseUrlLocation], "/") . unserialize($_COOKIE[self::$startURLlocation])[2]);

                //Check if HTTP_HEADER is OK
                if($bookTable === 200){
                    $content = $this->scrapeView->displayBookingResult("Tack zeke din bokning är OK!");
                }
                else{
                    $content = $this->scrapeView->displayBookingResult("Något gick fel! :(");
                }
            }
            echo $this->HTMLView->getHTML($content);
        }
    }

}