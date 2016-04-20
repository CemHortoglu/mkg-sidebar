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

            if (link.search(/^(https?|ftp):/) !== 0) link = this.options.baseURL.replace(/\/$/, '') + '/' + link.replace(/^\//, '');
            var resultHTML = '';
            if (items.length === 0) {
                resultHTML = '<a href="' + link + '" title="' + (title ? title : text) + '"' + (follow ? '' : ' rel="nofollow"') + ' class="mSidebar-item">' + text + '</a>';
            } else {
                resultHTML = '\n            <div class="mSidebar-collapse">\n                <div class="mSidebar-collapse-button"></div>\n                <a href="' + link + '" title="' + (title ? title : text) + '"' + (follow ? '' : ' rel="nofollow"') + ' class="mSidebar-collapse-header">' + text + '</a>\n                <div class="mSidebar-collapse-items">\n                    ' + items.reduce(function (a, b) {
                    return a + _this._itemToHTML(b);
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
        key: 'setItems',
        value: function setItems(context) {
            this.items = [];
            var foundItems = document.querySelectorAll(context);
            for (var i = 0; i < foundItems.length; i++) {
                console.log(foundItems[i]);
                this.addItem({
                    title: foundItems[i].getAttribute('title'),
                    text: foundItems[i].innerHTML.replace(/<[^>]+>/g, ''),
                    link: foundItems[i].getAttribute('href'),
                    follow: foundItems[i].getAttribute('rel') === 'nofollow' ? false : true
                }, false);
            }
            this.refreshItems();
            return this;
        }
    }, {
        key: 'setContent',
        value: function setContent(context) {
            this.target.querySelector('.mSidebar-content').innerHTML = document.querySelector(context).innerHTML;
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
            animationType: 'css', //jquery, tweenMax, css, none
            onOpen: null,
            onClose: null,
            setItems: undefined, //method
            setContent: undefined //method
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
        newBar.innerHTML = '<div class="mSidebar-container">\n            <header>\n                ' + (this.options.closeButton ? '<div class="mSidebar-close"></div>' : '') + '\n            </header>\n            <div class="mSidebar-content"></div>\n            <footer></footer>\n        </div>';
        this.refreshItems();
        document.body.appendChild(newBar);
        if (this.propertyName) {
            eval('mSidebar.' + this.propertyName + '=this');
        }
        if (this.options.closeButton) {
            newBar.querySelector(".mSidebar-close").addEventListener('click', this.close.bind(this));
        }
        newBar.addEventListener('click', this._onClick.bind(this));

        if (this.options.setItems) {
            this.setItems(this.options.setItems);
        }
        if (this.options.setContent) {
            this.setContent(this.options.setContent);
        }

        return this;
    }

    _createClass(mSidebar, [{
        key: '_onClick',
        value: function _onClick(e) {
            if (e.target === this.target && this.options.closeOnBackgroundClick) {
                this.close.call(this);
            }
            var clsName = ' ' + e.target.className + ' ';
            if (clsName.indexOf(" mSidebar-collapse-button ") > -1) {
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
            if (this.options.onClose) {
                this.options.onClose.call(this);
            }
            return this;
        }
    }, {
        key: 'toggle',
        value: function toggle() {
            if ((' ' + this.target.className + ' ').indexOf(" mSidebar--open ") > -1) this.close();else this.open();
            return this;
        }
    }]);

    return mSidebar;
}();

var sideBara = {
    target: null,
    changeTarget: function changeTarget(targetBar) {
        if (targetBar) this.target = $(targetBar);
        if (!this.target.is('.sideBar')) this.target = this.target.parents('.sideBar');
    }, open: function open(targetBar) {
        this.changeTarget(targetBar);
        if (this.target.is('.sideBar--full')) {
            TweenMax.set(this.target, { display: 'block' });
            TweenMax.from(this.target, 0.24, { opacity: 0 });
            TweenMax.staggerFrom(this.target.find('.sideBar-item'), 0.35, { xPercent: -20, opacity: 0, delay: 0.15 }, 0.07);
        } else if (this.target.is('.sideBar--left')) {
            TweenMax.set(this.target, { display: 'block' });
            TweenMax.from(this.target, 0.24, { opacity: 0 });
            TweenMax.from(this.target.find('.sideBar-container'), 0.24, { xPercent: -100, opacity: 0, delay: 0.3 });
            TweenMax.from(this.target.find('.sideBar-item'), 0.35, { xPercent: -20, opacity: 0.4, delay: 0.430 });
        } else if (this.target.is('.sideBar--right')) {
            TweenMax.set(this.target, { display: 'block' });
            TweenMax.from(this.target, 0.24, { opacity: 0 });
            TweenMax.from(this.target.find('.sideBar-container'), 0.24, { xPercent: 100, opacity: 0, delay: 0.3 });
            TweenMax.from(this.target.find('.sideBar-item'), 0.35, { xPercent: -20, opacity: 0.4, delay: 0.430 });
        } else if (this.target.is('.sideBar--top')) {
            this.target.css('display', 'block');
            TweenMax.to(this.target, 0.2, { opacity: 1 });
            TweenMax.from(this.target.find('.sideBar-container'), 0.4, { opacity: '0.4', yPercent: -100, delay: 0.2 });
            TweenMax.staggerFrom(this.target.find('.sideBar-item'), 0.55, { opacity: '0', y: -55, scale: 0.3 }, 0.08);
        } else if (this.target.is('.sideBar--bottom')) {
            this.target.css('display', 'block');
            TweenMax.to(this.target, 0.2, { opacity: 1 });
            TweenMax.from(this.target.find('.sideBar-container'), 0.4, { opacity: '0.4', yPercent: 100, delay: 0.2 });
            TweenMax.staggerFrom(this.target.find('.sideBar-item'), 0.55, { opacity: '0', y: -55, scale: 0.3 }, 0.08);
        }
    }, close: function close(targetBar) {
        this.changeTarget(targetBar);
        if (this.target.is('.sideBar--full')) {
            TweenMax.staggerTo(this.target.find('.sideBar-item'), 0.35, { xPercent: -20, opacity: 0 }, 0.07);
            TweenMax.to(this.target, 0.24, { opacity: 0, delay: 0.6,
                onComplete: function onComplete() {
                    TweenMax.set(this.target, { display: 'none', opacity: 1 });
                    TweenMax.set(this.target.find('.sideBar-container'), { xPercent: 0, opacity: 1 });
                    TweenMax.set(this.target.find('.sideBar-item'), { xPercent: 0, opacity: 1 });
                }
            });
        } else if (this.target.is('.sideBar--left')) {
            TweenMax.to(this.target.find('.sideBar-item'), 0.25, { xPercent: -20, opacity: 0.4 });
            TweenMax.to(this.target.find('.sideBar-container'), 0.25, { xPercent: -100, opacity: 0, delay: 0.1 });
            TweenMax.to(this.target, 0.24, {
                opacity: 0,
                delay: 0.430,
                onComplete: function onComplete() {
                    TweenMax.set(this.target, { display: 'none', opacity: 1 });
                    TweenMax.set(this.target.find('.sideBar-container'), { xPercent: 0, opacity: 1 });
                    TweenMax.set(this.target.find('.sideBar-item'), { xPercent: 0, opacity: 1 });
                }
            });
        } else if (this.target.is('.sideBar--right')) {
            TweenMax.to(this.target.find('.sideBar-item'), 0.25, { xPercent: -20, opacity: 0.4 });
            TweenMax.to(this.target.find('.sideBar-container'), 0.25, { xPercent: 100, opacity: 0, delay: 0.1 });
            TweenMax.to(this.target, 0.24, {
                opacity: 0,
                delay: 0.430,
                onComplete: function onComplete() {
                    TweenMax.set(this.target, { display: 'none', opacity: 1 });
                    TweenMax.set(this.target.find('.sideBar-container'), { xPercent: 0, opacity: 1 });
                    TweenMax.set(this.target.find('.sideBar-item'), { xPercent: 0, opacity: 1 });
                }
            });
        } else if (this.target.is('.sideBar--top')) {
            TweenMax.staggerTo(this.target.find('.sideBar-item'), 0.55, { opacity: '0', y: -55, scale: 0.3 }, 0.08);
            TweenMax.to(this.target.find('.sideBar-container'), 0.4, { opacity: '0.4', yPercent: -100, delay: 0.5 });
            TweenMax.to(this.target, 0.2, { opacity: 0, delay: 0.8, onComplete: function onComplete() {
                    TweenMax.set(this.target, { display: 'none', opacity: 1 });
                    TweenMax.set(this.target.find('.sideBar-container'), { yPercent: 0, opacity: 1 });
                    TweenMax.set(this.target.find('.sideBar-item'), { y: 0, opacity: 1, scale: 1 });
                } });
        } else if (this.target.is('.sideBar--bottom')) {
            TweenMax.staggerTo(this.target.find('.sideBar-item'), 0.55, { opacity: '0', y: 55, scale: 0.3 }, 0.08);
            TweenMax.to(this.target.find('.sideBar-container'), 0.4, { opacity: '0.4', yPercent: 100, delay: 0.5 });
            TweenMax.to(this.target, 0.2, { opacity: 0, delay: 0.8, onComplete: function onComplete() {
                    TweenMax.set(this.target, { display: 'none', opacity: 1 });
                    TweenMax.set(this.target.find('.sideBar-container'), { yPercent: 0, opacity: 1 });
                    TweenMax.set(this.target.find('.sideBar-item'), { y: 0, opacity: 1, scale: 1 });
                } });
        }
    }, init: function init() {
        $('.sideBar').click(function (e) {
            var target = $(e.target);
            if (target.is('.sideBar-close, .sideBar')) {
                sideBar.close(this);
            }
        });
    }
};
//# sourceMappingURL=mkg-sidebar.js.map
