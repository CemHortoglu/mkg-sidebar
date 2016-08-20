'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * mkg-sidebar
 * https://github.com/mkg0/mkg-sidebar
 */

var mSidebar = function () {
    _createClass(mSidebar, [{
        key: '_itemToHTML',
        value: function _itemToHTML(_ref) {
            var _this = this;

            var title = _ref.title;
            var text = _ref.text;
            var link = _ref.link;
            var _ref$follow = _ref.follow;
            var follow = _ref$follow === undefined ? true : _ref$follow;
            var _ref$items = _ref.items;
            var items = _ref$items === undefined ? [] : _ref$items;
            var depth = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            if (link && link.search(/^(https?|ftp):/) !== 0) link = this.options.baseURL.replace(/\/$/, '') + '/' + link.replace(/^\//, '');
            var resultHTML = '';
            if (items.length === 0) {
                resultHTML = '<a href="' + (link ? link : '') + '" title="' + (title ? title : text) + '"' + (follow ? '' : ' rel="nofollow"') + ' class="mSidebar-item mSidebar--d' + depth + '">' + text + '</a>';
            } else {
                var linkHTML = link ? '<a href="' + link + '" title="' + (title ? title : text) + '"' + (follow ? '' : ' rel="nofollow"') + ' class="mSidebar-collapse-header mSidebar--d' + depth + '">' + text + '</a>' : '<div class="mSidebar-collapse-header mSidebar--d' + depth + ' mSidebar-collapse--buttonrole">' + text + '</div>';

                resultHTML = '\n            <div class="mSidebar-collapse mSidebar--d' + depth + '">\n                <div class="mSidebar-collapse-button mSidebar--d' + depth + '"></div>\n                ' + linkHTML + '\n                <div class="mSidebar-collapse-items mSidebar--d' + (depth + 1) + '">\n                    ' + items.reduce(function (a, b) {
                    return a + _this._itemToHTML(b, depth + 1);
                }, '') + '\n                </div>\n            </div>';
            }
            return resultHTML;
        }
    }, {
        key: 'refreshItems',
        value: function refreshItems() {
            var itemsHTML = '';
            for (var i in this.items) {
                itemsHTML += this._itemToHTML(this.items[i]);
            }
            this.target.querySelector('.mSidebar-content').innerHTML = itemsHTML;
            return this;
        }
    }, {
        key: 'setContent',
        value: function setContent(context) {
            this.target.querySelector('.mSidebar-content').innerHTML = document.querySelector(context).innerHTML;
            return this;
        }
    }, {
        key: 'setHeader',
        value: function setHeader(context) {
            this.target.querySelector('.mSidebar-header').innerHTML = document.querySelector(context).innerHTML;
            return this;
        }
    }, {
        key: 'setFooter',
        value: function setFooter(context) {
            this.target.querySelector('.mSidebar-footer').innerHTML = document.querySelector(context).innerHTML;
            return this;
        }
    }, {
        key: 'removeItems',
        value: function removeItems() {
            this.items = [];
            this.refreshItems();
            return this;
        }
    }, {
        key: 'addItemFrom',
        value: function addItemFrom(context) {
            var foundItems = document.querySelectorAll(context);
            for (var i = 0; i < foundItems.length; i++) {
                this.addItem({
                    title: foundItems[i].getAttribute('title') ? foundItems[i].getAttribute('title') : this.options.defaultTitle,
                    text: foundItems[i].innerHTML.replace(/<[^>]+>/g, ''),
                    link: foundItems[i].getAttribute('href') ? foundItems[i].getAttribute('href') : '/',
                    follow: foundItems[i].getAttribute('rel') === 'nofollow' ? false : this.options.defaultFollow
                }, false);
            }
            this.refreshItems();
            return this;
        }
    }, {
        key: 'addItem',
        value: function addItem(_ref2) {
            var title = _ref2.title;
            var text = _ref2.text;
            var link = _ref2.link;
            var _ref2$follow = _ref2.follow;
            var follow = _ref2$follow === undefined ? true : _ref2$follow;
            var _ref2$items = _ref2.items;
            var items = _ref2$items === undefined ? [] : _ref2$items;
            var refresh = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            if (arguments.length === 0) return false;
            if (typeof arguments[0] === 'string') {
                title = arguments[0];
                text = arguments[0];
                link = arguments[0].toLowerCase().replace(/[^a-z0-9]/, '');
            } else if (Object.prototype.toString.call(arguments[0]) == '[object Array]') {
                var items = arguments[0];
                for (var i = 0; i < items.length; i++) {
                    this.addItem(items[i], false);
                }
                if (refresh) this.refreshItems();
                return this;
            }
            var newItem = {
                title: title,
                text: text,
                link: link,
                follow: follow,
                items: items
            };
            this.items.push(newItem);
            if (refresh) this.refreshItems();
            return this;
        }
    }]);

    function mSidebar() {
        _classCallCheck(this, mSidebar);

        this.propertyName = null;
        this.items = []; //{text:string,link:string,title:string,follow:bool}
        this.options = {
            baseURL: '',
            position: 'left', // left, top, bottom, right
            closeButton: true,
            closeOnBackgroundClick: true,
            animationType: 'css', // todo jquery, tweenMax, css, none
            defaultTitle: '',
            defaultFollow: true,
            onOpen: null,
            onClose: null,
            autoCollapse: false // auto collapse on close
        };
        for (var i = 0; i < arguments.length; i++) {
            var argument = arguments[i];
            if (typeof argument === 'string') {
                this.propertyName = argument;
            } else if (Object.prototype.toString.call(argument) == '[object Array]') {
                for (var i2 = 0; i2 < argument.length; i2++) {
                    this.addItem(argument[i2], false);
                }
            } else if ((typeof argument === 'undefined' ? 'undefined' : _typeof(argument)) === 'object') {
                for (var variable in argument) {
                    this.options[variable] = argument[variable];
                }
            } else if (typeof argument === 'function') {
                this.options.onOpen = argument;
            }
        }

        var newBar = document.createElement('aside');
        this.target = newBar;
        newBar.className += ' mSidebar mSidebar--' + this.options.position;
        newBar.innerHTML = '<div class="mSidebar-container">\n            <header>\n                ' + (this.options.closeButton ? '<div class="mSidebar-close"></div>' : '') + '\n                <div class="mSidebar-header"></div>\n            </header>\n            <div class="mSidebar-content"></div>\n            <footer class="mSidebar-footer"></footer>\n        </div>';
        this.refreshItems();
        document.body.appendChild(newBar);
        if (this.propertyName) {
            eval('mSidebar.' + this.propertyName + '=this');
        }
        if (this.options.closeButton) {
            newBar.querySelector(".mSidebar-close").addEventListener('click', this.close.bind(this));
        }
        newBar.addEventListener('click', this._onClick.bind(this));

        return this;
    }

    _createClass(mSidebar, [{
        key: '_onClick',
        value: function _onClick(e) {
            if (e.target === this.target && this.options.closeOnBackgroundClick) {
                this.close.call(this);
            }
            var clsName = ' ' + e.target.className + ' ';
            if (clsName.indexOf("mSidebar-collapse-button") > -1 || clsName.indexOf("mSidebar-collapse--buttonrole") > -1) {
                var parent = e.target.parentNode;
                if ((' ' + parent.className + ' ').indexOf(' mSidebar-collapse--open ') > -1) {
                    parent.className = parent.className.replace(/( |$)mSidebar-collapse--open/, '');
                } else {
                    parent.className += ' mSidebar-collapse--open';
                }
            }
        }
    }, {
        key: 'open',
        value: function open() {
            // setInterval(function () {
            //     this.uncollapse();
            // }.bind(this),4000);
            if ((' ' + this.target.className + ' ').indexOf(" mSidebar--close ") > -1) this.target.className = this.target.className.replace('mSidebar--close', 'mSidebar--open');else this.target.className += ' mSidebar--open';
            if (this.options.onOpen) {
                this.options.onOpen.call(this);
            }
            return this;
        }
    }, {
        key: 'close',
        value: function close() {
            this.target.className = this.target.className.replace('mSidebar--open', 'mSidebar--close');
            if (this.options.autoCollapse) this.collapse();
            if (this.options.onClose) this.options.onClose.call(this);
            return this;
        }
    }, {
        key: 'toggle',
        value: function toggle() {
            if ((' ' + this.target.className + ' ').indexOf(" mSidebar--open ") > -1) this.close();else this.open();
            return this;
        }
    }, {
        key: 'collapse',
        value: function collapse() {
            var foundItems = this.target.querySelectorAll('.mSidebar-collapse--open');
            for (var i = 0; i < foundItems.length; i++) {
                foundItems[i].className = foundItems[i].className.replace(/ ?mSidebar-collapse--open/, '');
            }
            return this;
        }
    }, {
        key: 'uncollapse',
        value: function uncollapse() {
            var foundItems = this.target.querySelectorAll('.mSidebar-collapse:not(.mSidebar-collapse--open)');
            for (var i = 0; i < foundItems.length; i++) {
                foundItems[i].className += ' mSidebar-collapse--open';
            }
            return this;
        }
    }]);

    return mSidebar;
}();
//# sourceMappingURL=mkg-sidebar.js.map
