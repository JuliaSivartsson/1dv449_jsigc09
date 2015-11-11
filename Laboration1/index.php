<?php
require_once("view/HTMLView.php");
require_once("view/ScrapeView.php");
require_once("controller/ScrapeController.php");
require_once("model/ScrapeModel.php");

$url = "https://coursepress.lnu.se/kurser/";

$controller = new controller\ScrapeController();
$controller->doScrape($url);
