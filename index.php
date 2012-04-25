<!DOCTYPE html>
<!--[if lt IE 7 ]><html lang="" class="no-js ie ie6 lte7 lte8 lte9"><![endif]-->
<!--[if IE 7 ]><html lang="" class="no-js ie ie7 lte7 lte8 lte9"><![endif]-->
<!--[if IE 8 ]><html lang="" class="no-js ie ie8 lte8 lte9"><![endif]-->
<!--[if IE 9 ]><html lang="" class="no-js ie ie9 lte9"><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html lang="" class="newbie no-js"><!--<![endif]-->
<head>
  <meta charset="utf-8">
  
  
  <script type="text/javascript" src="js/modernizr.js"></script>
  <script type="text/javascript">
    Modernizr.load([
      { load: ['//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'],
    	  complete: function(){ if(!window.jQuery){ Modernizr.load('js/jquery.js'); } }
    	},
    	{ test: window.JSON, nope: 'js/json2.js' },
    	<?php /* plugins.js & common.js fordevelopment */ ?>
    	{ load: 'js/plugins.js' },
    	{ load: 'js/common.js' },
    	<?php /* concatenate and optimize seperate script files for deployment using google closure compiler (compiler.jar) in js folder */ ?>
    	//{ load : 'js/theme.js' },
    	{ load: '//platform.twitter.com/widgets.js' },
    	{ load: '//connect.facebook.net/en_US/all.js#xfbml=1' }
    ]);
  </script>
	  	<link rel="stylesheet" href="css/main.css" />

		<title></title>
		<meta name="description" content="" />
	  <meta name="keywords" content="" />
		<meta name="robots" content="" />
</head>

<body>
<div id="fb-root"></div>

<div id="container">
	<div id="header">
		<h1>
		  <span class="line"></span>
		  <span class="text">instagram + zipcar</span>
		</h1>
		<div class="right">
		  <div class="line"></div>
		  <div id="nav">
		    <span class="rough">
		      <span class="view">View</span>
          <span class="current">everyone</span>
		    </span>
		    <span class="hashtag">
		      <span class="text">Hashtag</span>
		      <span class="icon"></span>
          <div id="hashSelect"></div>
		    </span>
		  </div>
	  </div>
	</div>

<!-- <img src="images/orangearrow.png" /> -->

	<div id="map"></div><!-- Map gets inserted here -->
	
		
	<div id="footer-wrap">
  	<div id="subfooter">
  	  <div id="carousel">
  	    <div id="carousel-bg">
          <div id="bg-inner"></div>
  	    </div>
  	    <div id="carousel-wrap">
    	    <div class="nav next">
    	      <div class="line"></div>
    	      <div class="icon"></div>
    	    </div>
    	    <div class="nav prev">
    	      <div class="line"></div>
    	      <div class="icon"></div>
    	    </div>
          <div id="carousel-inner">
            <div id="carousel-images"></div>
          </div>
  	    </div>
  	  </div>
    	<div id="zip-logo"></div>
  	</div>
	  
	  <div id="footer">
	    <a id="brand" href="http://www.zipcar.com" title="Zipcar">Zipcar</a>
	    <div class="sm">
	      <div class="fb-like" data-href="<?php echo $_SERVER['PATH_INFO'] ?>" data-send="false" data-layout="button_count" data-width="60" data-show-faces="false"></div>
	      <a href="https://twitter.com/share" class="twitter-share-button" data-url="<?php echo $_SERVER['PATH_INFO'] ?>">Tweet</a>
	    </div>
	    <div class="links">
	      <a href="http://www.zipcar.com" title="Join Zipcar">join zipcar</a>
	      <a href="http://www.zipcar.com/find-cars/" title="Reserve a car with Zipcar">reserve a car</a>
	      <a href="#" id="play-along" title="Play ">play along</a>
	    </div>
	    <div class="copy">Copyright © 2012 Zipcar, Inc. All Rights Reserved.</div>
	  </div>
	</div><!-- Footer -->
	
</div>

<div id="hashtag-json"><?php include 'cache/hashtags.json'; ?></div>

</body>
</html>