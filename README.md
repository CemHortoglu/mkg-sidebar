# mkg-sidebar

mkg-sidebar is flexible navigation bar -or pane- with nested menu support for mobile and  web UI. You can easily set up navigation items or custom html content. then u just need  trigger to open.


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


OPTIONS WITH DEFAULT VALUES
=======
```
baseURL:'' // base url to every relative menu links
position:'left' // left, top, bottom, right
closeButton:true //
closeOnBackgroundClick:true //
animationType:'css' // todo jquery, tweenMax, css, none
defaultTitle:'' //default title attr value
defaultFollow:true, // default follow attr value
autoCollapse:false// auto collapse on close
onOpen:null // handler
onClose:null // handler
```

METHODS
=======
```
var menu =  new  mSidebar();

menu.addItem({
    text:'Test',
    link:'/PageLink.html'
}); //add menu item

menu.collapse(); //collapse all submenus

menu.unCollapse(); //uncollapse all submenus

menu.open(); //open menu

menu.close(); //close menu

menu.toggle(); //toggle menu

menu.removeItems(); //clears all items

menu.setContent('#divWithContent'); //sets the menu content from targeted element

menu.setHeader('#divWithContent'); //sets the menu header content from targeted element

menu.setFooter('#divWithContent'); //sets the menu footer content from targeted element

menu.refreshItems();
```
Visualize
=======

#### scss styling
```
.mSidebar{
  & &-item{} //all menu items
  & &-collapse{ //whole collapsable item container
    //a collapsable item has 3 parts:
    & &-header{} //header area is the part of without button and sub items
    & &-items{} //items area is the sub-items container of collapsable item
    & &-button{} // button area of the collapsable item
  }
  & &--d0{} //you can compine any class with mSidebar--d{level} class
  & &--d1{}
  & &--d2{}
}
```
#### css styling
```css
.mSidebar .mSidebar-item{}
.mSidebar .mSidebar-collapse {}
    .mSidebar .mSidebar-collapse-header {}
    .mSidebar .mSidebar-collapse-items {}
    .mSidebar .mSidebar-collapse-button {}

.mSidebar-collapse-button.mSidebar--d0 {} //you can compine any class with mSidebar--d{level} class
.mSidebar-collapse-button.mSidebar--d1 {}
.mSidebar-collapse-button.mSidebar--d2 {}
```

Building
=======
ensure that you have all dependency packes with 'npm install' and install gulp to gloval with `npm install gulp -g`
package using gulp for building. following tasks are avaliable:
- `gulp default` : watches src files and serves index.html for developing
- `gulp minify` : creates minified version of package. don't forget to use it after development ends.

TO DO
=======
- add alternative animation styles
- optional animation libraries //'It based on native js and css. Animation libraries *TweenMax*, *jQuery animate* are also optional.'
- add alternative visual style
- fix for older browser versions
- documantation
