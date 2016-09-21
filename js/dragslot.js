;(function($, window, document, undefined){
	var eStart  = 'mousedown',
	eMove   = 'mousemove',
	eEnd    = 'mouseup';
	
	var clientX,clientY;
	var defaults = {

	}
	var hasPointerEvents = (function()
    {
        var el    = document.createElement('div'),
            docEl = document.documentElement;
        if (!('pointerEvents' in el.style)) {
            return false;
        }
        el.style.pointerEvents = 'auto';
        el.style.pointerEvents = 'x';
        docEl.appendChild(el);
        var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
        docEl.removeChild(el);
        return !!supports;
    })();
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
				if(!handle.hasClass('slot-item') && !handle.parent().hasClass('slot-item')){
					return;
				}

				e.preventDefault();
				slotContainer.dragStart(e);
				
			};
			var onMoveEvent = function(e){
				var handle = $(e.target);
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
			this.slotlist = target.closest('.slot-list');
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
			var isEmpty;
			 // if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'hidden';
            // }
			this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
			// if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'visible';
            // }
			if (this.pointEl.hasClass('slot-handler')) {
                this.pointEl = this.pointEl.parent('li');
            }
            if (this.pointEl.hasClass('empty-slot')) {
                isEmpty = true;
            }
             else if (!this.pointEl.length || !this.pointEl.hasClass('slot-item')) {
                return;
            }
             var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);
                    parent = this.placeEl.parent();

             if (isEmpty) {
                    list = $(document.createElement('lo')).addClass('slot-list');
                    list.append(this.placeEl);
                    this.pointEl.append(list);
                    list.closest('.slot').removeClass('empty-slot');
                }
                else if (before) {
                    this.pointEl.before(this.placeEl);
                }
                else {
                    this.pointEl.after(this.placeEl);
                }
		},
		dragEnd : function(e){
			var el = this.dragEl.children('.slot-item').first();
            el[0].parentNode.removeChild(el[0]);
            this.placeEl.replaceWith(el);
            this.dragEl.remove();
            this.dragEl = null;
            this.pointEl = null;
            if(this.slotlist.children().length==0){
            	this.slotlist.closest('.slot').addClass('empty-slot');
            	this.slotlist[0].parentNode.removeChild(this.slotlist[0]);
            }
		}
	}
	

	$.fn.dragslot = function(options){
		var slot = this;
		new Dragslot(slot,options);
	}

})(window.jQuery, window, document);