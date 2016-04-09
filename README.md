# mkgSideBar

RDD

mkgSideBar is flexible navigation -or pane- bar for mobile and  web UI. It based on native js and css. Animation libraries *TweenMax*, *jQuery animate* and *css animation* are also optional. You can easily set up navigation items or custom html content. then u just need  trigger to open.


USAGE
=======
```js
var menu =  new  mkgSideBar({addItems:'#navMenu'})
menu.open();
```


or other usage style
```js
new mkgSideBar('sideNavigation',['Ana Sayfa','Hakkımızda','İletişim']) //automatic creates links
mkgSideBar.sideNavigation.open();
```

with options
```
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
var mainMenu = mkgSideBar.panel.create(items,{baseURL:'http://url.com',position:'left'})
mainMenu.toggle();
```


OPTIONS
=======
baseURL:string
position:string // left, top, bottom, right
closeButton:bool
animationLibrary:string //jquery, tweenMax, css, none
onOpen:func
onClose:func
