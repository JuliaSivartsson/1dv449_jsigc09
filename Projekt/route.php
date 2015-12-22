<?php
class route {

    private $_url = array();

    /**
     * Build a collection of internal URL's to look for
     * @param $url
     */
    public function add($url){
        $this->_url[] = $url;
    }
}