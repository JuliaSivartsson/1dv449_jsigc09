<?php

class MashupController
{
    private $webService;
    private static $fileName = 'response.json';
    private $cache;

    public function __construct(){
        $this->webService = new SverigesRadio();
    }

    public function doMashup(){
        $webService = new SverigesRadio();
        $traffic = null;


        //Create a new request if file is older than 30 minute
        if(time() - filemtime(self::$fileName) > 1800){
            $traffic = $webService->getTrafficInformation();

            if($traffic !== null){
                $this->cache = fopen('response.json', 'w');
                fwrite($this->cache, $traffic);
                fclose($this->cache);
            }
            else{
                $fileTime = date("j M Y H:i:s", filemtime(self::$fileName));
                return "Just nu går det inte hämta trafikmeddelanden från Sveriges Radio. Hämtad {$fileTime}";
            }
        }
        return "";
    }

}