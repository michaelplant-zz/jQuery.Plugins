(function( $ ){
	
	
	var methods = {
		init: function( options ) {
			// Create some defaults, extending them with any options that were provided
			var settings = $.extend( {
				showPaging			: true,
				pagingPlacement		: 'bottom-right'
			}, options);
			
			return this.each(function(){

				// hold onto "this" for interval
				var self = this;
				
				// initialize slideshow
				$(self).css({
						position	:'relative'
					})
					.find('img').css({
						position	:'absolute'
					}).end()
					.find('img:gt(0)').hide();
				// start timer
				setInterval(function(){ 
					$(self).find('img:eq(0)')
						.addClass('touched')
						.fadeOut()
						.next('img')
						.fadeIn()
						.end()
						.appendTo($(self));
				}, 3000);
			}); 

		},
		rotate: function( obj ) {
			console.log(obj);
		}
	};
	
	$.fn.featuredContent = function( method ) {  
	
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.featuredContent' );
		}
			
	};
	
})( jQuery );