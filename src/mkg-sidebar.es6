/**
 * mkg-sidebar
 * https://github.com/mkg0/mkg-sidebar
 */
 class mSidebar{
    _itemToHTML({title,text,link,follow=true,items=[]},depth=0){
        if(link && link.search(/^(https?|ftp):/) !== 0)
            link= this.options.baseURL.replace(/\/$/,'') + '/' + link.replace(/^\//,'');
        let resultHTML='';
        if (items.length === 0) {
            resultHTML = `<a href="${link ? link : ''}" title="${title ? title : text}"${follow ? '' : ' rel="nofollow"' } class="mSidebar-item mSidebar--d${depth}">${text}</a>`;
        }else {
            let linkHTML = link ?
            `<a href="${link}" title="${title ? title : text}"${follow ? '' : ' rel="nofollow"'} class="mSidebar-collapse-header mSidebar--d${depth}">${text}</a>` :
            `<div class="mSidebar-collapse-header mSidebar--d${depth} mSidebar-collapse--buttonrole">${text}</div>`;

            resultHTML= `
            <div class="mSidebar-collapse mSidebar--d${depth}">
                <div class="mSidebar-collapse-button mSidebar--d${depth}"></div>
                ${linkHTML}
                <div class="mSidebar-collapse-items mSidebar--d${depth+1}">
                    ${ items.reduce( (a,b)=> a+ this._itemToHTML(b,depth+1) , '') }
                </div>
            </div>`;
        }
        return resultHTML;
    }
    refreshItems(){
        let itemsHTML='';
        for (let i in this.items) {
            itemsHTML += this._itemToHTML(this.items[i])
        }
        this.target.querySelector('.mSidebar-content').innerHTML = itemsHTML;
        return this;
    }
    setContent(context){
        this.target.querySelector('.mSidebar-content').innerHTML = document.querySelector(context).innerHTML;
        return this;
    }
    setHeader(context){
        this.target.querySelector('.mSidebar-header').innerHTML = document.querySelector(context).innerHTML;
        return this;
    }
    setFooter(context){
        this.target.querySelector('.mSidebar-footer').innerHTML = document.querySelector(context).innerHTML;
        return this;
    }
    removeItems(){
        this.items=[];
        this.refreshItems();
        return this;
    }
    addItemFrom(context){
        let foundItems = document.querySelectorAll(context);
        for (var i = 0; i < foundItems.length; i++) {
            this.addItem({
                title: foundItems[i].getAttribute('title') ? foundItems[i].getAttribute('title') : this.options.defaultTitle,
                text:foundItems[i].innerHTML.replace(/<[^>]+>/g,''),
                link: foundItems[i].getAttribute('href') ? foundItems[i].getAttribute('href') : '/',
                follow: foundItems[i].getAttribute('rel') === 'nofollow' ? false: this.options.defaultFollow
            },false)
        }
        this.refreshItems();
        return this;
    }
    addItem({title,text,link,follow=true,items=[]},refresh=true){
        if(arguments.length ===0) return false;
        if (typeof arguments[0] === 'string'){
            title=arguments[0];
            text=arguments[0];
            link=arguments[0].toLowerCase().replace(/[^a-z0-9]/,'');
        }else if (Object.prototype.toString.call( arguments[0] ) == '[object Array]') {
            var items = arguments[0];
            for (var i = 0; i < items.length; i++) {
                this.addItem(items[i],false);
            }
            if (refresh) this.refreshItems();
            return this;
        }
        let newItem= {
            title:title,
            text:text,
            link:link,
            follow:follow,
            items:items
        }
        this.items.push(newItem);
        if (refresh) this.refreshItems();
        return this;
    }
    constructor(){
        this.propertyName=null;
        this.items=[];//{text:string,link:string,title:string,follow:bool}
        this.options={
            baseURL:'',
            position:'left', // left, top, bottom, right
            closeButton:true,
            closeOnBackgroundClick:true,
            animationType:'css', // todo jquery, tweenMax, css, none
            defaultTitle:'',
            defaultFollow:true,
            onOpen:null,
            onClose:null,
            autoCollapse:false// auto collapse on close
        };
        for (var i = 0; i < arguments.length; i++) {
            let argument = arguments[i];
            if (typeof  argument=== 'string') {
                this.propertyName = argument;
            }else if (Object.prototype.toString.call( argument ) == '[object Array]') {
                for (var i2 = 0; i2 < argument.length; i2++) {
                    this.addItem(argument[i2],false);
                }
            }else if (typeof argument === 'object') {
                for (let variable in argument) {
                    this.options[variable] = argument[variable];
                }
            }else if (typeof argument === 'function') {
                this.options.onOpen = argument;
            }
        }


        let newBar = document.createElement('aside');
        this.target= newBar;
        newBar.className +=` mSidebar mSidebar--${this.options.position}`;
        newBar.innerHTML =
        `<div class="mSidebar-container">
            <header>
                ${this.options.closeButton ? '<div class="mSidebar-close"></div>' : ''}
                <div class="mSidebar-header"></div>
            </header>
            <div class="mSidebar-content"></div>
            <footer class="mSidebar-footer"></footer>
        </div>`;
        this.refreshItems();
        document.body.appendChild(newBar);
        if (this.propertyName) {
            eval(`mSidebar.${this.propertyName}=this`);
        }
        if (this.options.closeButton) {
            newBar.querySelector(".mSidebar-close").addEventListener('click',this.close.bind(this));
        }
        newBar.addEventListener('click',this._onClick.bind(this));

        return this;
    }

    _onClick(e){
        if (e.target === this.target && this.options.closeOnBackgroundClick) {
            this.close.call(this);
        }
        let clsName= ' ' + e.target.className + ' ';
        if (clsName.indexOf("mSidebar-collapse-button") > -1 || clsName.indexOf("mSidebar-collapse--buttonrole") > -1){
            let parent = e.target.parentNode;
            if ( ( ' ' + parent.className + ' ').indexOf(' mSidebar-collapse--open ') > -1 ) {
                parent.className = parent.className.replace(/( |$)mSidebar-collapse--open/,'');
            }else {
                parent.className += ' mSidebar-collapse--open';
            }
        }
    }
    open(){
        // setInterval(function () {
        //     this.uncollapse();
        // }.bind(this),4000);
        if ((' ' + this.target.className + ' ').indexOf(" mSidebar--close ") > -1 )
        this.target.className = this.target.className.replace('mSidebar--close','mSidebar--open');
        else
            this.target.className += ' mSidebar--open';
        if (this.options.onOpen) {
            this.options.onOpen.call(this);
        }
        return this;
    }
    close(){
        this.target.className = this.target.className.replace('mSidebar--open','mSidebar--close');
        if (this.options.autoCollapse) this.collapse();
        if (this.options.onClose) this.options.onClose.call(this);
        return this;
    }
    toggle(){
        if ((' ' + this.target.className + ' ').indexOf(" mSidebar--open ") > -1 )
            this.close();
        else
            this.open();
        return this;
    }
    collapse(){
        let foundItems = this.target.querySelectorAll('.mSidebar-collapse--open');
        for (var i = 0; i < foundItems.length; i++) {
            foundItems[i].className= foundItems[i].className.replace(/ ?mSidebar-collapse--open/,'');
        }
        return this;
    }
    uncollapse(){
        let foundItems = this.target.querySelectorAll('.mSidebar-collapse:not(.mSidebar-collapse--open)');
        for (var i = 0; i < foundItems.length; i++) {
            foundItems[i].className += ' mSidebar-collapse--open';
        }
        return this;
    }
}
