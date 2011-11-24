(function( $ ){
	
	// Public Properties
	var properties = {
		tags		: {},
		total		: function() {
						return properties.tags.length;
					  },
		activeIndex	: 0
	}
	
	// Create some default options, merged in init
	var settings = {
		repeaterTag			: 'img',
		showPaging			: true,
		pagingPlacement		: 'bottom-right',
		startIndex			: 0
	}
	
	var methods = {
		init: function( options ) {
			
			// merge the settings with any options that were provided
			settings = $.extend( settings, options);
			
			return this.each(function(){

				// hold onto "this" for interval
				var self = this;
				
				// get items
				properties.tags = $(self).find(settings.repeaterTag.toLowerCase());
				
				// set basic css rules
				$(self)
					.css({
						position	:'relative'
					});
				
				// other css, and set starting slide to active
				properties.tags
					.css({
							position	: 'absolute',
							display		: 'none'
						})
						.addClass('featured-content-' + settings.repeaterTag.toLowerCase())
					.eq(settings.startIndex)
						.css({
							display		: 'block'
						})
						.addClass('active');
						
				// start timer
				setInterval(function(){ 
				
					// save active/next indexies
					properties.activeIndex = $(self).find(settings.repeaterTag + '.active').index();
					var next = properties.activeIndex + 1;
					properties.nextIndex = (properties.total() == next) ? 0 : next;
					//console.log(properties.activeIndex,properties.nextIndex,properties.total());
				
					// each animation should position css according to the animation to occur
					switch ( settings.animation ) {
						case 'slide':
						break;
						default:
							crossFade();
						break;
					}
				}, 3000);
			}); 

		}
	};
	function crossFade() {
		properties.tags.eq(properties.activeIndex).fadeOut().removeClass('active');
		properties.tags.eq(properties.nextIndex).fadeIn().addClass('active');
	}
	
	$.fn.featuredContent = function( method ) {  
	
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method: "' +  method + '" does not exist on jQuery.featuredContent' );
		}
			
	};
	
})( jQuery );