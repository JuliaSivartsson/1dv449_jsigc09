<?php

namespace model;

class InstagramAPI
{

    private static $cacheLife = 5; //Minutes that cache should live
    //private static $fileName = 'instagramResponse.json';
    private static $fileRootOverall = 'response.json';
    private static $fileRootMonth = 'responeMonth.json';
    private $cache;

    public function getNumberOfTimesTagIsUsed($tag)
    {
        $result = "";
        $result .= $this->connectionSetup("https://api.instagram.com/v1/tags/$tag?access_token=10401453.a5a0e5b.1a8eed908b5b4150a53c682eaf1307d5");

        $fileName = $tag . self::$fileRootOverall;
        if (time() - filemtime($fileName) > 10) {

            //If connection worked then we cache the information
            if ($result !== "" && $result !== false) {
                $this->cache = fopen($fileName, 'w');
                fwrite($this->cache, $result);
                fclose($this->cache);
            }
            //Otherwise we print send an error message to back
            if ($result === false) {
                $fileTime = date("j M Y H:i:s", filemtime($fileName));
                return "Just nu går det inte hämta info. Hämtad {$fileTime}";
            } else {
            }
        }
        return "";
    }

    public function getRecentTags($tag){
        $oneMonth = strtotime("-1 month");

        $result = "";
        $result .= $this->connectionSetup("https://api.instagram.com/v1/tags/$tag/media/recent?access_token=10401453.a5a0e5b.1a8eed908b5b4150a53c682eaf1307d5&min_tag_id=$oneMonth");

        var_dump(count($result));
        $fileName = $tag . self::$fileRootMonth;
        if (time() - filemtime($fileName) > 10) {

            //If connection worked then we cache the information
            if ($result !== "" && $result !== false) {

                $this->cache = fopen($fileName, 'w');
                fwrite($this->cache, $result);
                fclose($this->cache);
            }
            //Otherwise we print send an error message to back
            if ($result === false) {
                $fileTime = date("j M Y H:i:s", filemtime($fileName));
                return "Just nu går det inte hämta info. Hämtad {$fileTime}";
            } else {
            }
        }
        return "";

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