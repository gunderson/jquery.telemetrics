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
			historyLength: 2
		}, options);

		var TWO_PI = Math.PI * 2,
			HALF_PI = Math.PI * 0.5,
			QUARTER_PI = Math.PI * 0.25,
			startX = null,
			startY = null,
			qx = 0,
			qy = 0,
			px = 0,
			py = 0,
			dx = 0,
			dy = 0,
			ex = 0,
			ey = 0,
			cache = null,
			history = [],
			_this = this;

		//------------------------------------
		// Main Interface

		function angle(dx, dy){
			return Math.atan2(dy, dx);
		}
		this.angle = angle;

		this.getAngle = function(){
			return angle(dx, dy);
		};

		//--

		function speed(dx, dy){
			return Math.sqrt((dx*dx)+(dy*dy));
		}
		this.speed = speed;

		this.getSpeed = function(){
			return speed(dx, dy);
		};

		//--

		function acceleration(dx, dy, ex, ey){
			return speed(dx, dy) - speed(ex, ey);

		}
		
		this.acceleration = acceleration;

		this.getAcceleration = function(){
			return acceleration(dx, dy, ex, ey);
		};

		//--

		this.getDirection = function(){
			var angle = this.getAngle();
			if (angleInRange(angle, -QUARTER_PI, QUARTER_PI)){
				//right
				return "right";
			} else if (angleInRange(angle, QUARTER_PI, HALF_PI + QUARTER_PI)){
				//down
				return "down";
			} else if (angleInRange(angle, HALF_PI + QUARTER_PI, Math.PI + QUARTER_PI)){
				//left
				return "left";
			} else if (angleInRange(angle, Math.PI + QUARTER_PI, -QUARTER_PI)){
				//up
				return "up";
			}
		};

		//--

		function normalizeAngle (a){
			a %= TWO_PI;
			a = a < 0 ? TWO_PI - a: a;
			return a;
		}
		this.normalizeAngle = normalizeAngle;

		//--

		//tells whether the test angle is within the smallest angle created by the other rays
		function angleInRange (testAngle, minAngle, maxAngle){
			testAngle = normalizeAngle(testAngle);
			minAngle = normalizeAngle(minAngle);
			maxAngle = normalizeAngle(maxAngle);

			if (minAngle > maxAngle) {
				var tmp = minAngle;
				minAngle = maxAngle;
				maxAngle = tmp;
			}

			return minAngle <= testAngle && maxAngle > testAngle;
		}

		this.angleInRange = angleInRange;

		//--

		this.start = function(e){
			if (e) {
				// record start position
				startX = e.pageX;
				startY = e.pageY;
			}
			setListeners('on');
			return $el;
		};

		this.stop = function(){
			setListeners('off');
			return $el;
		};

		//--

		this.get = function(){
			if (!cache) { 
				cache = {
					position: {x:px, y:py},
					delta: {x:dx, y:dx},
					prev: {x:qx, y:qy},
					angle: angle(dx, dy),
					speed: speed(dx, dy),
					direction: _this.getDirection(),
					history: history
				};
				addToHistory(cache);
			}
			return cache;
		};

		function addToHistory(obj){
			history.unShift(obj);
			if (history.length > options.historyLength) {
				history.pop();
			}
			return history;
		}

		//------------------------------------
		// Event handlers

		this.onMouseMove = function(e){
			ex = dx;
			ey = dy;
			dx = e.pageX - px;
			dy = e.pageY - py;
			qx = px;
			qy = py;
			px = e.pageX;
			py = e.pageY;
			cache = null;
			$el.trigger("telemetrics", this.get());
		};

		//------------------------------------
		// Event listeners

		var events = {
			"mousemove" : "onMouseMove"
		};

		function setListeners(onOrOff){
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
