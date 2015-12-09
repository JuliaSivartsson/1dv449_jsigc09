<?php

/**
 * Traffic information from Sveriges Radio API
 * http://sverigesradio.se/api/documentation/v2/metoder/trafik.html
 */
class SverigesRadio
{

    public function getTrafficInformation(){
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