;(function($, window, document, undefined){
	var eStart  = 'mousedown touchstart MSPointerDown pointerdown',
	eMove   = 'mousemove touchmove MSPointerMove pointermove',
	eEnd    = 'mouseup touchend touchcancel MSPointerUp MSPointerCancel pointerup pointercancel';
	var clientX,clientY,moving;
	var defaults = {

	}
	function Dragslot(element,options){
		this.w  = $(window);
		this.el = $(element);
		this.options = $.extend({}, defaults, options);
		this.init();
	}
	Dragslot.prototype = {
		init : function(){
			var slotContainer = this;
			slotContainer.placeEl = $('<div class="placeEl"/>');
			var onStartEvent = function(e){
				var handle = $(e.target);
				if(!handle.hasClass('slot-item')){
					return;
				}

				e.preventDefault();
				slotContainer.dragStart(e);
			};
			var onMoveEvent = function(e){
				var handle = $(e.target);
				if(!handle.hasClass('slot-item')){
					return;
				}
				if(slotContainer.dragEl){
						e.preventDefault();
						slotContainer.dragMove(e);
					}
			};
			var onEndEvent = function(e){
				var handle = $(e.target);
				if(slotContainer.dragEl){
						e.preventDefault();
						slotContainer.dragEnd(e);
					}
				
			};
			slotContainer.el.on(eStart, onStartEvent);
			slotContainer.w.on(eMove, onMoveEvent);
			slotContainer.w.on(eEnd, onEndEvent);

		},
		dragStart : function(e){
			var target = $(e.target),
			dragItem = target.closest('.slot-item');
			this.placeEl.css('height', dragItem.height());
			this.dragEl = $(document.createElement('div')).addClass('slot-item drag-item');
			dragItem.after(this.placeEl);
			var w = dragItem.width();
			dragItem.css('width',w + 'px');
			dragItem[0].parentNode.removeChild(dragItem[0]);
			dragItem.appendTo(this.dragEl);
			$(document.body).append(this.dragEl);
			var offsetX = e.offsetX !== undefined ? e.offsetX : e.pageX - target.offset().left;
			var offsetY = e.offsetY !== undefined ? e.offsetY : e.pageY - target.offset().top;
			clientX = e.clientX;
			clientY = e.clientY;
			this.dragEl.css({
				'left' : clientX,
				'top'  : clientY
			});
			
			moving = !0;
		},
		dragMove : function(e){
			var newClientX = e.clientX,
			newClientY = e.clientY;
			var left = parseInt(this.dragEl[0].style.left) || 0;
			var top = parseInt(this.dragEl[0].style.top) || 0;
			this.dragEl[0].style.left = left + (newClientX - clientX) + 'px';
			this.dragEl[0].style.top = top + (newClientY - clientY) + 'px';
			clientX = newClientX;
			clientY = newClientY;
		},
		dragEnd : function(e){
			var el = this.dragEl.children('.slot-item').first();
            el[0].parentNode.removeChild(el[0]);
            this.placeEl.replaceWith(el);
		}
	}
	

	$.fn.dragslot = function(options){
		var slot = this;
		new Dragslot(slot,options);
	}

})(window.jQuery || window.Zepto, window, document);