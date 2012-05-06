<h2>Edit Picture</h2>

<?php $json = json_decode( $object->json); ?>

<div class="edit-picture">

  <div class="pic"><?php
    echo '<img src="'.$json->images->standard_resolution->url.'" />'
?></div>

  <div class="info">
    <span class="user"><?php echo $json->user->username; ?></span>
    <span class="text"><?php echo $json->caption->text; ?></span>
    <span class="id"><?php echo $json->id; ?></span>
    
    <div class="clearfix"></div>
    
    <?php echo $this->form->create($model->name); ?>
    <div class="exclude">
      <?php echo $this->form->input('exclude'); ?>
    </div>
    <?php echo $this->form->end('Save'); ?>

    <div class="clearfix"></div>

  </div>

</div>