<?php

class PicturesController extends MvcPublicController {

  public function build_cache(){
    
    MvcDispatcher::dispatch(array("controller" => "admin_pictures", "action" => "rebuild_cache"));die();
    
  }
}

?>