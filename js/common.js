(function($){

	var hashSelect = null,
		hashtags = null,
		geoJsonLayer = null,
		map = null,
		currentData = [],
		carouselLeft = 0, //set in makeCarousel
		currentImgIndex = 0, //used for the carousel
		hasTransitions = false,
		carousel = null;
		pic_popup = new Popup( 'popup', 'popunder' ),
		cachePath = 'cache/';
	
	//an object for the carousel image heights... match to the sass variables
	var img = {
		big: {
			h: 133,
			w: 133
		},
		small: {
			h: 75,
			w: 75
		},		
		border: 1,
		time: 300
	};
	
	$(document).ready(function() {
		
		//test for css transitions
		hasTransitions = ( $('html.csstransitions').length ? true : false );
		
		//create the hashtag select list
		makeHashtagList();
		//make the carousel
		makeCarousel();
		//make the map
		makeMap();
		
	});

	function makeCarousel(){
		console.log('MAKE CAROUSEL');
		
		carousel = $('#carousel-images');
		
		carouselLeft = parseInt( carousel.css('padding-left').replace('px', '') );
		console.log('MAKE CAROUSEL', carouselLeft );

		var next = $('#carousel-wrap .next').click( carouselNext );
		var prev = $('#carousel-wrap .prev').click( carouselPrev );
		
	}

	function carouselNext(e){
		//console.log( 'CAROUSEL NEXT', carousel.children().eq( 0 ).position().left, carouselLeft );
		if( currentImgIndex < currentData.length ){
			currentImgIndex++;
			moveCarousel();
		}
	}
	function carouselPrev(e){
		if( currentImgIndex > 0 ){
			currentImgIndex--;
			moveCarousel();
		}
	}

//currentImgIndex

	function moveCarousel(){
		console.log('MOVE CAROUSEL');
		
		var left = -1 * carousel.children().eq( currentImgIndex ).position().left + carouselLeft;
		console.log('MOVE CAROUSEL', left);

		if( hasTransitions ){
			carousel.css({ left: left });
		}
	}

	function carouselClick(e){
		e.stopPropagation();
		
		var i = getPhotoIndexById( $(this).attr('insta_id') ),
			data = currentData[ i ];
		

		pic_popup.setContent( makeBlockContent( data.properties ) ).show();

		console.log( 'IMAGE CLICK', data);
	}
	

	function carouselHoverOn(e){
		//console.log('hoverOn')
		
		var pos = $(this).offset(),
			clone = $(this).data('clone');
		
		if( !clone ){
			clone = $(this).clone(false)
						//.hover( cloneOn, cloneOff)
						.mouseout( cloneOff)
						.addClass('clone')
						.css({
							height: img.small.h,
							width: img.small.w,
							top: pos.top,
							left: pos.left
						})
						.data({ 
							//hover: true,
							parent: this,
							pos: pos
						})
						.prependTo('body');

			$(this).data({ clone: clone });
			
		} else {
			clone.stop( false, false ).show(0);
		}
		
		clone.animate({
			top: Math.floor( -1 * ( ( img.big.h - img.small.h ) / 2 ) + img.border + pos.top ),
			left: Math.floor( -1 * ( ( img.big.w - img.small.w ) / 2 ) + img.border + pos.left ),
			height: img.big.h,
			width: img.big.w
		}, img.time);
		
		$('.clone').not(clone).trigger('mouseout');
		
	}
	
	function cloneOff(e){
		
		//var parent = $(this).data('parent');
		
		var data = $(this).data();
				
		//if( data.animated ){
			$(this).stop(false, false).animate({
				top: data.pos.top,
				left: data.pos.left,
				height: img.small.h,
				width: img.small.w
			}, img.time / 2, cloneAnimateCallback);		
			
			//console.log( 'clone off' );		
			
		//}
	}
	
	function cloneAnimateCallback(e){
		//console.log('animateCallback' );
		
		var parent = $(this).data('parent');
		$(parent).data({ clone: null });
		$(this).remove();
		//$(this).hide(0);
	}

	function resetCarousel(){
		console.log('RESET CAROUSEL');
		
		$('.clone').remove();
		
		carousel.html('');
	}

	function makeCarouselImage( data ){
		console.log( 'carousel image', data );
		
		var pic = $('<div />', {
			insta_id: data.id
		}).addClass('pic').click(carouselClick);
		
		var img = $('<img />', {
			src: data.images.thumbnail.url
		}).appendTo( pic );

		//images animate with javascript if they are older browsers
		//if( !hasTransitions )
		//img.hover( carouselHoverOn, carouselHoverOff );
		img.mouseover( carouselHoverOn);

		pic.appendTo( carousel );
	}


	function makeMap(){
		map = new L.Map('map').on('popupopen', function(e){
			console.log('mappopupopened', e, this);
			
			
			var content = e.popup._content;
			
			pic_popup.setContent( content ).show();
			
			
			return e.popup._close();
		});

		//body gets a click handler to hide the popup
		$('body').click(function(e){
			pic_popup.close();
		});

		//var alldata = null;

		var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/cfc96afd35bc4c12b3f06893fff79e8c/60666/256/{z}/{x}/{y}.png',
			cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 12});


		map.setView(new L.LatLng(46, -52), 3).addLayer(cloudmade);

		//trigger a click on the first hashtag in the list
		return loadMapData( hashSelect.children().first().attr('hash') );

	}


	function loadMapData( hashName ){
		
		$.getJSON( cachePath+hashName+'.json', function( data ){
			currentData = [];
			
			resetCarousel();
			
			if( !geoJsonLayer ){
				geoJsonLayer = new L.GeoJSON( { type: "FeatureCollection", features: [] }, {
					pointToLayer: function ( latlng ){
						
						//console.log( latlng, 'pointtolayer', this );
						
						return new L.CircleMarker(latlng, {
							radius: 8,
							fillColor: "#fecb00",
							color: "#fecb00",
							weight: 1,
							opacity: 1,
							fillOpacity: 0.9
							//bindPopup: Whazza
						// }).on('click', function(e){
						// 	console.log('MARKER CLICK!', e, this);
						});	
					}
				}).on('featureparse', function(e){
					
					//console.log('featureparse', e, this, e.properties);
					
					currentData.push({
						id: e.properties.id,
						properties: e.properties
					});
					
					var block = makeBlockContent(e.properties);
					
					e.layer.bindPopup( block, { autoPan: false });
					
					//put it in the carousel
					makeCarouselImage( e.properties );
					
					return;

				});

/*
{
"type":"FeatureCollection","features":[
*/
				map.addLayer(geoJsonLayer); //Add layer to map 

			} else {
			}
			
			geoJsonLayer.clearLayers();
			geoJsonLayer.addGeoJSON( data );
			
		});
		
	};

	function makeBlockContent( data ){
		//console.log( 'makeBlockContent', data );
		
		var block = '<div class="insta-wrap" insta_id="'+data.id+'">'+
						makeImageBlock( data.images.low_resolution )+
						'<div class="info">'+
							makeUserBlock( data.profile_picture, data.user )+
							'<div class="description">'+
								data.description+
							'</div>'+
							makeWhereZip( data.latitude, data.longitude )+
						'</div>'+
					'</div>';
		
		return block;
	}

	function makeWhereZip( lat, lng ){
		return '<div lat="'+lat+'" lng="'+lng+'" class="where">'+
					'<span class="title">Where I Zip</span>'+
					'<span class="location"></span>'+
				'</div>';
	}

	function makeUserBlock( pic, name ){
		return '<div class="user">'+
					'<span class="user-pic"><img src="'+pic+'" /></span>'+
					'<span class="user-name">'+name+'</span>'+
				'</div>';
	}

	function makeImageBlock( img ){
		return '<div class="pic">'+
					'<img src="'+img.url+'" />'+
				'</div>'
	}

	function makeHashtagList(){
		//grab the hashtags
		hashtags = JSON.parse( $('#hashtag-json').text() );
		
		hashSelect = $('#hashSelect');
		
		$('#nav .hashtag').click(function(e){
			e.stopPropagation();
			hashSelect.toggle();
		});
		
		$('body').click(function(e){
			hashSelect.hide();
		});
		
		return $.each( hashtags, function(i){			
			for ( var key in this ){
				$('<div />',{
					text: '#'+this[key],
					hash: this[key]
				}).addClass('hashOption')
				.click( onHashClick )
				.appendTo( hashSelect );
			}
		});		
	}
		
	function onHashClick(e){
		console.log( 'HASHCLICK!', $(this).attr('hash') );
		
		return loadMapData( $(this).attr('hash') );
		
	}

	//searches through current data and returns the index in the array
	function getPhotoIndexById( id ){
		var index = null;
		
		if( id )
			$.each( currentData, function(i){
				if( this.id === id ){
					index = i;
					return false;
				}
			});
				
		return index;
	}
	
	function getNextPhotoById( id ){
		var i = getPhotoIndexById( id );
		
		return( i === currentData.length - 1 ? 
					currentData[ 0 ] : 
					currentData[ i + 1 ]
				);
	}

	function getPrevPhotoById( id ){
		var i = getPhotoIndexById( id );
		
		return( i === 0 ? 
					currentData[ currentData.length - 1 ] : 
					currentData[ i - 1 ]
				);
	}
	
	function Popup( id, popunderId ){

		this.popup = null;
		this.under = null;
		this.time = 250;
		this.timeout = null;
		this.timeoutTime = 500;
		this.next = null;
		this.prev = null;
		this.content = null;
		this.closeButton = null;

		var that = this;

		if( !$('#'+id).length ){
			this.popup = $('<div />', { id: id }).prependTo('body');
			//add the next button
			this.next = $('<div />').addClass('next nav').click(function(e){
				that.onNextClick.apply( that, arguments );
			}).appendTo( this.popup );
			//add the prev button
			this.prev = $('<div />').addClass('prev nav').click(function(e){
				that.onPrevClick.apply( that, arguments );
			}).appendTo( this.popup );
			//add the close button
			this.closeButton = $('<div />').addClass('close').click(function(e){
				that.close.call( that );
			}).appendTo( this.popup );
			//add the content holder
			this.content = $('<div />').addClass('content').appendTo( this.popup );
			
		} else {
			this.popup = $(id);
		}



		this.popup.click(function(e){
			e.stopPropagation();
		});

		var that = this;

		$(window).resize(function(e){
			that.position();
		});

		if( popunderId ){
			if( !$('#'+popunderId).length ){
				this.under = $('<div />', { id: popunderId }).prependTo('body');
			} else {
				this.popup = $(popunderId);
			}
		}

		return this;
	}

	Popup.prototype.getInstagramId = function(){
		var wrap = this.content.find('.insta-wrap');
				
		return ( wrap.length ? wrap.attr('insta_id') : null );
		
	};

	Popup.prototype.onNextClick = function(e){
		//console.log( 'NEXT!', e, this );
		var data = getNextPhotoById( this.getInstagramId() );
		
		this.setContent( makeBlockContent( data.properties ) );
	}

	Popup.prototype.onPrevClick = function(e){
		//console.log( 'PREV!', e, this);
		var data = getPrevPhotoById( this.getInstagramId() );
		
		this.setContent( makeBlockContent( data.properties ) );

	}

	Popup.prototype.setContent = function( block ){
		this.content.html( block );
		return this;
	}

	Popup.prototype.show = function(){
		this.position();

		this.popup.css({ zIndex: 1000000 }).show( this.time );
		if( this.under )
			this.under.show( 0 );
		return this;
	}

	Popup.prototype.close = function(){
		clearTimeout( this.timeout );

		this.popup.hide( 0, function(){
			$(this).css({ zIndex: 0 });
		});
		if( this.under )
			this.under.hide( this.time );
		return this;
	}

	Popup.prototype.position = function(){
		var left = Math.floor( ($(window).width() - this.popup.outerWidth()) / 2 );

		if( left < 0 )
			left = 0;

		var top = Math.floor( ($(window).height() - this.popup.outerHeight()) / 2 );
		if( top < 0 )
			top = 0;

		this.popup.css({
			top: top,
			left: left
		});

		var that = this;

		return this.timeout = setTimeout( function(){ that.position.call(that) }, that.timeoutTime );
	}
})(jQuery);