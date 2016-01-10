<?php

/**
 * Traffic information from Sveriges Radio API
 * http://sverigesradio.se/api/documentation/v2/metoder/trafik.html
 */
class SverigesRadio
{
    private static $cacheLife = 5; //Minutes that cache should live
    private static $fileName = 'response.json';
    private $cache;

    public function getTrafficInfo(){
        $traffic = null;

        //Create a new request if file is older than 5 minute
        if(file_exists(self::$fileName) && time() - filemtime(self::$fileName) > 60 * self::$cacheLife){
            echo "new info is presented";
            $traffic = $this->getNewTraffic();

            //If connection worked then we cache the information
            if($traffic !== null && $traffic !== false){
                $this->cache = fopen('response.json', 'w');
                fwrite($this->cache, $traffic);
                fclose($this->cache);
            }
            //Otherwise we print send an error message to back
            if($traffic === false){
                $fileTime = date("j M Y H:i:s", filemtime(self::$fileName));
                return "Just nu går det inte hämta trafikmeddelanden från Sveriges Radio. Hämtad {$fileTime}";
            }
        }
        else{
            echo "cache is used";
        }
        return "";
    }

    public function getNewTraffic(){
        $ch = curl_init();
        $url = "http://api.sr.se/api/v2/traffic/messages?format=json";
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    }

}