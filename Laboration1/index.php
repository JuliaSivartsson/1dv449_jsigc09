<?php
require_once("view/HTMLView.php");
require_once("view/ScrapeView.php");
require_once("controller/ScrapeController.php");
require_once("model/ScrapeModel.php");
require_once("model/MovieModel.php");
require_once("model/TableModel.php");

error_reporting(E_ERROR);

$controller = new controller\ScrapeController();
$controller->doScrape();
