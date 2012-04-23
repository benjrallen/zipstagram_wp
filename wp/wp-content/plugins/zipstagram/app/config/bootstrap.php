<?php



add_action('mvc_admin_init', 'zipstagram_on_mvc_admin_init', 10, 1);

function zipstagram_on_mvc_admin_init($args) {
  //error_log(print_r($args, true));
  extract($args);
  
	if (in_array($action, array('add', 'edit', 'index'))) {
  	wp_register_style('mvc_surveys_admin', mvc_css_url('zipstagram', 'admin'));
  	//wp_enqueue_style('mvc_survey_admin');
  	wp_enqueue_style('mvc_surveys_admin');
		
 	  wp_register_script('jquery-ui-autocomplete', mvc_js_url('zipstagram', 'ui-autocomplete'));
  	//wp_enqueue_script('mvc_admin');
		wp_enqueue_script(
		  'mvc_zipstagram_admin', 
		  mvc_js_url('zipstagram', 'admin'), 
		  array(
		    'json2',
		    'jquery', 
		    'jquery-ui-core', 
		    'jquery-ui-widget', 
		    'jquery-ui-position',
		    'jquery-ui-autocomplete'
		    //'jquery-ui-accordion', 
		    //'jquery-ui-draggable', 
		    //'jquery-ui-droppable', 
		    //'jquery-ui-sortable'
		  ), 
		  null, 
		  true
		);

	}
}




?>