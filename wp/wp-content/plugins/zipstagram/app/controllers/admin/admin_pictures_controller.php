<?php

class AdminPicturesController extends MvcAdminController {
	
	var $default_columns = array('id', 'name', 'hashtag_id', 'exclude');
	
	var $zip_rebuild_cache = false;
	
  public function edit() {
  	$this->verify_id_param();
  	$this->set_object();
  	$this->create_or_save();   
  }

  //added in cache rebuilder
	public function create_or_save() {
		if (!empty($this->params['data'][$this->model->name])) {
			$object = $this->params['data'][$this->model->name];
			if (empty($object['id'])) {
				$this->model->create($this->params['data']);
				$id = $this->model->insert_id;
				$url = MvcRouter::admin_url(array('controller' => $this->name, 'action' => 'edit', 'id' => $id));
				$this->flash('notice', 'Successfully created!');
				$this->redirect($url);
			} else {
				if ($this->model->save($this->params['data'])) {
        	$this->rebuild_cache();   
					$this->flash('notice', 'Successfully saved!');
					$this->refresh();
				} else {
					$this->flash('error', $this->model->validation_error_html);
				}
			}
		}
	}



  //included in the two pictures controllers
  private $hashtags = null;
  private $api_calls = array(); 
  private $client_id = '9110e8c268384cb79901a96e3a16f588';
  private $api_pre = 'https://api.instagram.com/v1/tags/';
  private $cache_path = '../cache/'; //path from ABSPATH, which is wordpress content for the wordpress install
  private $pictures = array();
  private $max = 300;


  public function rebuild_cache(){
    //error_log('build_cache!!!');

    $this->set_pictures();
    $this->set_hashtags();
    $this->build_api_calls();
    $this->make_api_calls();
    $this->update_cache_files();
  }

  private function set_pictures(){
    $pictures = $this->Picture->find(array('selects' => array('id', 'instagram_id')));    
    foreach( $pictures as $pic ){
      $this->pictures[] = $pic->instagram_id;
    }
    $pictures = null;
  }

  private function set_hashtags(){

    $this->load_model('Hashtag');
    $this->hashtags = $this->Hashtag->find(array('selects' => array('id', 'name')));
    //$this->set('hashtags', $this->hashtags);
  }

  private function build_api_calls(){
    //iterate through tag models and make an api endpoint string
    foreach( $this->hashtags as $tag ){
      $this->api_calls[$tag->id] = array(
        'url' => $this->api_pre.$tag->name.'/media/recent/?client_id='.$this->client_id,
        'count' => 0
      );
    }
  }

  private function make_api_calls(){
    // Make an API request foreach api_call endpoint
    foreach( $this->api_calls as $tag_id => $call ){
      $this->make_call( $call['url'], $tag_id  );
    }
  }

  private function make_call( $url, $tag_id ){
    $response = $this->get_curl($url); //change request path to pull different photos
    $response = json_decode( $response );
    return $this->process_api_data( $response, $tag_id );    
  }

  //takes a curl response and iterates through the api entries
  private function process_api_data( $response, $tag_id ){
    $data = $response->data;    
    $continue = true;  //tracks if anything from the response is in the database already

    //don't do anything if there is nothing... in a matter of speaking.    
    if( !empty($data) ){
      foreach( $data as $pic ){
        //we only want objects with a location, duh
        if( isset( $pic->location ) && !empty( $pic->location ) && isset($pic->location->latitude) && isset($pic->location->longitude) ){
          if( $saved = $this->create_or_save_api_response($pic, $tag_id) ){
            $this->api_calls[$tag_id]['count'] += 1;
          } else {
            $continue = false;
            break;
          }
        }
      }
    }

    if( $continue && $this->api_calls[$tag_id]['count'] < $this->max && !empty( $response->pagination ) && !empty( $response->pagination->next_url ) ){
      //continue to fetch the previous pages
      return $this->make_call( $response->pagination->next_url, $tag_id );
    }
  }

  private function create_or_save_api_response( $pic, $tag_id ){
    //CHECK ID AGAINST PICTURES ALREADY IN SYSTEM
    if( in_array( $pic->id, $this->pictures ) )
      return false;

    $data = array(
      'id' => null,
      'hashtag_id' => $tag_id,
      'exclude' => 0,
      'instagram_id' => $pic->id,
      'name' => $pic->user->username.': '.$pic->caption->text,
      'json' => json_encode( $pic )
    );

    return $this->Picture->create($data);
  }

  private function update_cache_files(){
    //get all the pictures and get everything in them as well, except the name
    $all = $this->Picture->find(array('selects' => array('id', 'instagram_id', 'hashtag_id', 'json', 'exclude')));
    //hashed is an array keyed by hashtag_id
    $hashed = array();

    foreach( $all as $a ){
      if( !isset($hashed[$a->hashtag_id]) )
        $hashed[$a->hashtag_id] = array(
          'type' => 'FeatureCollection',
          'features' => array()
        );

      if( !$a->exclude )
        $hashed[$a->hashtag_id]['features'][] = $this->build_geo_json( json_decode( $a->json ) );
    }

    //$all = null;

    //write the files
    foreach( $hashed as $id => $geo ){      
      $this->write_cache_file( $geo, $this->get_hashtag_by_id($id) );
    }

    //write all the pictures to a cache file as well
    $this->write_cache_file( $all, 'zipstagram_all' );

    $all = null;

    $this->write_hashtag_cache();    
  }

  private function write_hashtag_cache(){
    $tags = array();

    foreach( $this->hashtags as $tag ){
      $tags[] = array(
        $tag->id => $tag->name
      );
    }

    return $this->write_cache_file( $tags, 'hashtags' );
  }

  private function write_cache_file($data, $name){
    //check for the file
    $filename = ABSPATH . $this->cache_path . $name . '.json';	

    //check if file exists
    //$file = ( file_exists( $filename ) ? fopen( $filename, 'w+' ) : fopen( $filename, 'x+' ) );			
    if ( file_exists( $filename ) ) {
    	$file = fopen( $filename, 'w+' );
    } else {
    	$file = fopen( $filename, 'x+' );
    }			

    if( fwrite( $file, json_encode($data) ) === FALSE ){
    	error_log('ERROR WRITING POSTS TO CACHE FILE IN PICTURES_CONTROLLER.PHP ~line 143: '.$filename);
    }

    fclose($file);

  }

  private function get_hashtag_by_id($id){
    $name = null;
    foreach( $this->hashtags as $tag ){
      if( $tag->id == $id ){
        $name = $tag->name;
        break;
      }
    }
    return $name;
  }

  //the data structure needed according to Michael
  private function build_geo_json( $data ){
    return array(
        'type' => 'Feature',
        'geometry' => array(
            'coordinates' => array(
                $data->location->longitude, 
                $data->location->latitude
            ),
            'type' => 'Point'
        ),
        'properties' => array(
            'longitude' => $data->location->longitude,
            'latitude' => $data->location->latitude,
            'title' => ( isset( $data->location->name ) ? $data->location->name : null ),
            'user' => $data->user->username,
             // id is image id, instagram_id is user id
            'id' => $data->id,
            //'tags' => $data->tags,
            'image' => $data->images->standard_resolution->url,
            'images' => $data->images,
            //'description' => $data->caption ? $data->caption->text : null,
            'description' => $data->caption ? preg_replace('/(^|\s)#(\w*[a-zA-Z_]+\w*)/', '\1<span class="tag">#\2</span>', $data->caption->text) : null,
            'instagram_id' => $data->user->id,
            'likes' => $data->likes->count,
            'profile_picture' => $data->user->profile_picture
        )
    );
  }

  //Added curl for faster response
  private function get_curl($url){
      if(function_exists('curl_init')){
          $ch = curl_init();
          curl_setopt($ch, CURLOPT_URL,$url);
          curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
          curl_setopt($ch, CURLOPT_HEADER, 0);
          curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, 0);
          curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, 0); 
          $output = curl_exec($ch);
          echo curl_error($ch);
          curl_close($ch);
          return $output;
      }else{
          return file_get_contents($url);
      }

  }


}

/*
class MvcDispatcher {

	function dispatch($options=array()) {
		
		$controller_name = $options['controller'];
		$action = $options['action'];
*/


?>