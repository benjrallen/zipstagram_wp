<?php
/*
Plugin Name: Instahash
Plugin URI: 
Description: 
Author: 
Version: 
Author URI: 
*/

register_activation_hook(__FILE__, 'instahash_activate');
register_deactivation_hook(__FILE__, 'instahash_deactivate');

function instahash_activate() {
	require_once dirname(__FILE__).'/instahash_loader.php';
	$loader = new InstahashLoader();
	$loader->activate();
}

function instahash_deactivate() {
	require_once dirname(__FILE__).'/instahash_loader.php';
	$loader = new InstahashLoader();
	$loader->deactivate();
}

?>