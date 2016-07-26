/**
 * MediaPreloader
 *
 * by Frank Frick
 *
 * A simple solution to get notified when media has finished loading.
 * Resolves a promise as soon as all passed media elements have loaded.
 * Media elements need to be present in the DOM.
 * Supports <img>, <picture>, <video>.
 */


define([

], function(

) {


	var MediaPreloader = function() {};


	/**
	 * @param	mediaElements	an array or nodelist containing image or video elements
	 */
	MediaPreloader.prototype.tellMeWhenMediaLoaded = function(mediaElements) {
		return new Promise(function(resolve) {
			var elementsCount = mediaElements.length;
			var loadedCount = 0;

			var complete = function() {
				console.log('MediaPreloader.js: Media has finished loading.');
				resolve();
			};
			var onload = function() {
				loadedCount++;
				if (loadedCount === elementsCount) {
					complete();
				}
			};
			var onerror = function() {
				onload();
				throw 'MediaPreloader.js: A media element failed to load.';
			};

			if (elementsCount === 0) {
				complete();
				return;
			}
			for (var i = 0; i < elementsCount; i++) {
				var element = mediaElements[i];
				var mediaType = element.tagName;
				if (['IMG', 'PICTURE'].indexOf(mediaType) >= 0) {
					if (mediaType === 'PICTURE') {
						element = element.querySelectorAll('img')[0];
					}
					if (element.complete || element.naturalWidth > 0) { // 'load' event has already been fired, for example if image is already in DOM on page load
						onload();
					}
					else {
						element.addEventListener('load', onload);
						element.addEventListener('error', onerror);
					}
				}
				else if (mediaType === 'VIDEO') {
					if (element.readyState === 4) { // 'canplaythrough' event has already been fired, for example if video is already in DOM on page load
						onload();
					}
					else {
						element.addEventListener('canplaythrough', onload);
						element.addEventListener('error', onerror);
						if (element.getAttribute('preload') !== 'auto') {
							element.setAttribute('preload', 'auto');
							element.preload = 'auto';
						}
					}
				}
				else {
					throw 'MediaPreloader.js: Unsupported media type.';
				}

			}
		});
	};

	MediaPreloader.prototype.preloadImageSources = function() {
		return new Promise(function(resolve) {
			// TODO
		});
	};


	var mediaPreloader = new MediaPreloader();
	return mediaPreloader;
});
