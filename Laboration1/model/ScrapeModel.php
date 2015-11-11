<?php

namespace model;

class ScrapeModel{
    private $movieNames = array();

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
                throw new \ErrorException();
            }
        }
        else{
            throw new \ErrorException();
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

        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    }

    public function getAvailableDays($url){
        $paulsAvailableDays = $this->getAvailableDaysForOnePerson($url . '/paul.html');
        $petersAvailableDays = $this->getAvailableDaysForOnePerson($url . '/peter.html');
        $marysAvailableDays = $this->getAvailableDaysForOnePerson($url . '/mary.html');

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

            foreach($days as $day){
                $arrayOfDays[] = $day->nodeValue;
            }

            foreach($statuses as $status){
                $arrayOfStatuses[] = $status->nodeValue;
            }

            for($i = 0; $i < sizeof($arrayOfDays); $i++){
                if (strtolower($arrayOfStatuses[$i]) == "ok") {
                    $availableDays[] = $arrayOfDays[$i];
                }
            }

            return $availableDays;
        }
        else{
            die("Fel vid inl�sning av HTML");
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

            //since the $availableDays variable contains days in english, I have to translate the days in $days from swedish (weird format though) to english
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
            die("Fel vid inl�sning av HTML");
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

}