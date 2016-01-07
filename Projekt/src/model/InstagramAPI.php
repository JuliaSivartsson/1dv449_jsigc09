<?php

namespace model;

class InstagramAPI
{

    private static $cacheLife = 15; //Minutes that cache should live
    private static $fileRootOverall = 'response.json';
    private static $fileRootMonth = 'responseMonth.json';
    private $cache;

    public function getNumberOfTimesTagIsUsed($tag)
    {
        $url = "https://api.instagram.com/v1/tags/$tag?access_token=10401453.a5a0e5b.1a8eed908b5b4150a53c682eaf1307d5";
        $result = $this->prepareForConnection($tag, $url, self::$fileRootOverall);
        return $result;
    }

    public function getRecentTags($tag){

        $url = "https://api.instagram.com/v1/tags/$tag/media/recent?client_id=a5a0e5b2d28147fcbc5c95fc6fdf54fc&access_token=10401453.a5a0e5b.1a8eed908b5b4150a53c682eaf1307d5";
        $result = $this->prepareForConnection($tag, $url, self::$fileRootMonth);
        return $result;
    }

    private function prepareForConnection($tag, $apiUrl, $rootUrl){
        $result = "";
        $fileName = $tag . $rootUrl;
        if(file_exists($fileName)){
            if (time() - filemtime($fileName) > 10 * self::$cacheLife) {
                var_dump("new info presented");

                $result .= $this->connectionSetup($apiUrl);

                //If connection worked then we cache the information
                if ($result !== "" && $result !== false) {

                    $this->writeToFile($fileName, $result);
                }
                //Otherwise we print send an error message to back
                if ($result === false || $result === "") {
                    $fileTime = date("j M Y H:i:s", filemtime($fileName));
                    return "It is not possible to get new recent information from the Instagram at the moment. <br/>Latest info collected at {$fileTime}";
                }
            }
            else{
                var_dump("cache is used");
            }
        }
        else{
            var_dump("new info presented");

            $result .= $this->connectionSetup($apiUrl);

            //If connection worked then we cache the information
            if ($result !== "" && $result !== false) {

                $this->writeToFile($fileName, $result);
            }
            //Otherwise we print send an error message to back
            if ($result === false || $result === "") {
                $fileTime = date("j M Y H:i:s", filemtime($fileName));
                return "It is not possible to get new recent information from the Instagram at the moment. <br/>Latest info collected at {$fileTime}";
            }
        }

        return "";
    }

    private function writeToFile($fileName, $result){
        $this->cache = fopen($fileName, 'w');
        fwrite($this->cache, $result);
        fclose($this->cache);
    }

    private function connectionSetup($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    }

}