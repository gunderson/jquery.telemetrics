/*
* Telemetrics
* 
*
* Copyright (c) 2013 Patrick Gunderson
* Licensed under the MIT license.
*/

(function ($) {

	function Telemetrics($el, options){
		options = $.extend({
		}, options);

		var TWO_PI = Math.PI * 2,
			px = 0,
			py = 0,
			dx = 0,
			dy = 0,
			cache = null,
			_this = this;
		//------------------------------------
		// Main Interface

		this.getAngle = function(){
			return Math.atan2(dy, dx);
		};

		this.getSpeed = function(){
			return Math.sqrt((dx*dx)+(dy*dy));
		};

		this.getDirection = function(){
			var initialOffset = Math.PI / 4, //45°
				HALF_PI = Math.PI * 0.5,
				angle = this.getAngle() + initialOffset;
			if (angle >=0 && angle < HALF_PI){
				//right
			} else if (angle >= HALF_PI && angle < Math.PI){
				//down
			} else if (angle > Math.PI || angle < -HALF_PI){
				//left
			} else if (angle < 0 && angle > -Math.PI){
				//up
			}
		};

		this.start = function(){
			eventListeners('on');
			return $el;
		};

		this.stop = function(){
			eventListeners('off');
			return $el;
		};

		this.get = function(){
			if (!cache) { 
				cache = {
					angle: _this.getAngle(),
					speed: _this.getSpeed(),
					direction: _this.getDirection()
				};
			}
			return cache;
		};

		//------------------------------------
		// Event handlers

		this.onMouseMove = function(e){
			dx = e.pageX - px;
			dy = e.pageY - py;
			px = e.pageX;
			py = e.pageY;
			cache = null;
			$el.trigger("telemetrics", this);
		};

		//------------------------------------
		// Event listeners

		var events = {
			"mousemove" : "onMouseMove"
		};

		function eventListeners(onOrOff){
			$.each(events, function(key, val){
				$(window)[onOrOff](key, $.proxy(this[val], this));
			});
		}

		// ----------------------------------
		// utils

		function average(numbers) {
			var total = 0;
			for (var i = 0, len = numbers.length; i < len; i++) {
				total += numbers[i];
			}
			return total / len;
		}
		
		return this;
	}


	// Collection method.
	$.fn.telemetrics = function () {
		return this.each(function (i) {
			var $this = $(this);
			// Do something awesome to each selected element.
			return Telemetrics($this);
		});
	};

}(jQuery));
