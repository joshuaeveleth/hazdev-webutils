/* global define */
define([
	'mvc/View',
	'util/Util'
], function (
	View,
	Util
) {
	'use strict';

	var DEFAULTS = {
		// classname added to select box
		className: 'collection-selectbox',
		// callback to format each collection item
		format: function (item) {
			return item.id;
		},
		// whether to render during initialize
		renderNow: true
	};

	/**
	 * Create a new CollectionSelectBox to select a collection item.
	 *
	 * @param options {Object}
	 * @param options.format {Function(Object)}
	 *        callback function to format select box items.
	 * @param options.className {String}
	 *        Default 'collection-selectbox'.
	 *        Class name for select box.
	 * @param options.collection {Collection}
	 *        the collection to display.
	 *        NOTE: the collection should have an existing selection;
	 *        otherwise, the first item in the select box will be selected
	 *        in the UI and not in the collection.
	 * @see mvc/View
	 */
	var CollectionSelectBox = function (options) {
		options = Util.extend({}, DEFAULTS, options);
		this._options = options;

		View.call(this, options);
	};

	CollectionSelectBox.prototype = Object.create(View.prototype);


	/**
	 * Initialize CollectionSelectBox.
	 */
	CollectionSelectBox.prototype._initialize = function () {
		var el = this._el,
		    options = this._options,
		    collection;

		// call parent initialize
		View.prototype._initialize.call(this);

		// reuse or create select box
		if (el.nodeName === 'SELECT') {
			this._selectBox = el;
		} else {
			this._selectBox = el.appendChild(document.createElement('select'));
		}
		this._selectBox.classList.add(options.className);

		// bind to events on the collection
		collection = options.collection;
		collection.on('add', this.render, this);
		collection.on('remove', this.render, this);
		collection.on('reset', this.render, this);
		collection.on('select', this._onSelect, this);
		collection.on('deselect', this._onSelect, this);
		this._collection = collection;

		// bind to events on this._selectBox
		this._onChange = this._onChange.bind(this);
		this._selectBox.addEventListener('change', this._onChange);

		// populate select box
		if (options.renderNow) {
			this.render();
		}
	};

	CollectionSelectBox.prototype.destroy = function () {
		var collection = this._collection;

		collection.off('add', this.render, this);
		collection.off('remove', this.render, this);
		collection.off('reset', this.render, this);
		collection.off('select', this._onSelect, this);
		collection.off('deselect', this._onSelect, this);

		this._selectBox.removeEventListener('change', this._onChange);

		this._options = null;
		this._collection = null;
		this._selectBox = null;
		delete this._onChange;

		// call parent destroy
		View.prototype.destroy.call(this);
	};

	/**
	 * Update select box items.
	 */
	CollectionSelectBox.prototype.render = function () {
		var options = this._options,
		    format = options.format,
		    data = this._collection.data(),
		    selected = this._collection.getSelected(),
		    i, len,
		    markup = [];

		for (i = 0, len = data.length; i < len; i++) {
			markup.push('<option value="' + i + '"' +
					(selected === data[i] ? ' selected="selected"' : '') +
					'>' + format(data[i]) + '</option>');
		}
		this._selectBox.innerHTML = markup.join('');

		this._onSelect();
	};

	/**
	 * Handle collection select events.
	 */
	CollectionSelectBox.prototype._onSelect = function () {
		var collection = this._collection,
		    selected = collection.getSelected(),
		    ids;

		if (selected) {
			ids = collection.getIds();
			this._selectBox.value = ids[selected.id];
		} else {
			this._selectBox.value = '';
		}
	};

	/**
	 * Handle selectbox change events.
	 */
	CollectionSelectBox.prototype._onChange = function () {
		var collection = this._collection,
		    value = this._selectBox.value,
		    selected;

		if (value === '') {
			collection.deselect();
		} else {
			selected = collection.data()[parseInt(value, 10)];
			collection.select(selected);
		}
	};

	// return constructor
	return CollectionSelectBox;
});
