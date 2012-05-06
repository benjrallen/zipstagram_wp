(function($){

	var hashSelect = null,
		hashtags = null,
		geoJsonLayer = null,
		map = null,
		currentData = [],
		carouselLeft = 0, //set in makeCarousel
		carouselWidth = 0, //set in makeCarousel
		currentLeft = 0, //updated in moveCarousel
		currentImgIndex = 0, //used for the carousel
		hasTransitions = false,
		carousel = null;
		pic_popup = new Popup( 'popup', 'popunder' ),
		modal_popup = new Popup( 'modal', 'modalunder', true ),
		cachePath = 'cache/',
		cacheVersion = 0;		
	
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
	//set the diff
	img.diff = {
		w: (img.big.w - img.small.w) / 2,
		h: (img.big.h - img.small.h) / 2
	}
	
	$(document).ready(function() {
		
		//test for css transitions
		hasTransitions = ( $('html.csstransitions').length ? true : false );
		
		cacheVersion = $('#cache-version').text();

		//create the hashtag select list
		makeHashtagList();
		//make the carousel
		makeCarousel();
		//make the map
		makeMap();
		//show welcome popup
		makeWelcome();
	});

	function makeWelcome(){
		modal_popup.setContent( $('#modal-content').html() ).show().content.find('button').click(function(){
			modal_popup.close();
		});
		
		setTimeout(function(){
			modal_popup.show();
		}, 50);
		
		$('#play-along').click(function(e){
			e.preventDefault();
			e.stopPropagation();
			modal_popup.show();
			return false;
		});

		//body gets a click handler to hide the popup
		$('body').click(function(e){
			modal_popup.close();
		});

	}

	function makeCarousel(){
		//console.log('MAKE CAROUSEL');
		
		carousel = $('#carousel-images');
		
		//track the carousel width
		carouselWidth = carousel.parent().width();
		$(window).resize(function(){
			carouselWidth = carousel.parent().width();
		});
		
		
		currentLeft = carouselLeft = parseInt( carousel.css('padding-left').replace('px', '') );
		//console.log('MAKE CAROUSEL', carouselLeft );

		var next = $('#carousel-wrap .next').click( carouselNext );
		var prev = $('#carousel-wrap .prev').click( carouselPrev );		
		
	}

	function carouselNext(e){
		//console.log( 'CAROUSEL NEXT', carousel.children().eq( 0 ).position().left, carouselLeft );
		if( currentImgIndex < currentData.length ){
			currentImgIndex = currentImgIndex + 3;
			moveCarousel();
		}
		
	}
	function carouselPrev(e){
		if( currentImgIndex > 0 ){
			currentImgIndex = currentImgIndex - 3;
			moveCarousel();
		}
		
	}

//currentImgIndex

	function moveCarousel(){
		var el = carousel.children().eq( currentImgIndex );
		
		if( el.length ){
			currentLeft = -1 * el.position().left + carouselLeft;
			console.log('MOVE CAROUSEL', currentLeft);
			$('.clone').trigger('mouseout');

			if( hasTransitions ){
				carousel.css({ left: currentLeft });
			} else {
				carousel.stop( false, false ).animate({
					left: left
				}, img.time);
			}
		}
	}

	function carouselClick(e){
		e.stopPropagation();
		
		var i = getPhotoIndexById( $(this).attr('insta_id') ),
			data = currentData[ i ];
		

		pic_popup.setContent( makeBlockContent( data.properties ) ).show();

		//console.log( 'IMAGE CLICK', data);
	}
	

	function carouselHoverOn(e){
		
		var off = $(this).offset(),
			pos = $(this).position(),
			clone = $(this).data('clone');


		//check if it is on the right or the left edge of the carousel and thus needs a clone to show properly
		var needsClone = ( 
			Math.floor( pos.left - img.diff.w + currentLeft ) < 0 ||
			Math.floor( pos.left + currentLeft + img.small.w + img.diff.w ) > carouselWidth ?
				true :
				false
		);

		//console.log('hoverOn', pos, off, needsClone, carouselWidth)
		if( !needsClone ){
			hasTransitions ?
				//use css3 trans if available
				$(this).addClass('over') :
				//otherwise, use javascript
				$(this).children().stop(false, false).animate({
					top: Math.floor( -1 * ( ( img.big.h - img.small.h ) / 2 ) + img.border),
					left: Math.floor( -1 * ( ( img.big.w - img.small.w ) / 2 ) + img.border),
					height: img.big.h,
					width: img.big.w
				}, img.time);
				
		} else {
			if( !clone ){
				clone = $(this).clone(false)
							//.hover( cloneOn, cloneOff)
							.mouseout( cloneOff)
							.click( carouselClick )
							.addClass('clone')
							.css({
								height: img.small.h,
								width: img.small.w,
								top: off.top,
								left: off.left
							})
							.data({ 
								//hover: true,
								parent: this
								//pos: off
							})
							.prependTo('body');

				$(this).data({ clone: clone });

			} else {
				clone.children().stop( false, false ).show(0);
			}

			clone.children().animate({
				top: Math.floor( -1 * ( ( img.big.h - img.small.h ) / 2 ) + img.border ),
				left: Math.floor( -1 * ( ( img.big.w - img.small.w ) / 2 ) + img.border ),
				height: img.big.h,
				width: img.big.w
			}, img.time);

		}

		$('.clone').not(clone).trigger('mouseout');

	}
	
	function cloneOff(e){
		
		//var parent = $(this).data('parent');
		
		var data = $(this).data();
				
		$(this).children().stop(false, false).animate({
			top: 0,
			left: 0,
			height: img.small.h,
			width: img.small.w
		}, img.time / 2, cloneAnimateCallback);		
			
	}
	
	function carouselHoverOff(e){
		//console.log( 'hover off' );
		
		hasTransitions ?
			$(this).removeClass('over') :
			$(this).children().stop(false, false).animate({
				height: img.small.h,
				width: img.small.w,
				top: 0,
				left: 0
			//}, 30);
			}, Math.floor( img.time / 2 ));
	}
	
	function cloneAnimateCallback(e){
		//console.log('animateCallback' );
		
		var parent = $(this).parent().data('parent');
		$(parent).data({ clone: null });
		$(this).parent().remove();
		//$(this).hide(0);
	}

	function resetCarousel(){
		//console.log('RESET CAROUSEL');

		currentLeft = 0; //updated in moveCarousel
		currentImgIndex = 0; //used for the carousel
		
		$('.clone').remove();
		carousel.html('').css({ left: carouselLeft });
	}

	function makeCarouselImage( data ){
		//console.log( 'carousel image', data );
		
		var pic = $('<div />', {
			insta_id: data.id
		}).addClass('pic').click(carouselClick);
		
		var img = $('<img />', {
			src: data.images.thumbnail.url
		}).appendTo( pic );

		//images animate with javascript if they are older browsers
		//if( !hasTransitions )
		pic.hover( carouselHoverOn, carouselHoverOff );
		//img.mouseover( carouselHoverOn);

		pic.appendTo( carousel );
	}


	function makeMap(){
		map = new L.Map('map').on('popupopen', function(e){
			//console.log('mappopupopened', e, this);
			
			
			var content = e.popup._content;
			
			pic_popup.setContent( content ).show();
			
			
			return e.popup._close();
		});

		//body gets a click handler to hide the popup
		$('body').click(function(e){
			pic_popup.close();
		});

		//var alldata = null;
		//var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/cfc96afd35bc4c12b3f06893fff79e8c/60666/256/{z}/{x}/{y}.png',
		var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/cfc96afd35bc4c12b3f06893fff79e8c/61923/256/{z}/{x}/{y}.png',
			cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 12});


		//map.setView(new L.LatLng(46, -52), 3).addLayer(cloudmade);
		map.setView(new L.LatLng(38.822591, -97.613525), 3).addLayer(cloudmade);

		//load the first hashtag in the list
		var hash = hashSelect.children().first().attr('hash')
		$('#nav .current').text( hash )
		
		return loadMapData( hash );

	}


	function loadMapData( hashName ){
		
		$.getJSON( cachePath+hashName+'.json?'+cacheVersion, function( data ){
			currentData = [];
			
			resetCarousel();
			
			if( !geoJsonLayer ){
				geoJsonLayer = new L.GeoJSON( { type: "FeatureCollection", features: [] }, {
					pointToLayer: function ( latlng ){
						
						//console.log( latlng, 'pointtolayer', this );
						
						return new L.CircleMarker(latlng, {
							radius: 2,
							//fillColor: "#fecb00",
							//color: "#fecb00",
							weight: 1,
							opacity: 1,
							fillOpacity: 0.9
							//bindPopup: Whazza
						// }).on('click', function(e){
						// 	console.log('MARKER CLICK!', e, this);
						});	
					}
				}).on('featureparse', function(e){
					
					//console.log('featureparse', e, this, e.properties, e.properties.likes);
					
					var size = ( e.properties.likes < 10 ?
									3 : e.properties.likes < 50 ? 
											6 : 11 );

					var stroke = ( e.properties.likes < 10 ?
										'#D8B426' : e.properties.likes < 50 ? 
												'#E5BC19' : '#F1C30D' );
												
					var fill = ( e.properties.likes < 10 ?
										'#E5BC19' : e.properties.likes < 50 ? 
												'#F1C30D' : '#fecb00' );
					//console.log(e.properties.likes, size);
					
					currentData.push({
						id: e.properties.id,
						properties: e.properties
					});
					
					e.layer.setRadius( size );
					
					e.layer.setStyle({
						color: stroke,
						fillColor: fill
					});
					
					var block = makeBlockContent(e.properties);
					
					e.layer.bindPopup( block, { autoPan: false });
					//e.layer.bindPopup( block, { autoPan: true });
					
					//put it in the carousel
					makeCarouselImage( e.properties );
					
					return;

				});

				map.addLayer(geoJsonLayer); //Add layer to map 

			} else {
			}
			
			//console.log( 'data', data );
			//reverse the data to get newer stuff
			data.features = data.features.reverse()
			
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
		//console.log( 'HASHCLICK!', $(this).attr('hash') );

		var hash = $(this).attr('hash');
		$('#nav .current').text( hash )
		
		return loadMapData( hash );
		
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
	
	function Popup( id, popunderId, modal ){

		var modal = modal || false;

		this.popup = null;
		this.under = null;
		this.totalUnder = null;
		this.time = 250;
		this.picWidth = 260;  //used so no timeout needs to be set
		this.next = null;
		this.prev = null;
		this.content = null;
		this.closeButton = null;
		this.ajax = null; //used to track the ajax request for the reverse geocode

		var that = this;

		if( !$('#'+id).length ){
			this.popup = $('<div />', { id: id }).prependTo('body');
			
			if( !modal ){
				var navInner = '<div class="line"></div><div class="icon"></div>';
				
				//add the next button
				this.next = $('<div />', { html: navInner }).addClass('next nav').click(function(e){
					that.onNextClick.apply( that, arguments );
				}).appendTo( this.popup );
				//add the prev button
				this.prev = $('<div />', { html: navInner }).addClass('prev nav').click(function(e){
					that.onPrevClick.apply( that, arguments );
				}).appendTo( this.popup );
			}
			
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

		this.totalUnder = $('<div />').addClass('totalUnder').prependTo('body');

		that.setContent = function( block ){
			this.content.html( block );
			return this;
		}

		that.close = function(){
			//clearTimeout( this.timeout );

			this.popup.hide( 0, function(){
				$(this).css({ zIndex: 0 });
			});
			if( this.under )
				this.under.hide( 0 );
				
			this.totalUnder.hide( 0 );
			return this;
		}

		that.getInstagramId = function(){
			var wrap = this.content.find('.insta-wrap');

			return ( wrap.length ? wrap.attr('insta_id') : null );

		};

		that.onNextClick = function(e){
			//console.log( 'NEXT!', e, this );
			var data = getNextPhotoById( this.getInstagramId() );

			this.setContent( makeBlockContent( data.properties ) ).position();

			this.reverseGeocode();
		}

		that.onPrevClick = function(e){
			//console.log( 'PREV!', e, this);
			var data = getPrevPhotoById( this.getInstagramId() );

			this.setContent( makeBlockContent( data.properties ) ).position();

			this.reverseGeocode();
		}
//where		
		//take the data and get a response.
		that.reverseGeocode = function(){
			var where = this.content.find('.where');
			
			if( where.length ){
				var lat = where.attr('lat'),
					lng = where.attr('lng'),
					url = 'http://nominatim.openstreetmap.org/reverse';

				var that = this;
				
				this.ajax = $.ajax(
					url,
					{
						dataType: 'jsonp',
						data: {
							format: 'json',
							lat: lat,
							lon: lng,
							zoom: 10,
							addressdetails: 1
						},
						jsonp: 'json_callback',
						success: function( data, status, xhr ){
							that.geocodeSuccess.apply( that, arguments );
						}
					}
				);

			}
		}

		that.geocodeSuccess = function( data, status, xhr ){
			//console.log('geocode', data, status, xhr === this.ajax );
			if( data.address && xhr === this.ajax ){
				var loc = '';
				if( data.address.city )
					loc += data.address.city;
				
				if( !data.address.city && data.address.hamlet && data.address.hamlet.toLowerCase() === 'hollywood' )
					loc += data.address.hamlet;
				else if( !data.address.city && data.address.county )
					loc += data.address.county;
			
				if( data.address.state )
					loc += ', '+data.address.state;
			
				that.content.find('.location').text(loc);
			}
		}

		that.show = function(){
			this.position();

			this.popup.css({ zIndex: 1000000 }).show( this.time );
			if( this.under )
				this.under.show( 0 );

			this.totalUnder.show( 0 );
			
			this.reverseGeocode();

			return this;
		}

		that.position = function(){

			var oW = this.popup.outerWidth(),
				oH = this.popup.outerHeight()

			if( oW < this.picWidth * 2 )
				oW += this.picWidth;

			var left = Math.floor( ($(window).width() - oW) / 2 );



			if( left < 0 )
				left = 0;

			var top = Math.floor( ($(window).height() - oH) / 2 );
			if( top < 0 )
				top = 0;

			this.popup.css({
				top: top,
				left: left
			});

			//console.log('position', oW, oH, left);

			//var that = this;

			//return this.timeout = setTimeout( function(){ that.position.call(that) }, that.timeoutTime );
		}


		return this;
	}

})(jQuery);