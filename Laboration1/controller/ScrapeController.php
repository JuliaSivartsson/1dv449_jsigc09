<?php

namespace controller;

class ScrapeController{

    private $HTMLView;
    private $scrapeView;
    private $scrapeModel;
    private $dom;



    public function __construct(){
        $this->HTMLView = new \view\HTMLView();
        $this->scrapeView = new \view\ScrapeView();
        $this->scrapeModel = new \model\ScrapeModel();

        $this->dom = new \DOMDocument();
    }

    public function doScrape($url){

        if($this->scrapeView->userWantsToStartScrape()) {

            try{
                $urlToScrape = $this->scrapeView->getUrlToScrape();
                $startPageURL = $this->scrapeModel->getStartPageURL($urlToScrape);

                $availableDays = $this->scrapeModel->getAvailableDays(rtrim($urlToScrape, "/") . $startPageURL[0]);

                if (empty($availableDays)) {
                    $content = $this->scrapeView->getNoDaysAvailable();
                } else {

                    $availableMovies = $this->scrapeModel->getAvailableMovies(rtrim($urlToScrape, "/"). $startPageURL[1], $availableDays);

                    $content = $this->scrapeView->getAvailableOptions($availableMovies);
                }


            }catch(\ErrorException $error){
                $content = $this->scrapeView->getErrorMessage("Fel vid inläsning av HTML.");
            }

            echo $this->HTMLView->getHTML($content);
        }
        else{
            if($this->scrapeView->userWantsToBookTable()){
                $movie = $this->scrapeView->getMovieToView();
                $content = $this->scrapeView->displayMovie($movie);
            }
            else{
                $content = $this->scrapeView->getStartForm();
            }

            echo $this->HTMLView->getHTML($content);
        }
    }

}