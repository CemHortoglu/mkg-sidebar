'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mkgSideBar = function () {
    _createClass(mkgSideBar, [{
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
                resultHTML = '<a href="' + link + '" title="' + (title ? title : text) + '"' + (follow ? '' : ' rel="nofollow"') + ' class="msb-item">' + text + '</a>';
            } else {
                resultHTML = '\n            <div class="msb-collapse">\n                <div class="msb-collapse-button"></div>\n                <a href="' + link + '" title="' + (title ? title : text) + '"' + (follow ? '' : ' rel="nofollow"') + ' class="msb-collapse-header">' + text + '</a>\n                <div class="msb-collapse-items">\n                    ' + items.reduce(function (a, b) {
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
            this.target.querySelector('.msb-content').innerHTML = itemsHTML;
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
            this.target.querySelector('.msb-content').innerHTML = document.querySelector(context).innerHTML;
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

    function mkgSideBar() {
        _classCallCheck(this, mkgSideBar);

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
        newBar.className += ' msb msb--' + this.options.position;
        newBar.innerHTML = '<div class="msb-container">\n            <header>\n                ' + (this.options.closeButton ? '<div class="msb-close"></div>' : '') + '\n            </header>\n            <div class="msb-content"></div>\n            <footer></footer>\n        </div>';
        this.refreshItems();
        document.body.appendChild(newBar);
        if (this.propertyName) {
            eval('mkgSideBar.' + this.propertyName + '=this');
        }
        if (this.options.closeButton) {
            newBar.querySelector(".msb-close").addEventListener('click', this.close.bind(this));
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

    _createClass(mkgSideBar, [{
        key: '_onClick',
        value: function _onClick(e) {
            if (e.target === this.target && this.options.closeOnBackgroundClick) {
                this.close.call(this);
            }
            var clsName = ' ' + e.target.className + ' ';
            if (clsName.indexOf(" msb-collapse-button ") > -1) {
                var parent = e.target.parentNode;
                if ((' ' + parent.className + ' ').indexOf(' msb-collapse--open ') > -1) {
                    parent.className = parent.className.replace(/( |$)msb-collapse--open/, '');
                } else {
                    parent.className += ' msb-collapse--open';
                }
            }
        }
    }, {
        key: 'open',
        value: function open() {
            if ((' ' + this.target.className + ' ').indexOf(" msb--close ") > -1) this.target.className = this.target.className.replace('msb--close', 'msb--open');else this.target.className += ' msb--open';
            if (this.options.onOpen) {
                this.options.onOpen.call(this);
            }
            return this;
        }
    }, {
        key: 'close',
        value: function close() {
            this.target.className = this.target.className.replace('msb--open', 'msb--close');
            if (this.options.onClose) {
                this.options.onClose.call(this);
            }
            return this;
        }
    }, {
        key: 'toggle',
        value: function toggle() {
            if ((' ' + this.target.className + ' ').indexOf(" msb--open ") > -1) this.close();else this.open();
            return this;
        }
    }]);

    return mkgSideBar;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1rZ1NpZGVCYXIuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBQU07OzswQ0FDaUQ7OztnQkFBdEMsbUJBQXNDO2dCQUFoQyxpQkFBZ0M7Z0JBQTNCLGlCQUEyQjttQ0FBdEIsT0FBc0I7Z0JBQXRCLHFDQUFPLG1CQUFlO2tDQUFWLE1BQVU7Z0JBQVYsbUNBQU0sZ0JBQUk7O0FBQy9DLGdCQUFHLEtBQUssTUFBTCxDQUFZLGdCQUFaLE1BQWtDLENBQWxDLEVBQ0MsT0FBTSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLE9BQXJCLENBQTZCLEtBQTdCLEVBQW1DLEVBQW5DLElBQXlDLEdBQXpDLEdBQStDLEtBQUssT0FBTCxDQUFhLEtBQWIsRUFBbUIsRUFBbkIsQ0FBL0MsQ0FEVjtBQUVBLGdCQUFJLGFBQVcsRUFBWCxDQUgyQztBQUkvQyxnQkFBSSxNQUFNLE1BQU4sS0FBaUIsQ0FBakIsRUFBb0I7QUFDcEIsMkNBQXlCLHNCQUFnQixRQUFRLEtBQVIsR0FBZ0IsSUFBaEIsV0FBd0IsU0FBUyxFQUFULEdBQWMsaUJBQWQsMkJBQXFELGFBQXRILENBRG9CO2FBQXhCLE1BRU07QUFDRiw4SkFHZSxzQkFBZ0IsUUFBUSxLQUFSLEdBQWdCLElBQWhCLFdBQXdCLFNBQVMsRUFBVCxHQUFjLGlCQUFkLHNDQUErRCx3RkFFM0csTUFBTSxNQUFOLENBQWMsVUFBQyxDQUFELEVBQUcsQ0FBSDsyQkFBUSxJQUFHLE1BQUssV0FBTCxDQUFpQixDQUFqQixDQUFIO2lCQUFSLEVBQWlDLEVBQS9DLGtEQUxYLENBREU7YUFGTjtBQVlBLG1CQUFPLFVBQVAsQ0FoQitDOzs7O3VDQWtCckM7QUFDVixnQkFBSSxZQUFVLEVBQVYsQ0FETTtBQUVWLGlCQUFLLElBQUksQ0FBSixJQUFTLEtBQUssS0FBTCxFQUFZO0FBQ3RCLDZCQUFhLEtBQUssV0FBTCxDQUFpQixLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQWpCLENBQWIsQ0FEc0I7YUFBMUI7QUFHQSxpQkFBSyxNQUFMLENBQVksYUFBWixDQUEwQixjQUExQixFQUEwQyxTQUExQyxHQUFzRCxTQUF0RCxDQUxVO0FBTVYsbUJBQU8sSUFBUCxDQU5VOzs7O2lDQVFMLFNBQVE7QUFDYixpQkFBSyxLQUFMLEdBQVcsRUFBWCxDQURhO0FBRWIsZ0JBQUksYUFBYSxTQUFTLGdCQUFULENBQTBCLE9BQTFCLENBQWIsQ0FGUztBQUdiLGlCQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxXQUFXLE1BQVgsRUFBbUIsR0FBdkMsRUFBNEM7QUFDeEMsd0JBQVEsR0FBUixDQUFZLFdBQVcsQ0FBWCxDQUFaLEVBRHdDO0FBRXhDLHFCQUFLLE9BQUwsQ0FBYTtBQUNULDJCQUFPLFdBQVcsQ0FBWCxFQUFjLFlBQWQsQ0FBMkIsT0FBM0IsQ0FBUDtBQUNBLDBCQUFLLFdBQVcsQ0FBWCxFQUFjLFNBQWQsQ0FBd0IsT0FBeEIsQ0FBZ0MsVUFBaEMsRUFBMkMsRUFBM0MsQ0FBTDtBQUNBLDBCQUFNLFdBQVcsQ0FBWCxFQUFjLFlBQWQsQ0FBMkIsTUFBM0IsQ0FBTjtBQUNBLDRCQUFRLFdBQVcsQ0FBWCxFQUFjLFlBQWQsQ0FBMkIsS0FBM0IsTUFBc0MsVUFBdEMsR0FBa0QsS0FBbEQsR0FBeUQsSUFBekQ7aUJBSlosRUFLRSxLQUxGLEVBRndDO2FBQTVDO0FBU0EsaUJBQUssWUFBTCxHQVphO0FBYWIsbUJBQU8sSUFBUCxDQWJhOzs7O21DQWVOLFNBQVE7QUFDZixpQkFBSyxNQUFMLENBQVksYUFBWixDQUEwQixjQUExQixFQUEwQyxTQUExQyxHQUFzRCxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsRUFBZ0MsU0FBaEMsQ0FEdkM7QUFFZixtQkFBTyxJQUFQLENBRmU7Ozs7dUNBS3lDO2dCQUFuRCxvQkFBbUQ7Z0JBQTdDLGtCQUE2QztnQkFBeEMsa0JBQXdDO3FDQUFuQyxPQUFtQztnQkFBbkMsc0NBQU8sb0JBQTRCO29DQUF2QixNQUF1QjtnQkFBdkIsb0NBQU0saUJBQWlCO2dCQUFiLGdFQUFRLG9CQUFLOztBQUN4RCxnQkFBRyxVQUFVLE1BQVYsS0FBb0IsQ0FBcEIsRUFBdUIsT0FBTyxLQUFQLENBQTFCO0FBQ0EsZ0JBQUksT0FBTyxVQUFVLENBQVYsQ0FBUCxLQUF3QixRQUF4QixFQUFpQztBQUNqQyx3QkFBTSxVQUFVLENBQVYsQ0FBTixDQURpQztBQUVqQyx1QkFBSyxVQUFVLENBQVYsQ0FBTCxDQUZpQztBQUdqQyx1QkFBSyxVQUFVLENBQVYsRUFBYSxXQUFiLEdBQTJCLE9BQTNCLENBQW1DLFdBQW5DLEVBQStDLEVBQS9DLENBQUwsQ0FIaUM7YUFBckM7QUFLQSxnQkFBSSxVQUFTO0FBQ1QsdUJBQU0sS0FBTjtBQUNBLHNCQUFLLElBQUw7QUFDQSxzQkFBSyxJQUFMO0FBQ0Esd0JBQU8sTUFBUDtBQUNBLHVCQUFNLEtBQU47YUFMQSxDQVBvRDtBQWN4RCxpQkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixPQUFoQixFQWR3RDtBQWV4RCxnQkFBSSxPQUFKLEVBQWEsS0FBSyxZQUFMLEdBQWI7QUFDQSxtQkFBTyxJQUFQLENBaEJ3RDs7OztBQWtCNUQsYUFqRUUsVUFpRUYsR0FBYTs4QkFqRVgsWUFpRVc7O0FBQ1QsYUFBSyxZQUFMLEdBQWtCLElBQWxCLENBRFM7QUFFVCxhQUFLLEtBQUwsR0FBVyxFQUFYO0FBRlMsWUFHVCxDQUFLLE9BQUwsR0FBYTtBQUNULHFCQUFRLEVBQVI7QUFDQSxzQkFBUyxNQUFUO0FBQ0EseUJBQVksSUFBWjtBQUNBLG9DQUF1QixJQUF2QjtBQUNBLDJCQUFjLEtBQWQ7QUFDQSxvQkFBTyxJQUFQO0FBQ0EscUJBQVEsSUFBUjtBQUNBLHNCQUFTLFNBQVQ7QUFDQSx3QkFBVyxTQUFYO0FBVFMsU0FBYixDQUhTO0FBY1QsYUFBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksVUFBVSxNQUFWLEVBQWtCLEdBQXRDLEVBQTJDO0FBQ3ZDLGdCQUFJLFdBQVcsVUFBVSxDQUFWLENBQVgsQ0FEbUM7QUFFdkMsZ0JBQUksT0FBUSxRQUFSLEtBQW9CLFFBQXBCLEVBQThCO0FBQzlCLHFCQUFLLFlBQUwsR0FBb0IsUUFBcEIsQ0FEOEI7YUFBbEMsTUFFTSxJQUFJLE9BQU8sU0FBUCxDQUFpQixRQUFqQixDQUEwQixJQUExQixDQUFnQyxRQUFoQyxLQUE4QyxnQkFBOUMsRUFBZ0U7QUFDdEUscUJBQUssSUFBSSxLQUFLLENBQUwsRUFBUSxLQUFLLFNBQVMsTUFBVCxFQUFpQixJQUF2QyxFQUE2QztBQUN6Qyx5QkFBSyxPQUFMLENBQWEsU0FBUyxFQUFULENBQWIsRUFBMEIsS0FBMUIsRUFEeUM7aUJBQTdDO2FBREUsTUFJQSxJQUFJLFFBQU8sMkRBQVAsS0FBb0IsUUFBcEIsRUFBOEI7QUFDcEMscUJBQUssSUFBSSxRQUFKLElBQWdCLFFBQXJCLEVBQStCO0FBQzNCLHlCQUFLLE9BQUwsQ0FBYSxRQUFiLElBQXlCLFNBQVMsUUFBVCxDQUF6QixDQUQyQjtpQkFBL0I7YUFERSxNQUlBLElBQUksT0FBTyxRQUFQLEtBQW9CLFVBQXBCLEVBQWdDO0FBQ3RDLHFCQUFLLE9BQUwsQ0FBYSxNQUFiLEdBQXNCLFFBQXRCLENBRHNDO2FBQXBDO1NBWlY7O0FBa0JBLFlBQUksU0FBUyxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBVCxDQWhDSztBQWlDVCxhQUFLLE1BQUwsR0FBYSxNQUFiLENBakNTO0FBa0NULGVBQU8sU0FBUCxtQkFBZ0MsS0FBSyxPQUFMLENBQWEsUUFBYixDQWxDdkI7QUFtQ1QsZUFBTyxTQUFQLDRFQUdVLEtBQUssT0FBTCxDQUFhLFdBQWIsR0FBMkIsK0JBQTNCLEdBQTZELEVBQTdELHlIQUhWLENBbkNTO0FBMkNULGFBQUssWUFBTCxHQTNDUztBQTRDVCxpQkFBUyxJQUFULENBQWMsV0FBZCxDQUEwQixNQUExQixFQTVDUztBQTZDVCxZQUFJLEtBQUssWUFBTCxFQUFtQjtBQUNuQixpQ0FBbUIsS0FBSyxZQUFMLFVBQW5CLEVBRG1CO1NBQXZCO0FBR0EsWUFBSSxLQUFLLE9BQUwsQ0FBYSxXQUFiLEVBQTBCO0FBQzFCLG1CQUFPLGFBQVAsQ0FBcUIsWUFBckIsRUFBbUMsZ0JBQW5DLENBQW9ELE9BQXBELEVBQTRELEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBNUQsRUFEMEI7U0FBOUI7QUFHQSxlQUFPLGdCQUFQLENBQXdCLE9BQXhCLEVBQWdDLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBaEMsRUFuRFM7O0FBcURULFlBQUksS0FBSyxPQUFMLENBQWEsUUFBYixFQUF1QjtBQUN2QixpQkFBSyxRQUFMLENBQWMsS0FBSyxPQUFMLENBQWEsUUFBYixDQUFkLENBRHVCO1NBQTNCO0FBR0EsWUFBSSxLQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQXlCO0FBQ3pCLGlCQUFLLFVBQUwsQ0FBZ0IsS0FBSyxPQUFMLENBQWEsVUFBYixDQUFoQixDQUR5QjtTQUE3Qjs7QUFNQSxlQUFPLElBQVAsQ0E5RFM7S0FBYjs7aUJBakVFOztpQ0FrSU8sR0FBRTtBQUNQLGdCQUFJLEVBQUUsTUFBRixLQUFhLEtBQUssTUFBTCxJQUFlLEtBQUssT0FBTCxDQUFhLHNCQUFiLEVBQXFDO0FBQ2pFLHFCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLEVBRGlFO2FBQXJFO0FBR0EsZ0JBQUksVUFBUyxNQUFNLEVBQUUsTUFBRixDQUFTLFNBQVQsR0FBcUIsR0FBM0IsQ0FKTjtBQUtQLGdCQUFJLFFBQVEsT0FBUixDQUFnQix1QkFBaEIsSUFBMkMsQ0FBQyxDQUFELEVBQUk7QUFDL0Msb0JBQUksU0FBUyxFQUFFLE1BQUYsQ0FBUyxVQUFULENBRGtDO0FBRS9DLG9CQUFLLENBQUUsTUFBTSxPQUFPLFNBQVAsR0FBbUIsR0FBekIsQ0FBRixDQUFnQyxPQUFoQyxDQUF3QyxzQkFBeEMsSUFBa0UsQ0FBQyxDQUFELEVBQUs7QUFDeEUsMkJBQU8sU0FBUCxHQUFtQixPQUFPLFNBQVAsQ0FBaUIsT0FBakIsQ0FBeUIseUJBQXpCLEVBQW1ELEVBQW5ELENBQW5CLENBRHdFO2lCQUE1RSxNQUVNO0FBQ0YsMkJBQU8sU0FBUCxJQUFvQixxQkFBcEIsQ0FERTtpQkFGTjthQUZKOzs7OytCQVNFO0FBQ0YsZ0JBQUksQ0FBQyxNQUFNLEtBQUssTUFBTCxDQUFZLFNBQVosR0FBd0IsR0FBOUIsQ0FBRCxDQUFvQyxPQUFwQyxDQUE0QyxjQUE1QyxJQUE4RCxDQUFDLENBQUQsRUFDbEUsS0FBSyxNQUFMLENBQVksU0FBWixHQUF3QixLQUFLLE1BQUwsQ0FBWSxTQUFaLENBQXNCLE9BQXRCLENBQThCLFlBQTlCLEVBQTJDLFdBQTNDLENBQXhCLENBREEsS0FHSSxLQUFLLE1BQUwsQ0FBWSxTQUFaLElBQXlCLFlBQXpCLENBSEo7QUFJQSxnQkFBSSxLQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCO0FBQ3JCLHFCQUFLLE9BQUwsQ0FBYSxNQUFiLENBQW9CLElBQXBCLENBQXlCLElBQXpCLEVBRHFCO2FBQXpCO0FBR0EsbUJBQU8sSUFBUCxDQVJFOzs7O2dDQVVDO0FBQ0gsaUJBQUssTUFBTCxDQUFZLFNBQVosR0FBd0IsS0FBSyxNQUFMLENBQVksU0FBWixDQUFzQixPQUF0QixDQUE4QixXQUE5QixFQUEwQyxZQUExQyxDQUF4QixDQURHO0FBRUgsZ0JBQUksS0FBSyxPQUFMLENBQWEsT0FBYixFQUFzQjtBQUN0QixxQkFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixJQUFyQixDQUEwQixJQUExQixFQURzQjthQUExQjtBQUdBLG1CQUFPLElBQVAsQ0FMRzs7OztpQ0FPQztBQUNKLGdCQUFJLENBQUMsTUFBTSxLQUFLLE1BQUwsQ0FBWSxTQUFaLEdBQXdCLEdBQTlCLENBQUQsQ0FBb0MsT0FBcEMsQ0FBNEMsYUFBNUMsSUFBNkQsQ0FBQyxDQUFELEVBQzdELEtBQUssS0FBTCxHQURKLEtBR0ksS0FBSyxJQUFMLEdBSEo7QUFJQSxtQkFBTyxJQUFQLENBTEk7Ozs7V0FqS047OztBQXlNTixJQUFJLFdBQVc7QUFDWCxZQUFPLElBQVA7QUFDQSxrQkFBYSxzQkFBUyxTQUFULEVBQW1CO0FBQzVCLFlBQUcsU0FBSCxFQUFjLEtBQUssTUFBTCxHQUFhLEVBQUUsU0FBRixDQUFiLENBQWQ7QUFDQSxZQUFHLENBQUMsS0FBSyxNQUFMLENBQVksRUFBWixDQUFlLFVBQWYsQ0FBRCxFQUE2QixLQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsQ0FBWSxPQUFaLENBQW9CLFVBQXBCLENBQWQsQ0FBaEM7S0FGUyxFQUdYLE1BQUssY0FBUyxTQUFULEVBQW1CO0FBQ3RCLGFBQUssWUFBTCxDQUFrQixTQUFsQixFQURzQjtBQUV0QixZQUFHLEtBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxnQkFBZixDQUFILEVBQXFDO0FBQ2pDLHFCQUFTLEdBQVQsQ0FBYSxLQUFLLE1BQUwsRUFBWSxFQUFDLFNBQVEsT0FBUixFQUExQixFQURpQztBQUVqQyxxQkFBUyxJQUFULENBQWMsS0FBSyxNQUFMLEVBQVksSUFBMUIsRUFBK0IsRUFBQyxTQUFRLENBQVIsRUFBaEMsRUFGaUM7QUFHakMscUJBQVMsV0FBVCxDQUFxQixLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLGVBQWpCLENBQXJCLEVBQXVELElBQXZELEVBQTRELEVBQUMsVUFBUyxDQUFDLEVBQUQsRUFBSSxTQUFRLENBQVIsRUFBVSxPQUFNLElBQU4sRUFBcEYsRUFBZ0csSUFBaEcsRUFIaUM7U0FBckMsTUFJTSxJQUFHLEtBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxnQkFBZixDQUFILEVBQXFDO0FBQ3ZDLHFCQUFTLEdBQVQsQ0FBYSxLQUFLLE1BQUwsRUFBWSxFQUFDLFNBQVEsT0FBUixFQUExQixFQUR1QztBQUV2QyxxQkFBUyxJQUFULENBQWMsS0FBSyxNQUFMLEVBQVksSUFBMUIsRUFBK0IsRUFBQyxTQUFRLENBQVIsRUFBaEMsRUFGdUM7QUFHdkMscUJBQVMsSUFBVCxDQUFjLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsb0JBQWpCLENBQWQsRUFBcUQsSUFBckQsRUFBMEQsRUFBQyxVQUFTLENBQUMsR0FBRCxFQUFLLFNBQVEsQ0FBUixFQUFVLE9BQU0sR0FBTixFQUFuRixFQUh1QztBQUl2QyxxQkFBUyxJQUFULENBQWMsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixlQUFqQixDQUFkLEVBQWdELElBQWhELEVBQXFELEVBQUMsVUFBUyxDQUFDLEVBQUQsRUFBSSxTQUFRLEdBQVIsRUFBWSxPQUFNLEtBQU4sRUFBL0UsRUFKdUM7U0FBckMsTUFLQSxJQUFHLEtBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxpQkFBZixDQUFILEVBQXNDO0FBQ3hDLHFCQUFTLEdBQVQsQ0FBYSxLQUFLLE1BQUwsRUFBWSxFQUFDLFNBQVEsT0FBUixFQUExQixFQUR3QztBQUV4QyxxQkFBUyxJQUFULENBQWMsS0FBSyxNQUFMLEVBQVksSUFBMUIsRUFBK0IsRUFBQyxTQUFRLENBQVIsRUFBaEMsRUFGd0M7QUFHeEMscUJBQVMsSUFBVCxDQUFjLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsb0JBQWpCLENBQWQsRUFBcUQsSUFBckQsRUFBMEQsRUFBQyxVQUFTLEdBQVQsRUFBYSxTQUFRLENBQVIsRUFBVSxPQUFNLEdBQU4sRUFBbEYsRUFId0M7QUFJeEMscUJBQVMsSUFBVCxDQUFjLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsZUFBakIsQ0FBZCxFQUFnRCxJQUFoRCxFQUFxRCxFQUFDLFVBQVMsQ0FBQyxFQUFELEVBQUksU0FBUSxHQUFSLEVBQVksT0FBTSxLQUFOLEVBQS9FLEVBSndDO1NBQXRDLE1BS0EsSUFBRyxLQUFLLE1BQUwsQ0FBWSxFQUFaLENBQWUsZUFBZixDQUFILEVBQW9DO0FBQ3RDLGlCQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFNBQWhCLEVBQTBCLE9BQTFCLEVBRHNDO0FBRXRDLHFCQUFTLEVBQVQsQ0FBWSxLQUFLLE1BQUwsRUFBWSxHQUF4QixFQUE0QixFQUFDLFNBQVEsQ0FBUixFQUE3QixFQUZzQztBQUd0QyxxQkFBUyxJQUFULENBQWMsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixvQkFBakIsQ0FBZCxFQUFxRCxHQUFyRCxFQUF5RCxFQUFDLFNBQVEsS0FBUixFQUFlLFVBQVMsQ0FBQyxHQUFELEVBQU0sT0FBTyxHQUFQLEVBQXhGLEVBSHNDO0FBSXRDLHFCQUFTLFdBQVQsQ0FBcUIsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixlQUFqQixDQUFyQixFQUF1RCxJQUF2RCxFQUE0RCxFQUFDLFNBQVEsR0FBUixFQUFhLEdBQUUsQ0FBQyxFQUFELEVBQUssT0FBTSxHQUFOLEVBQWpGLEVBQTRGLElBQTVGLEVBSnNDO1NBQXBDLE1BS0EsSUFBRyxLQUFLLE1BQUwsQ0FBWSxFQUFaLENBQWUsa0JBQWYsQ0FBSCxFQUF1QztBQUN6QyxpQkFBSyxNQUFMLENBQVksR0FBWixDQUFnQixTQUFoQixFQUEwQixPQUExQixFQUR5QztBQUV6QyxxQkFBUyxFQUFULENBQVksS0FBSyxNQUFMLEVBQVksR0FBeEIsRUFBNEIsRUFBQyxTQUFRLENBQVIsRUFBN0IsRUFGeUM7QUFHekMscUJBQVMsSUFBVCxDQUFjLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsb0JBQWpCLENBQWQsRUFBcUQsR0FBckQsRUFBeUQsRUFBQyxTQUFRLEtBQVIsRUFBZSxVQUFTLEdBQVQsRUFBYyxPQUFPLEdBQVAsRUFBdkYsRUFIeUM7QUFJekMscUJBQVMsV0FBVCxDQUFxQixLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLGVBQWpCLENBQXJCLEVBQXVELElBQXZELEVBQTRELEVBQUMsU0FBUSxHQUFSLEVBQWEsR0FBRSxDQUFDLEVBQUQsRUFBSyxPQUFNLEdBQU4sRUFBakYsRUFBNEYsSUFBNUYsRUFKeUM7U0FBdkM7S0FyQkgsRUEyQkwsT0FBTSxlQUFTLFNBQVQsRUFBbUI7QUFDdkIsYUFBSyxZQUFMLENBQWtCLFNBQWxCLEVBRHVCO0FBRXZCLFlBQUcsS0FBSyxNQUFMLENBQVksRUFBWixDQUFlLGdCQUFmLENBQUgsRUFBcUM7QUFDakMscUJBQVMsU0FBVCxDQUFtQixLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLGVBQWpCLENBQW5CLEVBQXFELElBQXJELEVBQTBELEVBQUMsVUFBUyxDQUFDLEVBQUQsRUFBSSxTQUFRLENBQVIsRUFBeEUsRUFBbUYsSUFBbkYsRUFEaUM7QUFFakMscUJBQVMsRUFBVCxDQUFZLEtBQUssTUFBTCxFQUFZLElBQXhCLEVBQTZCLEVBQUMsU0FBUSxDQUFSLEVBQVUsT0FBTSxHQUFOO0FBQ3BDLDRCQUFXLHNCQUFVO0FBQ2pCLDZCQUFTLEdBQVQsQ0FBYSxLQUFLLE1BQUwsRUFBWSxFQUFDLFNBQVEsTUFBUixFQUFlLFNBQVEsQ0FBUixFQUF6QyxFQURpQjtBQUVqQiw2QkFBUyxHQUFULENBQWEsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixvQkFBakIsQ0FBYixFQUFvRCxFQUFDLFVBQVMsQ0FBVCxFQUFXLFNBQVEsQ0FBUixFQUFoRSxFQUZpQjtBQUdqQiw2QkFBUyxHQUFULENBQWEsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixlQUFqQixDQUFiLEVBQStDLEVBQUMsVUFBUyxDQUFULEVBQVcsU0FBUSxDQUFSLEVBQTNELEVBSGlCO2lCQUFWO2FBRGYsRUFGaUM7U0FBckMsTUFVTSxJQUFHLEtBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxnQkFBZixDQUFILEVBQXFDO0FBQ3ZDLHFCQUFTLEVBQVQsQ0FBWSxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLGVBQWpCLENBQVosRUFBOEMsSUFBOUMsRUFBbUQsRUFBQyxVQUFTLENBQUMsRUFBRCxFQUFJLFNBQVEsR0FBUixFQUFqRSxFQUR1QztBQUV2QyxxQkFBUyxFQUFULENBQVksS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixvQkFBakIsQ0FBWixFQUFtRCxJQUFuRCxFQUF3RCxFQUFDLFVBQVMsQ0FBQyxHQUFELEVBQUssU0FBUSxDQUFSLEVBQVUsT0FBTSxHQUFOLEVBQWpGLEVBRnVDO0FBR3ZDLHFCQUFTLEVBQVQsQ0FBWSxLQUFLLE1BQUwsRUFBWSxJQUF4QixFQUE2QjtBQUN6Qix5QkFBUSxDQUFSO0FBQ0EsdUJBQU0sS0FBTjtBQUNBLDRCQUFXLHNCQUFVO0FBQ2pCLDZCQUFTLEdBQVQsQ0FBYSxLQUFLLE1BQUwsRUFBWSxFQUFDLFNBQVEsTUFBUixFQUFlLFNBQVEsQ0FBUixFQUF6QyxFQURpQjtBQUVqQiw2QkFBUyxHQUFULENBQWEsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixvQkFBakIsQ0FBYixFQUFvRCxFQUFDLFVBQVMsQ0FBVCxFQUFXLFNBQVEsQ0FBUixFQUFoRSxFQUZpQjtBQUdqQiw2QkFBUyxHQUFULENBQWEsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixlQUFqQixDQUFiLEVBQStDLEVBQUMsVUFBUyxDQUFULEVBQVcsU0FBUSxDQUFSLEVBQTNELEVBSGlCO2lCQUFWO2FBSGYsRUFIdUM7U0FBckMsTUFZQSxJQUFHLEtBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxpQkFBZixDQUFILEVBQXNDO0FBQ3hDLHFCQUFTLEVBQVQsQ0FBWSxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLGVBQWpCLENBQVosRUFBOEMsSUFBOUMsRUFBbUQsRUFBQyxVQUFTLENBQUMsRUFBRCxFQUFJLFNBQVEsR0FBUixFQUFqRSxFQUR3QztBQUV4QyxxQkFBUyxFQUFULENBQVksS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixvQkFBakIsQ0FBWixFQUFtRCxJQUFuRCxFQUF3RCxFQUFDLFVBQVMsR0FBVCxFQUFhLFNBQVEsQ0FBUixFQUFVLE9BQU0sR0FBTixFQUFoRixFQUZ3QztBQUd4QyxxQkFBUyxFQUFULENBQVksS0FBSyxNQUFMLEVBQVksSUFBeEIsRUFBNkI7QUFDekIseUJBQVEsQ0FBUjtBQUNBLHVCQUFNLEtBQU47QUFDQSw0QkFBVyxzQkFBVTtBQUNqQiw2QkFBUyxHQUFULENBQWEsS0FBSyxNQUFMLEVBQVksRUFBQyxTQUFRLE1BQVIsRUFBZSxTQUFRLENBQVIsRUFBekMsRUFEaUI7QUFFakIsNkJBQVMsR0FBVCxDQUFhLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsb0JBQWpCLENBQWIsRUFBb0QsRUFBQyxVQUFTLENBQVQsRUFBVyxTQUFRLENBQVIsRUFBaEUsRUFGaUI7QUFHakIsNkJBQVMsR0FBVCxDQUFhLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsZUFBakIsQ0FBYixFQUErQyxFQUFDLFVBQVMsQ0FBVCxFQUFXLFNBQVEsQ0FBUixFQUEzRCxFQUhpQjtpQkFBVjthQUhmLEVBSHdDO1NBQXRDLE1BWUEsSUFBRyxLQUFLLE1BQUwsQ0FBWSxFQUFaLENBQWUsZUFBZixDQUFILEVBQW9DO0FBQ3RDLHFCQUFTLFNBQVQsQ0FBbUIsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixlQUFqQixDQUFuQixFQUFxRCxJQUFyRCxFQUEwRCxFQUFDLFNBQVEsR0FBUixFQUFhLEdBQUUsQ0FBQyxFQUFELEVBQUssT0FBTSxHQUFOLEVBQS9FLEVBQTBGLElBQTFGLEVBRHNDO0FBRXRDLHFCQUFTLEVBQVQsQ0FBWSxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLG9CQUFqQixDQUFaLEVBQW1ELEdBQW5ELEVBQXVELEVBQUMsU0FBUSxLQUFSLEVBQWUsVUFBUyxDQUFDLEdBQUQsRUFBTSxPQUFPLEdBQVAsRUFBdEYsRUFGc0M7QUFHdEMscUJBQVMsRUFBVCxDQUFZLEtBQUssTUFBTCxFQUFZLEdBQXhCLEVBQTRCLEVBQUMsU0FBUSxDQUFSLEVBQVUsT0FBTSxHQUFOLEVBQVUsWUFBVyxzQkFBVTtBQUM5RCw2QkFBUyxHQUFULENBQWEsS0FBSyxNQUFMLEVBQVksRUFBQyxTQUFRLE1BQVIsRUFBZSxTQUFRLENBQVIsRUFBekMsRUFEOEQ7QUFFOUQsNkJBQVMsR0FBVCxDQUFhLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsb0JBQWpCLENBQWIsRUFBb0QsRUFBQyxVQUFTLENBQVQsRUFBVyxTQUFRLENBQVIsRUFBaEUsRUFGOEQ7QUFHOUQsNkJBQVMsR0FBVCxDQUFhLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsZUFBakIsQ0FBYixFQUErQyxFQUFDLEdBQUUsQ0FBRixFQUFJLFNBQVEsQ0FBUixFQUFVLE9BQU0sQ0FBTixFQUE5RCxFQUg4RDtpQkFBVixFQUE1RCxFQUhzQztTQUFwQyxNQVFBLElBQUcsS0FBSyxNQUFMLENBQVksRUFBWixDQUFlLGtCQUFmLENBQUgsRUFBdUM7QUFDekMscUJBQVMsU0FBVCxDQUFtQixLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLGVBQWpCLENBQW5CLEVBQXFELElBQXJELEVBQTBELEVBQUMsU0FBUSxHQUFSLEVBQWEsR0FBRSxFQUFGLEVBQU0sT0FBTSxHQUFOLEVBQTlFLEVBQXlGLElBQXpGLEVBRHlDO0FBRXpDLHFCQUFTLEVBQVQsQ0FBWSxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLG9CQUFqQixDQUFaLEVBQW1ELEdBQW5ELEVBQXVELEVBQUMsU0FBUSxLQUFSLEVBQWUsVUFBUyxHQUFULEVBQWMsT0FBTyxHQUFQLEVBQXJGLEVBRnlDO0FBR3pDLHFCQUFTLEVBQVQsQ0FBWSxLQUFLLE1BQUwsRUFBWSxHQUF4QixFQUE0QixFQUFDLFNBQVEsQ0FBUixFQUFVLE9BQU0sR0FBTixFQUFVLFlBQVcsc0JBQVU7QUFDOUQsNkJBQVMsR0FBVCxDQUFhLEtBQUssTUFBTCxFQUFZLEVBQUMsU0FBUSxNQUFSLEVBQWUsU0FBUSxDQUFSLEVBQXpDLEVBRDhEO0FBRTlELDZCQUFTLEdBQVQsQ0FBYSxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLG9CQUFqQixDQUFiLEVBQW9ELEVBQUMsVUFBUyxDQUFULEVBQVcsU0FBUSxDQUFSLEVBQWhFLEVBRjhEO0FBRzlELDZCQUFTLEdBQVQsQ0FBYSxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLGVBQWpCLENBQWIsRUFBK0MsRUFBQyxHQUFFLENBQUYsRUFBSSxTQUFRLENBQVIsRUFBVSxPQUFNLENBQU4sRUFBOUQsRUFIOEQ7aUJBQVYsRUFBNUQsRUFIeUM7U0FBdkM7S0E1Q0YsRUFzRE4sTUFBSyxnQkFBVTtBQUNiLFVBQUUsVUFBRixFQUFjLEtBQWQsQ0FBb0IsVUFBUyxDQUFULEVBQVc7QUFDM0IsZ0JBQUksU0FBUyxFQUFFLEVBQUUsTUFBRixDQUFYLENBRHVCO0FBRTNCLGdCQUFJLE9BQU8sRUFBUCxDQUFVLDBCQUFWLENBQUosRUFBMkM7QUFDdkMsd0JBQVEsS0FBUixDQUFjLElBQWQsRUFEdUM7YUFBM0M7U0FGZ0IsQ0FBcEIsQ0FEYTtLQUFWO0NBdEZQIiwiZmlsZSI6Im1rZ1NpZGVCYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBta2dTaWRlQmFye1xyXG4gICAgX2l0ZW1Ub0hUTUwoe3RpdGxlLHRleHQsbGluayxmb2xsb3c9dHJ1ZSxpdGVtcz1bXX0pe1xyXG4gICAgICAgIGlmKGxpbmsuc2VhcmNoKC9eKGh0dHBzP3xmdHApOi8pICE9PSAwKVxyXG4gICAgICAgICAgICBsaW5rPSB0aGlzLm9wdGlvbnMuYmFzZVVSTC5yZXBsYWNlKC9cXC8kLywnJykgKyAnLycgKyBsaW5rLnJlcGxhY2UoL15cXC8vLCcnKTtcclxuICAgICAgICBsZXQgcmVzdWx0SFRNTD0nJztcclxuICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdEhUTUwgPSBgPGEgaHJlZj1cIiR7bGlua31cIiB0aXRsZT1cIiR7dGl0bGUgPyB0aXRsZSA6IHRleHR9XCIke2ZvbGxvdyA/ICcnIDogJyByZWw9XCJub2ZvbGxvd1wiJyB9IGNsYXNzPVwibXNiLWl0ZW1cIj4ke3RleHR9PC9hPmA7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHRIVE1MPSBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtc2ItY29sbGFwc2VcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtc2ItY29sbGFwc2UtYnV0dG9uXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiJHtsaW5rfVwiIHRpdGxlPVwiJHt0aXRsZSA/IHRpdGxlIDogdGV4dH1cIiR7Zm9sbG93ID8gJycgOiAnIHJlbD1cIm5vZm9sbG93XCInfSBjbGFzcz1cIm1zYi1jb2xsYXBzZS1oZWFkZXJcIj4ke3RleHR9PC9hPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1zYi1jb2xsYXBzZS1pdGVtc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICR7IGl0ZW1zLnJlZHVjZSggKGEsYik9PiBhKyB0aGlzLl9pdGVtVG9IVE1MKGIpICwgJycpIH1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5gO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0SFRNTDtcclxuICAgIH1cclxuICAgIHJlZnJlc2hJdGVtcygpe1xyXG4gICAgICAgIGxldCBpdGVtc0hUTUw9Jyc7XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiB0aGlzLml0ZW1zKSB7XHJcbiAgICAgICAgICAgIGl0ZW1zSFRNTCArPSB0aGlzLl9pdGVtVG9IVE1MKHRoaXMuaXRlbXNbaV0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5tc2ItY29udGVudCcpLmlubmVySFRNTCA9IGl0ZW1zSFRNTDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNldEl0ZW1zKGNvbnRleHQpe1xyXG4gICAgICAgIHRoaXMuaXRlbXM9W107XHJcbiAgICAgICAgbGV0IGZvdW5kSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGNvbnRleHQpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZm91bmRJdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmb3VuZEl0ZW1zW2ldICAgKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRJdGVtKHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBmb3VuZEl0ZW1zW2ldLmdldEF0dHJpYnV0ZSgndGl0bGUnKSxcclxuICAgICAgICAgICAgICAgIHRleHQ6Zm91bmRJdGVtc1tpXS5pbm5lckhUTUwucmVwbGFjZSgvPFtePl0rPi9nLCcnKSxcclxuICAgICAgICAgICAgICAgIGxpbms6IGZvdW5kSXRlbXNbaV0uZ2V0QXR0cmlidXRlKCdocmVmJyksXHJcbiAgICAgICAgICAgICAgICBmb2xsb3c6IGZvdW5kSXRlbXNbaV0uZ2V0QXR0cmlidXRlKCdyZWwnKSA9PT0gJ25vZm9sbG93JyA/ZmFsc2U6IHRydWVcclxuICAgICAgICAgICAgfSxmYWxzZSlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoSXRlbXMoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNldENvbnRlbnQoY29udGV4dCl7XHJcbiAgICAgICAgdGhpcy50YXJnZXQucXVlcnlTZWxlY3RvcignLm1zYi1jb250ZW50JykuaW5uZXJIVE1MID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250ZXh0KS5pbm5lckhUTUw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkSXRlbSh7dGl0bGUsdGV4dCxsaW5rLGZvbGxvdz10cnVlLGl0ZW1zPVtdfSxyZWZyZXNoPXRydWUpe1xyXG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09MCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgICAgIHRpdGxlPWFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdGV4dD1hcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIGxpbms9YXJndW1lbnRzWzBdLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvW15hLXowLTldLywnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBuZXdJdGVtPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOnRpdGxlLFxyXG4gICAgICAgICAgICB0ZXh0OnRleHQsXHJcbiAgICAgICAgICAgIGxpbms6bGluayxcclxuICAgICAgICAgICAgZm9sbG93OmZvbGxvdyxcclxuICAgICAgICAgICAgaXRlbXM6aXRlbXNcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pdGVtcy5wdXNoKG5ld0l0ZW0pO1xyXG4gICAgICAgIGlmIChyZWZyZXNoKSB0aGlzLnJlZnJlc2hJdGVtcygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLnByb3BlcnR5TmFtZT1udWxsO1xyXG4gICAgICAgIHRoaXMuaXRlbXM9W107Ly97dGV4dDpzdHJpbmcsbGluazpzdHJpbmcsdGl0bGU6c3RyaW5nLGZvbGxvdzpib29sfVxyXG4gICAgICAgIHRoaXMub3B0aW9ucz17XHJcbiAgICAgICAgICAgIGJhc2VVUkw6JycsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOidsZWZ0JywgLy8gbGVmdCwgdG9wLCBib3R0b20sIHJpZ2h0XHJcbiAgICAgICAgICAgIGNsb3NlQnV0dG9uOnRydWUsXHJcbiAgICAgICAgICAgIGNsb3NlT25CYWNrZ3JvdW5kQ2xpY2s6dHJ1ZSxcclxuICAgICAgICAgICAgYW5pbWF0aW9uVHlwZTonY3NzJywgLy9qcXVlcnksIHR3ZWVuTWF4LCBjc3MsIG5vbmVcclxuICAgICAgICAgICAgb25PcGVuOm51bGwsXHJcbiAgICAgICAgICAgIG9uQ2xvc2U6bnVsbCxcclxuICAgICAgICAgICAgc2V0SXRlbXM6dW5kZWZpbmVkLC8vbWV0aG9kXHJcbiAgICAgICAgICAgIHNldENvbnRlbnQ6dW5kZWZpbmVkLy9tZXRob2RcclxuICAgICAgICB9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBhcmd1bWVudCA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAgYXJndW1lbnQ9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlOYW1lID0gYXJndW1lbnQ7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIGFyZ3VtZW50ICkgPT0gJ1tvYmplY3QgQXJyYXldJykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaTIgPSAwOyBpMiA8IGFyZ3VtZW50Lmxlbmd0aDsgaTIrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkSXRlbShhcmd1bWVudFtpMl0sZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZSBpZiAodHlwZW9mIGFyZ3VtZW50ID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdmFyaWFibGUgaW4gYXJndW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnNbdmFyaWFibGVdID0gYXJndW1lbnRbdmFyaWFibGVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZSBpZiAodHlwZW9mIGFyZ3VtZW50ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub25PcGVuID0gYXJndW1lbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBsZXQgbmV3QmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXNpZGUnKTtcclxuICAgICAgICB0aGlzLnRhcmdldD0gbmV3QmFyO1xyXG4gICAgICAgIG5ld0Jhci5jbGFzc05hbWUgKz1gIG1zYiBtc2ItLSR7dGhpcy5vcHRpb25zLnBvc2l0aW9ufWA7XHJcbiAgICAgICAgbmV3QmFyLmlubmVySFRNTCA9XHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJtc2ItY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+XHJcbiAgICAgICAgICAgICAgICAke3RoaXMub3B0aW9ucy5jbG9zZUJ1dHRvbiA/ICc8ZGl2IGNsYXNzPVwibXNiLWNsb3NlXCI+PC9kaXY+JyA6ICcnfVxyXG4gICAgICAgICAgICA8L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1zYi1jb250ZW50XCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PC9mb290ZXI+XHJcbiAgICAgICAgPC9kaXY+YDtcclxuICAgICAgICB0aGlzLnJlZnJlc2hJdGVtcygpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobmV3QmFyKTtcclxuICAgICAgICBpZiAodGhpcy5wcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgZXZhbChgbWtnU2lkZUJhci4ke3RoaXMucHJvcGVydHlOYW1lfT10aGlzYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2xvc2VCdXR0b24pIHtcclxuICAgICAgICAgICAgbmV3QmFyLnF1ZXJ5U2VsZWN0b3IoXCIubXNiLWNsb3NlXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyx0aGlzLmNsb3NlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuZXdCYXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLHRoaXMuX29uQ2xpY2suYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2V0SXRlbXMpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRJdGVtcyh0aGlzLm9wdGlvbnMuc2V0SXRlbXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNldENvbnRlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRDb250ZW50KHRoaXMub3B0aW9ucy5zZXRDb250ZW50KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgX29uQ2xpY2soZSl7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLnRhcmdldCAmJiB0aGlzLm9wdGlvbnMuY2xvc2VPbkJhY2tncm91bmRDbGljaykge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlLmNhbGwodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjbHNOYW1lPSAnICcgKyBlLnRhcmdldC5jbGFzc05hbWUgKyAnICc7XHJcbiAgICAgICAgaWYgKGNsc05hbWUuaW5kZXhPZihcIiBtc2ItY29sbGFwc2UtYnV0dG9uIFwiKSA+IC0xICl7XHJcbiAgICAgICAgICAgIGxldCBwYXJlbnQgPSBlLnRhcmdldC5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICBpZiAoICggJyAnICsgcGFyZW50LmNsYXNzTmFtZSArICcgJykuaW5kZXhPZignIG1zYi1jb2xsYXBzZS0tb3BlbiAnKSA+IC0xICkge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LmNsYXNzTmFtZSA9IHBhcmVudC5jbGFzc05hbWUucmVwbGFjZSgvKCB8JCltc2ItY29sbGFwc2UtLW9wZW4vLCcnKTtcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LmNsYXNzTmFtZSArPSAnIG1zYi1jb2xsYXBzZS0tb3Blbic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvcGVuKCl7XHJcbiAgICAgICAgaWYgKCgnICcgKyB0aGlzLnRhcmdldC5jbGFzc05hbWUgKyAnICcpLmluZGV4T2YoXCIgbXNiLS1jbG9zZSBcIikgPiAtMSApXHJcbiAgICAgICAgdGhpcy50YXJnZXQuY2xhc3NOYW1lID0gdGhpcy50YXJnZXQuY2xhc3NOYW1lLnJlcGxhY2UoJ21zYi0tY2xvc2UnLCdtc2ItLW9wZW4nKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LmNsYXNzTmFtZSArPSAnIG1zYi0tb3Blbic7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5vbk9wZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9uT3Blbi5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGNsb3NlKCl7XHJcbiAgICAgICAgdGhpcy50YXJnZXQuY2xhc3NOYW1lID0gdGhpcy50YXJnZXQuY2xhc3NOYW1lLnJlcGxhY2UoJ21zYi0tb3BlbicsJ21zYi0tY2xvc2UnKTtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm9uQ2xvc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9uQ2xvc2UuY2FsbCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICB0b2dnbGUoKXtcclxuICAgICAgICBpZiAoKCcgJyArIHRoaXMudGFyZ2V0LmNsYXNzTmFtZSArICcgJykuaW5kZXhPZihcIiBtc2ItLW9wZW4gXCIpID4gLTEgKVxyXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLm9wZW4oKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbnZhciBzaWRlQmFyYSA9IHtcclxuICAgIHRhcmdldDpudWxsLFxyXG4gICAgY2hhbmdlVGFyZ2V0OmZ1bmN0aW9uKHRhcmdldEJhcil7XHJcbiAgICAgICAgaWYodGFyZ2V0QmFyKSB0aGlzLnRhcmdldD0gJCh0YXJnZXRCYXIpO1xyXG4gICAgICAgIGlmKCF0aGlzLnRhcmdldC5pcygnLnNpZGVCYXInKSkgdGhpcy50YXJnZXQgPSB0aGlzLnRhcmdldC5wYXJlbnRzKCcuc2lkZUJhcicpO1xyXG4gICAgfSxvcGVuOmZ1bmN0aW9uKHRhcmdldEJhcil7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VUYXJnZXQodGFyZ2V0QmFyKTtcclxuICAgICAgICBpZih0aGlzLnRhcmdldC5pcygnLnNpZGVCYXItLWZ1bGwnKSkge1xyXG4gICAgICAgICAgICBUd2Vlbk1heC5zZXQodGhpcy50YXJnZXQse2Rpc3BsYXk6J2Jsb2NrJ30pO1xyXG4gICAgICAgICAgICBUd2Vlbk1heC5mcm9tKHRoaXMudGFyZ2V0LDAuMjQse29wYWNpdHk6MH0pO1xyXG4gICAgICAgICAgICBUd2Vlbk1heC5zdGFnZ2VyRnJvbSh0aGlzLnRhcmdldC5maW5kKCcuc2lkZUJhci1pdGVtJyksMC4zNSx7eFBlcmNlbnQ6LTIwLG9wYWNpdHk6MCxkZWxheTowLjE1fSwwLjA3KTtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLnRhcmdldC5pcygnLnNpZGVCYXItLWxlZnQnKSkge1xyXG4gICAgICAgICAgICBUd2Vlbk1heC5zZXQodGhpcy50YXJnZXQse2Rpc3BsYXk6J2Jsb2NrJ30pO1xyXG4gICAgICAgICAgICBUd2Vlbk1heC5mcm9tKHRoaXMudGFyZ2V0LDAuMjQse29wYWNpdHk6MH0pO1xyXG4gICAgICAgICAgICBUd2Vlbk1heC5mcm9tKHRoaXMudGFyZ2V0LmZpbmQoJy5zaWRlQmFyLWNvbnRhaW5lcicpLDAuMjQse3hQZXJjZW50Oi0xMDAsb3BhY2l0eTowLGRlbGF5OjAuM30pO1xyXG4gICAgICAgICAgICBUd2Vlbk1heC5mcm9tKHRoaXMudGFyZ2V0LmZpbmQoJy5zaWRlQmFyLWl0ZW0nKSwwLjM1LHt4UGVyY2VudDotMjAsb3BhY2l0eTowLjQsZGVsYXk6MC40MzB9KTtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLnRhcmdldC5pcygnLnNpZGVCYXItLXJpZ2h0JykpIHtcclxuICAgICAgICAgICAgVHdlZW5NYXguc2V0KHRoaXMudGFyZ2V0LHtkaXNwbGF5OidibG9jayd9KTtcclxuICAgICAgICAgICAgVHdlZW5NYXguZnJvbSh0aGlzLnRhcmdldCwwLjI0LHtvcGFjaXR5OjB9KTtcclxuICAgICAgICAgICAgVHdlZW5NYXguZnJvbSh0aGlzLnRhcmdldC5maW5kKCcuc2lkZUJhci1jb250YWluZXInKSwwLjI0LHt4UGVyY2VudDoxMDAsb3BhY2l0eTowLGRlbGF5OjAuM30pO1xyXG4gICAgICAgICAgICBUd2Vlbk1heC5mcm9tKHRoaXMudGFyZ2V0LmZpbmQoJy5zaWRlQmFyLWl0ZW0nKSwwLjM1LHt4UGVyY2VudDotMjAsb3BhY2l0eTowLjQsZGVsYXk6MC40MzB9KTtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLnRhcmdldC5pcygnLnNpZGVCYXItLXRvcCcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LmNzcygnZGlzcGxheScsJ2Jsb2NrJyk7XHJcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvKHRoaXMudGFyZ2V0LDAuMix7b3BhY2l0eToxfSk7XHJcbiAgICAgICAgICAgIFR3ZWVuTWF4LmZyb20odGhpcy50YXJnZXQuZmluZCgnLnNpZGVCYXItY29udGFpbmVyJyksMC40LHtvcGFjaXR5OicwLjQnLCB5UGVyY2VudDotMTAwLCBkZWxheTogMC4yfSk7XHJcbiAgICAgICAgICAgIFR3ZWVuTWF4LnN0YWdnZXJGcm9tKHRoaXMudGFyZ2V0LmZpbmQoJy5zaWRlQmFyLWl0ZW0nKSwwLjU1LHtvcGFjaXR5OicwJywgeTotNTUsIHNjYWxlOjAuM30sMC4wOCk7XHJcbiAgICAgICAgfWVsc2UgaWYodGhpcy50YXJnZXQuaXMoJy5zaWRlQmFyLS1ib3R0b20nKSkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldC5jc3MoJ2Rpc3BsYXknLCdibG9jaycpO1xyXG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLnRhcmdldCwwLjIse29wYWNpdHk6MX0pO1xyXG4gICAgICAgICAgICBUd2Vlbk1heC5mcm9tKHRoaXMudGFyZ2V0LmZpbmQoJy5zaWRlQmFyLWNvbnRhaW5lcicpLDAuNCx7b3BhY2l0eTonMC40JywgeVBlcmNlbnQ6MTAwLCBkZWxheTogMC4yfSk7XHJcbiAgICAgICAgICAgIFR3ZWVuTWF4LnN0YWdnZXJGcm9tKHRoaXMudGFyZ2V0LmZpbmQoJy5zaWRlQmFyLWl0ZW0nKSwwLjU1LHtvcGFjaXR5OicwJywgeTotNTUsIHNjYWxlOjAuM30sMC4wOCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxjbG9zZTpmdW5jdGlvbih0YXJnZXRCYXIpe1xyXG4gICAgICAgIHRoaXMuY2hhbmdlVGFyZ2V0KHRhcmdldEJhcik7XHJcbiAgICAgICAgaWYodGhpcy50YXJnZXQuaXMoJy5zaWRlQmFyLS1mdWxsJykpIHtcclxuICAgICAgICAgICAgVHdlZW5NYXguc3RhZ2dlclRvKHRoaXMudGFyZ2V0LmZpbmQoJy5zaWRlQmFyLWl0ZW0nKSwwLjM1LHt4UGVyY2VudDotMjAsb3BhY2l0eTowfSwwLjA3KTtcclxuICAgICAgICAgICAgVHdlZW5NYXgudG8odGhpcy50YXJnZXQsMC4yNCx7b3BhY2l0eTowLGRlbGF5OjAuNixcclxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBUd2Vlbk1heC5zZXQodGhpcy50YXJnZXQse2Rpc3BsYXk6J25vbmUnLG9wYWNpdHk6MX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTWF4LnNldCh0aGlzLnRhcmdldC5maW5kKCcuc2lkZUJhci1jb250YWluZXInKSx7eFBlcmNlbnQ6MCxvcGFjaXR5OjF9KTtcclxuICAgICAgICAgICAgICAgICAgICBUd2Vlbk1heC5zZXQodGhpcy50YXJnZXQuZmluZCgnLnNpZGVCYXItaXRlbScpLHt4UGVyY2VudDowLG9wYWNpdHk6MX0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfWVsc2UgaWYodGhpcy50YXJnZXQuaXMoJy5zaWRlQmFyLS1sZWZ0JykpIHtcclxuICAgICAgICAgICAgVHdlZW5NYXgudG8odGhpcy50YXJnZXQuZmluZCgnLnNpZGVCYXItaXRlbScpLDAuMjUse3hQZXJjZW50Oi0yMCxvcGFjaXR5OjAuNH0pO1xyXG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLnRhcmdldC5maW5kKCcuc2lkZUJhci1jb250YWluZXInKSwwLjI1LHt4UGVyY2VudDotMTAwLG9wYWNpdHk6MCxkZWxheTowLjF9KTtcclxuICAgICAgICAgICAgVHdlZW5NYXgudG8odGhpcy50YXJnZXQsMC4yNCx7XHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OjAsXHJcbiAgICAgICAgICAgICAgICBkZWxheTowLjQzMCxcclxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBUd2Vlbk1heC5zZXQodGhpcy50YXJnZXQse2Rpc3BsYXk6J25vbmUnLG9wYWNpdHk6MX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTWF4LnNldCh0aGlzLnRhcmdldC5maW5kKCcuc2lkZUJhci1jb250YWluZXInKSx7eFBlcmNlbnQ6MCxvcGFjaXR5OjF9KTtcclxuICAgICAgICAgICAgICAgICAgICBUd2Vlbk1heC5zZXQodGhpcy50YXJnZXQuZmluZCgnLnNpZGVCYXItaXRlbScpLHt4UGVyY2VudDowLG9wYWNpdHk6MX0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLnRhcmdldC5pcygnLnNpZGVCYXItLXJpZ2h0JykpIHtcclxuICAgICAgICAgICAgVHdlZW5NYXgudG8odGhpcy50YXJnZXQuZmluZCgnLnNpZGVCYXItaXRlbScpLDAuMjUse3hQZXJjZW50Oi0yMCxvcGFjaXR5OjAuNH0pO1xyXG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLnRhcmdldC5maW5kKCcuc2lkZUJhci1jb250YWluZXInKSwwLjI1LHt4UGVyY2VudDoxMDAsb3BhY2l0eTowLGRlbGF5OjAuMX0pO1xyXG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLnRhcmdldCwwLjI0LHtcclxuICAgICAgICAgICAgICAgIG9wYWNpdHk6MCxcclxuICAgICAgICAgICAgICAgIGRlbGF5OjAuNDMwLFxyXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTWF4LnNldCh0aGlzLnRhcmdldCx7ZGlzcGxheTonbm9uZScsb3BhY2l0eToxfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVHdlZW5NYXguc2V0KHRoaXMudGFyZ2V0LmZpbmQoJy5zaWRlQmFyLWNvbnRhaW5lcicpLHt4UGVyY2VudDowLG9wYWNpdHk6MX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTWF4LnNldCh0aGlzLnRhcmdldC5maW5kKCcuc2lkZUJhci1pdGVtJykse3hQZXJjZW50OjAsb3BhY2l0eToxfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1lbHNlIGlmKHRoaXMudGFyZ2V0LmlzKCcuc2lkZUJhci0tdG9wJykpIHtcclxuICAgICAgICAgICAgVHdlZW5NYXguc3RhZ2dlclRvKHRoaXMudGFyZ2V0LmZpbmQoJy5zaWRlQmFyLWl0ZW0nKSwwLjU1LHtvcGFjaXR5OicwJywgeTotNTUsIHNjYWxlOjAuM30sMC4wOCk7XHJcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvKHRoaXMudGFyZ2V0LmZpbmQoJy5zaWRlQmFyLWNvbnRhaW5lcicpLDAuNCx7b3BhY2l0eTonMC40JywgeVBlcmNlbnQ6LTEwMCwgZGVsYXk6IDAuNX0pO1xyXG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLnRhcmdldCwwLjIse29wYWNpdHk6MCxkZWxheTowLjgsb25Db21wbGV0ZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTWF4LnNldCh0aGlzLnRhcmdldCx7ZGlzcGxheTonbm9uZScsb3BhY2l0eToxfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVHdlZW5NYXguc2V0KHRoaXMudGFyZ2V0LmZpbmQoJy5zaWRlQmFyLWNvbnRhaW5lcicpLHt5UGVyY2VudDowLG9wYWNpdHk6MX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTWF4LnNldCh0aGlzLnRhcmdldC5maW5kKCcuc2lkZUJhci1pdGVtJykse3k6MCxvcGFjaXR5OjEsc2NhbGU6MX0pO1xyXG4gICAgICAgICAgICB9fSk7XHJcbiAgICAgICAgfWVsc2UgaWYodGhpcy50YXJnZXQuaXMoJy5zaWRlQmFyLS1ib3R0b20nKSkge1xyXG4gICAgICAgICAgICBUd2Vlbk1heC5zdGFnZ2VyVG8odGhpcy50YXJnZXQuZmluZCgnLnNpZGVCYXItaXRlbScpLDAuNTUse29wYWNpdHk6JzAnLCB5OjU1LCBzY2FsZTowLjN9LDAuMDgpO1xyXG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLnRhcmdldC5maW5kKCcuc2lkZUJhci1jb250YWluZXInKSwwLjQse29wYWNpdHk6JzAuNCcsIHlQZXJjZW50OjEwMCwgZGVsYXk6IDAuNX0pO1xyXG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLnRhcmdldCwwLjIse29wYWNpdHk6MCxkZWxheTowLjgsb25Db21wbGV0ZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTWF4LnNldCh0aGlzLnRhcmdldCx7ZGlzcGxheTonbm9uZScsb3BhY2l0eToxfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVHdlZW5NYXguc2V0KHRoaXMudGFyZ2V0LmZpbmQoJy5zaWRlQmFyLWNvbnRhaW5lcicpLHt5UGVyY2VudDowLG9wYWNpdHk6MX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFR3ZWVuTWF4LnNldCh0aGlzLnRhcmdldC5maW5kKCcuc2lkZUJhci1pdGVtJykse3k6MCxvcGFjaXR5OjEsc2NhbGU6MX0pO1xyXG4gICAgICAgICAgICB9fSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0saW5pdDpmdW5jdGlvbigpe1xyXG4gICAgICAgICQoJy5zaWRlQmFyJykuY2xpY2soZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKGUudGFyZ2V0KTtcclxuICAgICAgICAgICAgaWYgKHRhcmdldC5pcygnLnNpZGVCYXItY2xvc2UsIC5zaWRlQmFyJykpIHtcclxuICAgICAgICAgICAgICAgIHNpZGVCYXIuY2xvc2UodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
