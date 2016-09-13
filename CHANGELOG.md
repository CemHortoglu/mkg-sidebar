0.3.0
===============
- callback property added to items
```js
menu.addItem({
    text:'Product1',
    link:'/prod/1',
    callback:function(e){
        //this={title,text,link,follow,depth}
        e.preventDefault();
    }});
```
- private **\_itemToHTML** method changed. now it's using createElement instead of string for bindings
- added base structure for different pane animations
- default animation setted to 'slide'

0.1.3
===============

- added **collapse**, **uncollapse** METHODS.
- added **autoCollapse** property for auto collapse on close.
- added depth property for depth based item customization.
- improved addItem method. it is also accept object array.
- added **setHeader** and **setFooter** methods for customize menu.
- added removeItems method.
