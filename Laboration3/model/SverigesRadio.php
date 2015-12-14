<?php

/**
 * Traffic information from Sveriges Radio API
 * http://sverigesradio.se/api/documentation/v2/metoder/trafik.html
 */
class SverigesRadio
{

    private static $fileName = 'response.json';
    private $cache;

    public function getTrafficInfo(){
        $traffic = null;

        //Create a new request if file is older than 15 minute
        if(file_exists(self::$fileName) && time() - filemtime(self::$fileName) > 60 * 1){
            echo "new info is presented";
            $traffic = $this->getnewTraffic();

            if($traffic !== null){
                $this->cache = fopen('response.json', 'w');
                fwrite($this->cache, $traffic);
                fclose($this->cache);
            }
            else{
                $fileTime = date("j M Y H:i:s", filemtime(self::$fileName));
                return "Just nu g�r det inte h�mta trafikmeddelanden fr�n Sveriges Radio. H�mtad {$fileTime}";
            }
        }
        else{
            echo "cache is used";
        }
        return "";
    }

    public function getnewTraffic(){
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