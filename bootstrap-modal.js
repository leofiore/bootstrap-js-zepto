/* =========================================================
 * bootstrap-modal.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($){

	"use strict" // jshint ;_;

	/* MODAL CLASS DEFINITION
	 * ====================== */

	var Modal = function (content, options) {
		this.options = options
		this.$element = $(content)
			.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))
	}

	Modal.prototype = {
		constructor: Modal
		, toggle: function () {
			return this[!this.isShown ? 'show' : 'hide']()
		}
		, show: function () {
			var that = this
				, e = $.Event('show')
			this.$element.trigger(e)
			if (this.isShown || (e.isDefaultPrevented && e.isDefaultPrevented())) return
			$('body').addClass('modal-open')
			this.isShown = true
			escape.call(this)
			backdrop.call(this, function () {
				var transition = that.$element.hasClass('fade')
				!that.$element.parent().length && that.$element.appendTo(document.body) //don't move modals dom position
				that.$element.show()
				if (transition) {
					that.$element[0].offsetWidth // force reflow
				}
				that.$element.addClass('in')
				transition ?
					that.$element.one($.fx.transitionEnd, function () { that.$element.trigger('shown') }) :
					that.$element.trigger('shown')
			})
		}
		, hide: function (e) {
			e && e.preventDefault()
			var that = this
			e = $.Event('hide')
			this.$element.trigger(e)
			if (!this.isShown || (e.isDefaultPrevented && e.isDefaultPrevented())) return
			this.isShown = false
			$('body').removeClass('modal-open')
			escape.call(this)
			this.$element.removeClass('in')
			this.$element.hasClass('fade') ?
				hideWithTransition.call(this) :
				hideModal.call(this)
		}
	}


	/* MODAL PRIVATE METHODS
	 * ===================== */

	function hideWithTransition() {
		var that = this
			, timeout = setTimeout(function () {
			that.$element.off($.fx.transitionEnd)
			hideModal.call(that)
		}, 500)
		this.$element.one($.fx.transitionEnd, function () {
			clearTimeout(timeout)
			hideModal.call(that)
		})
	}

	function hideModal(that) {
		this.$element.hide().trigger('hidden')
		backdrop.call(this)
	}

	function backdrop(callback) {
		var animate = this.$element.hasClass('fade') ? 'fade' : ''
		if (this.isShown && this.options.backdrop) {
			this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
				.appendTo(document.body)
			if (this.options.backdrop != 'static') {
				this.$backdrop.click($.proxy(this.hide, this))
			}
			if (animate) this.$backdrop[0].offsetWidth // force reflow
			this.$backdrop.addClass('in')
			animate ?
				this.$backdrop.one($.fx.transitionEnd, callback) :
				callback()
		} else if (!this.isShown && this.$backdrop) {
			this.$backdrop.removeClass('in')
			animate ?
				this.$backdrop.one($.fx.transitionEnd, $.proxy(removeBackdrop, this)) :
				removeBackdrop.call(this)
		} else if (callback) {
			callback()
		}
	}

	function removeBackdrop() {
		this.$backdrop.remove()
		this.$backdrop = null
	}

	function escape() {
		var that = this
		if (this.isShown && this.options.keyboard) {
			$(document).on('keyup.dismiss.modal', function ( e ) {
				e.which == 27 && that.hide()
			})
		} else if (!this.isShown) {
			$(document).off('keyup.dismiss.modal')
		}
	}


	/* MODAL PLUGIN DEFINITION
	 * ======================= */

	$.fn.modal = function (option) {
		return this.each(function () {
			var options = $.extend({}, $.fn.modal.defaults, typeof option == 'object' && option)
			var data = this.data_modal = (this.data_modal ? this.data_modal : new Modal(this, options))
			if (typeof option == 'string') data[option]()
			else if (options.show) data.show()
		})
	}

	$.fn.modal.defaults = {
		backdrop: true
		, keyboard: true
		, show: true
	}

	$.fn.modal.Constructor = Modal

	/* MODAL DATA-API
	 * ============== */

	$(function () {
		$('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
			var $this = $(this), href
				, $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
				, option = this.data_modal ? 'toggle' : {}
			e.preventDefault()
			e.stopPropagation()
			$target.modal(option)
		})
	})

}(Zepto || jQuery);
