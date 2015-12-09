<?php

require_once("view/HtmlView.php");
require_once("controller/MashupController.php");

$controller = new MashupController();
$mashup = $controller->doMashup();

$view = new HtmlView();
$view->render($mashup);