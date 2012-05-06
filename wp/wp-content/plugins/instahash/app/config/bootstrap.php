<?php



add_action('mvc_admin_init', 'instahash_on_mvc_admin_init', 10, 1);

function instahash_on_mvc_admin_init($args) {
  //error_log(print_r($args, true));
  extract($args);
  
	if (in_array($action, array('add', 'edit', 'index'))) {
  	wp_register_style('mvc_instahash_admin', mvc_css_url('instahash', 'admin'));
  	wp_enqueue_style('mvc_instahash_admin');
		
 	  wp_register_script('jquery-ui-autocomplete', mvc_js_url('instahash', 'ui-autocomplete'));
		wp_enqueue_script(
		  'mvc_instahash_admin', 
		  mvc_js_url('instahash', 'admin'), 
		  array(
		    'json2',
		    'jquery', 
		    'jquery-ui-core', 
		    'jquery-ui-widget', 
		    'jquery-ui-position',
		    'jquery-ui-autocomplete'
		  ), 
		  null, 
		  true
		);

	}
}




?>