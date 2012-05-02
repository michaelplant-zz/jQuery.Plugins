(function( $ ){
	
	// Public Properties
	var properties = {
		mapID		: '',
		total		: function() {
						return properties.tags.length;
					  },
		activeIndex	: 0,
		markers		: [],
		infoWindows		: []
	}
	
	// Create some default options, merged in init
	var settings = {
		data			: null,
		mapID			: 'map_canvas',
		form			: 'form:eq(0)',
		locationInput	: 'input[type="text"]:eq(0)',
		// gmap settings
		zoom: 3,
		zoomControl: true,
		scaleControl: true,
		panControl: true,
		mapTypeControl: false,
		streetViewControl: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoomControlOptions: { style: google.maps.ZoomControlStyle.SMALL }
	}
	
	var methods = {
		init: function( options ) {
			
			// merge the settings with any options that were provided
			settings = $.extend( settings, options);
			
			// gmap API references
			methods.geocoder = new google.maps.Geocoder();
			// init directions renderer without markers or infoboxes - we use custom markers
			methods.directionsRenderer = new google.maps.DirectionsRenderer({ suppressInfoWindows: true, suppressMarkers: true });
			methods.directionsService = new google.maps.DirectionsService();
			
			return this.each(function(){
					
				// hold onto "this" for interval
				var self = this;
				
				// create gmap
				properties.map = new google.maps.Map(document.getElementById(settings.mapID), settings);
				
				// check for data
				if ( settings.data != null ) {
					
					// create markers for data
					methods.createMarkers();
					
					
				} else {
					// default to US center
					properties.map.setCenter(new google.maps.LatLng(39, -90));
					$.error( 'Data is empty: "No results to display!"' );
				}
			});

		},
		
		createMarkers: function () {
	
			// prepare boundary object
			bounds = new google.maps.LatLngBounds();
	
			$.each(settings.data, function (index, markerData) {
				// create position object
				var position = new google.maps.LatLng(markerData['LAT'], markerData['LNG']);
	
				// extend boundary object to fit each marker
				bounds.extend(position);
	
				// create google maps marker, using label method
				properties.markers[index] = new google.maps.Marker({
					title: markerData["NAME"],
					position: position,
					draggable: false,
					raiseOnDrag: false,
					map: properties.map
				});
				// default info window
				/*properties.infoWindows[index] = new google.maps.InfoWindow({
					content: properties.markers[index].title,
					maxWidth: 200
				});*/
				// custom info window
				var boxText = document.createElement("div");
				boxText.style.cssText = "border: 1px solid black; margin-bottom: 28px; background: white; padding: 5px;";
				boxText.innerHTML = markerData["NAME"] + "<br/>" + markerData["ADDRESS"] + "<br/>";
		
				var ibOptions = {
					 content: boxText
					,disableAutoPan: false
					,maxWidth: 0
					,pixelOffset: new google.maps.Size(-140, 0)
					,zIndex: null
					,boxStyle: { 
					  background: "url('arrow.gif') no-repeat"
					  ,opacity: 0.75
					  ,width: "280px"
					 }
					,closeBoxMargin: "2px 2px 2px 2px"
					,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
					,infoBoxClearance: new google.maps.Size(1, 1)
					,isHidden: false
					,pane: "floatPane"
					,enableEventPropagation: false
					,alignBottom: true
				};
                properties.infoWindows[index] = new InfoBox(ibOptions);
				// create custom styled infobox, reference: http://gmaps-samples-v3.googlecode.com/svn/trunk/infowindow_custom/infowindow-custom.html
				google.maps.event.addListener(properties.markers[index], 'click', function (event) {
					//methods.clearInfos();
					properties.infoWindows[index].open(properties.map,properties.markers[index]);
	
				});
			});  // end each 
	
			// set center & zoom of map after all markers have been placed, based on boundary object
			properties.map.panTo(bounds.getCenter(), properties.map.fitBounds(bounds));
	
		}, // end create markers
		
		clearMarkers: function () {
			$.each(properties.markers, function (index, marker) {
				if (marker) marker.setMap(null);
			});
		},
		
		clearInfos: function () {
			$.each(properties.infoWindows, function (index, info) {
				if (info) info.setMap(null);
			});
		},
		
		// check for geolocation and handle result
		getLocation: function () {
			// first check for geo
			if (!navigator.geolocation)
				return false;
			// Request a position. We accept positions whose age is not
			// greater than 10 minutes. If the user agent does not have a
			// fresh enough cached position object, it will automatically
			// acquire a new one.
			navigator.geolocation.getCurrentPosition(successCallback,
												 errorCallback,
												 { maximumAge: 600000 });
	
			function successCallback(position) {
				// get lat and longitude
				var latvar = position.coords.latitude.toFixed(2);
				var lngvar = position.coords.longitude.toFixed(2);
				// create latlng gmap object
				var location = new google.maps.LatLng(latvar, lngvar);
				//Nationwide.Maps.placeMarker( location, false );
				methods.geocoder.geocode({ location: location }, function (results) {
					// looking for postal code
					var postalCode;
					// loop results and the first found will be closest, so break out
					for (var i = 0; i < results.length; i++) {
						for (var j = 0; j < results[i].address_components.length; j++) {
							for (var k = 0; k < results[i].address_components[j].types.length; k++) {
								if (results[i].address_components[j].types[k] == "postal_code") {
									postalCode = results[i].address_components[j].short_name;
									break;
								}
							}
							if (postalCode) break;
						}
						if (postalCode) break;
					}
					if (postalCode != null) {
						// set input value to zip
						$(settings.locationInput).val(postalCode);
						// save zip
						properties.postalCode = postalCode;
						// submit form
						//$(settings.form).submit();
					}
				});
			}
	
			function errorCallback(error) {
				// There is no geolocation, what should we do?
			}
	
		}, // end getlocation

	};
	
	// private funcs
	function private() {
		
	}
	
	

	
	$.fn.mappit = function( method ) {  
	
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method: "' +  method + '" does not exist on jQuery.mappit' );
		}
			
	};
	
})( jQuery );