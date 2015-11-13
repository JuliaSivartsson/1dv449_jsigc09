<?php

namespace model;

class ScrapeModel{
    private $movieNames = array();
    private $userName = "zeke";
    private $password = "coys";

    public function getStartPageURL($url){
        $data = $this->makeRequest($url);
        $dom = new \DOMDocument();
        if($data){
            if($dom->loadHTML($data)){
                $links = $dom->getElementsByTagName("a");
                $urls = array();

                foreach($links as $link){
                    $urls[] = $link->getAttribute('href');
                }

                return $urls;
            }
            else{
                die("Fel vid inläsning av HTML");
            }
        }
        else{
            die("Fel vid inläsning av HTML");
        }
    }

    /**
     * Create cURL request from url
     * @param $url
     * @return mixed
     */
    private function makeRequest($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    }

    /**
     * Post cURL request
     *
     * @param $formUrl
     * @param $postFields
     * @return mixed
     */
    private function postRequest($formUrl, $postFields){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $formUrl);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        //Set header type to post
        curl_setopt($ch, CURLOPT_POST, 1);

        //Pass fields
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
        curl_exec($ch);

        //Get HTTP header info
        $httpHeader = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return $httpHeader;
    }

    public function getAvailableDays($url){
        $paulsAvailableDays = $this->getAvailableDaysForOnePerson($url . '/paul.html');
        $petersAvailableDays = $this->getAvailableDaysForOnePerson($url . '/peter.html');
        $marysAvailableDays = $this->getAvailableDaysForOnePerson($url . '/mary.html');

        //Check if day is ok in all three cases
        $firstCheck = array_intersect($paulsAvailableDays, $petersAvailableDays);
        $finalCheck = array_intersect($firstCheck, $marysAvailableDays);

        return $finalCheck;
    }

    private function getAvailableDaysForOnePerson($url){
        $availableDays = array();
        $data = $this->makeRequest($url);

        $dom = new \DOMDocument();

        if($dom->loadHTML($data)){
            $days = $dom->getElementsByTagName("th");
            $statuses = $dom->getElementsByTagName("td");

            $arrayOfDays = array();
            $arrayOfStatuses = array();

            //Get all days into an array
            foreach($days as $day){
                $arrayOfDays[] = $day->nodeValue;
            }

            //Get all statuses into an array
            foreach($statuses as $status){
                $arrayOfStatuses[] = $status->nodeValue;
            }

            //If status is ok then add that day to array
            for($i = 0; $i < sizeof($arrayOfDays); $i++){
                if (strtolower($arrayOfStatuses[$i]) == "ok") {
                    $availableDays[] = $arrayOfDays[$i];
                }
            }

            return $availableDays;
        }
        else{
            die("Fel vid inläsning av HTML");
        }
    }

    public function getAvailableMovies($url, $availableDays){

        $availableMovies = array();
        $data = $this->makeRequest($url);

        $dom = new \DOMDocument();

        if($dom->loadHTML($data)){
            $xpath = new \DOMXPath($dom);
            $movies = $xpath->query('//select[@id = "movie"]/option[not(@disabled)]');
            $days = $xpath->query('//select[@id = "day"]/option[not(@disabled)]');

            //since the $availableDays variable contains days in english, I have to translate the days in $days from swedish to english
            foreach ($days as $day) {
                if ($day->nodeValue === "Fredag") {
                    $day->nodeValue = "Friday";
                }
                if ($day->nodeValue === "Lördag") {
                    $day->nodeValue = "Saturday";
                }
                if ($day->nodeValue === "Söndag") {
                    $day->nodeValue = "Sunday";
                }
            }

            $firstMovie = array();
            $secondMovie = array();
            $thirdMovie = array();

            foreach($days as $day){
                if(in_array($day->nodeValue, $availableDays)){
                    foreach($movies as $movie){

                        $this->setMovieName($movie->nodeValue);

                        $moviesToGet = $this->makeRequest($url . "/check?day=" . $day->getAttribute('value') . "&movie=" . $movie->getAttribute('value'));

                        //Since the request was in json we have to make it into an array
                        if($movie->nodeValue === "Söderkåkar"){
                            $firstMovie = $this->jsonToArray($moviesToGet, $day, 0);
                        }
                        else if($movie->nodeValue === "Fabian Bom"){
                            $secondMovie = $this->jsonToArray($moviesToGet, $day, 1);
                        }
                        else{
                            $thirdMovie = $this->jsonToArray($moviesToGet, $day, 2);
                        }
                    }
                }
            }
        }
        else{
            die("Fel vid inläsning av HTML");
        }

        $this->addMoviesToCollection($firstMovie, $availableMovies);
        $this->addMoviesToCollection($secondMovie, $availableMovies);
        $this->addMoviesToCollection($thirdMovie, $availableMovies);

        return $availableMovies;
    }

    private function addMoviesToCollection($movies, &$availableMovies){
        foreach($movies as $movie){
            if($movie['status'] === 1){
                $availableMovies[] = $movie;
            }
        }
    }

    /**
     * @param $movie
     * @param $day that movie is shown
     * @param $index of movie
     */
    private function jsonToArray($movie, $day, $index){
        $movieArray = json_decode($movie, true);
        foreach($movieArray as $key => $value){
            $movieArray[$key]['dayofmovie'] = $day->nodeValue;
            $movieArray[$key]['nameofmovie'] = $this->movieNames[$index];
        }

        return $movieArray;
    }

    private function setMovieName($name){
        foreach($this->movieNames as $nameInMovieList){
            if($name === $nameInMovieList){
                return;
            }
        }
        $this->movieNames[] = $name;
    }

    public function getRestaurantTimes($movie, $url){
        $tables = array();
        $restaurantPage = $this->makeRequest($url);
        $dom = new \DOMDocument();

        if($dom->loadHTML($restaurantPage)) {

            $xpath = new \DOMXPath($dom);
            $freeTables = $xpath->query("//input[@type='radio']");

            foreach ($freeTables as $tab) {

                $value = $tab->getAttribute('value');

                //Insert value of table into array $tables[] if day is right and time is later than movie
                if(substr($value, 0,3) === "fre" && $movie->getDay() === "Friday"){
                    if(intval(substr($value, 3, 2)) > intval($movie->getTime())){
                        $tables[] = $value;
                    }
                }
                if(substr($value, 0,3) === "lor" && $movie->getDay() === "Saturday"){
                    if(intval(substr($value, 3, 2)) > intval($movie->getTime())){
                        $tables[] = $value;
                    }
                }
                if(substr($value, 0,3) === "son" && $movie->getDay() === "Sunday"){
                    if(intval(substr($value, 3, 2)) > intval($movie->getTime())){
                        $tables[] = $value;
                    }
                }
            }
        }
        else{
            die("Fel vid inläsning av HTML");
        }
            return $tables;
    }

    public function bookTable($tableValue, $url){
        $formUrl = $url . "/login";

        $username = $this->userName;
        $password = $this->password;
        $value = $tableValue;

        //Set up fields in form
        $postFields = 'username='.$username.'&password='.$password.'&group1='.$value.'&submit=Submit';

        //Post form
        $postForm = $this->postRequest($formUrl, $postFields);

        return $postForm;
    }

}