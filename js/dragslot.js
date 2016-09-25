;(function($, window, document, undefined){
	var eStart  = 'mousedown',
	eMove   = 'mousemove',
	eEnd    = 'mouseup';
	
	var clientX,clientY;
	var defaults = {
		slotItemClass : 'slot-item',
		placeElClass : 'place-el',
		dragItemClass : 'drag-item',
		slotListClass : 'slot-list',
		slotHandlerClass : 'slot-handler',
		emptySlotClass : 'empty-slot',
		slotClass : 'slot',
		slotItem : 'li',
		slotList : 'ul',
		dropCallback    : null
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
			slotContainer.placeEl = $('<div class="'+ slotContainer.options.placeElClass +'"/>');
			var onStartEvent = function(e){
				var handle = $(e.target);
				if(!handle.closest('.' + slotContainer.options.slotItemClass)){
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
			dragItem = target.closest('.' + this.options.slotItemClass);
			this.placeEl.css('height', dragItem.height());
			this.dragEl = $(document.createElement('div')).addClass(this.options.slotItemClass + ' ' + this.options.dragItemClass);
			this.slotlist = target.closest('.' + this.options.slotListClass);
			dragItem.after(this.placeEl);
			dragItem.css('width',dragItem.width() + 'px');
			if(dragItem[0].parentNode){
				dragItem[0].parentNode.removeChild(dragItem[0]);
			}
			
			dragItem.appendTo(this.dragEl);
			$(document.body).append(this.dragEl);
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

            this.dragEl[0].style.visibility = 'hidden';
			this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));

            this.dragEl[0].style.visibility = 'visible';

			if (this.pointEl.closest('.' + this.options.slotHandlerClass).length) {
                this.pointEl = this.pointEl.closest('.' + this.options.slotHandlerClass).parent(this.options.slotItem);
            }
            if (this.pointEl.hasClass(this.options.emptySlotClass)) {
                isEmpty = true;
            }
             else if (!this.pointEl.length || !this.pointEl.hasClass(this.options.slotItemClass)) {
                return;
            }
             var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);
                    parent = this.placeEl.parent();

             if (isEmpty) {
                    list = $(document.createElement(this.options.slotList)).addClass(this.options.slotListClass);
                    list.append(this.placeEl);
                    this.pointEl.append(list);
                }
                else if (before) {
                    this.pointEl.before(this.placeEl);
                }
                else {
                    this.pointEl.after(this.placeEl);
                }
                this.toSlot = this.pointEl.closest('.' + this.options.slotClass);
		},
		dragEnd : function(e){
			var self = this;
			var el = self.dragEl.children('.' + self.options.slotItemClass).first();
            el[0].parentNode.removeChild(el[0]);
            this.placeEl.replaceWith(el);
            
            self.dragEl.remove();
            if($.isFunction(self.options.dropCallback)) {
              var itemInfo = {
              	dragItem : el,
              	sourceSlot : self.slotlist.closest('.slot'),
              	destinationSlot : self.toSlot,
              	dragItemId : el.attr('id') 
              } 
              self.options.dropCallback.call(self, itemInfo);
            }
            self.dragEl = null;
            self.pointEl = null;
            if (self.toSlot.hasClass(self.options.emptySlotClass)) {
                self.toSlot.removeClass(self.options.emptySlotClass);
            }
            if(self.slotlist.children().length==0){
            	self.slotlist.closest('.' + self.options.slotClass).addClass(self.options.emptySlotClass);
            	self.slotlist[0].parentNode.removeChild(self.slotlist[0]);
            }
		}
	}
	

	$.fn.dragslot = function(options){
		var slot = this;
		new Dragslot(slot,options);
	}

})(window.jQuery, window, document);