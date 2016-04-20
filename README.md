# mkg-sidebar

mkg-sidebar is flexible navigation bar -or pane- with nested menu support for mobile and  web UI. It based on native js and css. Animation libraries *TweenMax*, *jQuery animate* are also optional. You can easily set up navigation items or custom html content. then u just need  trigger to open.


USAGE
=======
```js
var menu =  new  mSidebar({addItems:'#navMenu'})
menu.open();
```


or other usage style
```js
new mSidebar('sideNavigation',['Main Page','About Us','Contact']) //automatic creates links
mSidebar.sideNavigation.open();
```

with options
```js
var items=[
{
    text:'Index Page',
    link:'/',
    nofollow:true
},
{
    text:'About Us',
    link:'aboutus.html',
    title:'Our Company'
}
]
var mainMenu = mSidebar.panel.create(items,{baseURL:'http://url.com',position:'left'})
mainMenu.toggle();
```


OPTIONS
=======
- baseURL:string
- position:string // left, top, bottom, right
- closeButton:bool
- animationLibrary:string //jquery, tweenMax, css, none
- onOpen:func
- onClose:func

TO DO
=======
- add alternative animation styles
- add alternative visual style
- fix for older browser versions
- documantation
