# Webz - A simple web framework for Typescript (0.9.12)

## Getting Started

Webz is a simple to use framework for developing web applications in typescript. Webz uses _webpack_ to create a single html and javascript file ready for deployment.  Webz is a major component of the BOOTS (Beginner Object Oriented TypeScript) curriculum.

To get started, install the Webz command line interface.

```
npm install -g @boots-edu/webz-cli
```

Once installed, you can use the `webz` command to create a new web application and to add components to an existing one.
>Note: You may need to run this command with sudo on Unix/Linux/Mac:
```sudo npm install -g @boots-edu/webz-cli```

## Creating a new website

Go to the parent directory of where you want your new application and issue the command.

```
webz new <project name>
```

where **project name** is the name you want to use for your new project. Webz will set up your project directory and install necessary dependencies. When it completes, you can access the project folder

```
cd <project name>
```

and open your project in your favorite IDE.

## Creating a new component for your website

At the command line, navigate to the src/app folder (or a subfolder if you built more structure) and issue the webz component command

```
webz component <componentName>
```

where **componentName** is the component to create. This will create the following files:

-   component-name.component.ts : A class named ComponentNameComponent
-   component-name.component.html : The html for your component
-   component-name.component.css : The css for your component
-   component-name.component.test.ts : A jest testing stub for you to use

Note: If you include the word **component** at the end of your component name it will be removed (i.e. TestComponent would create test.component.ts)

## Site wide styles

You can find the file `styles.css` in the root of your project. You can add any global styles to this file and they will be applied site wide. You can also find `index.html` in the src folder. You can edit this file to add any additional global css or js files or change your application's title.

> Note: Do not remove the div with id `main-target` as it is critical to the operation of the framework.

## Building your site

The Webz framework comes with npm build scripts which you can execute with

```
npm run <command>
```

Where command is one of:

-   build - Builds a development copy of your project in ./dist
-   build:dev - Builds a development copy of your project in ./dist
-   build:prod - Builds a production copy of your project in ./dist
-   start - Builds and runs your project in the deveopment server for testing
-   test - Runs Jest tests on your code
-   coverage - Runs a test coverage report on your code and tests

Additionally, you can look in the generated package.json for more options.

## Deploying your site
Webz sites are automatically deployed to github pages when the main branch is successfully pushed.  You do have to enable this in github for your repository.  Go to github.com and to your repository, then click on settings->pages. Pull down the source drop down and select Github Actions.  The next time you push the main branch, you will automatically publish to github pages (note: the web address will appear at the top of the pages settings once you select the source).

## Designing components

When you first create a site, it contains a single component called MainComponent in the files `main.component.[ts | html | css | test.ts]`. Additionally added components can be found in their respective sub-folders once created. Building components can be accomplished by following these steps.

-   Author the html for your component. For any element (div, span, input, button, etc.) for which you will want to add functionality (i.e. binding to a variable or capturing an event), you should give that element a unique id. in the id property.

```
<input type="text" id="user-name" />
<div id="user-count"></div>
<button id="increment-btn">Click Me</button>
```
-   Write css to style your html
```
#user-count{
	font-weight:bold;
	font-size:20pt;
	color: blue;
	min-height:50px;
}
```

-   Add properties and methods to your class to hold values or handle events

```
export class MainComponent extends WebzComponent {
	///will link up to the input element
    userName: string = "";
	//will link up to the div element
    userCount: string = "0";

    constructor() {
        super(html, css);
    }

	// will link up to the button element
    onIncrementBtnClick() {
        let n: number = +this.userCount;
        this.userCount = (n + 1).toString();
    }
}
```

-   Decorate the properties with one of BindValue, BindStyle or BindCSSClass specifying the id of the element you want to bind. BindCSSClass will bind the elmements `class` attribute to the property.  It will leave any classes defined in the html alone, they cannot be removed programmatically. Changing the property value changes the css class of the element for dynamic styling. BindStyle will bind the specified element and specific style setting to the variable.  Note BindValue, BindStyle, and BindCSSClass can be stacked. 

```
export class MainComponent extends WebzComponent {
	@BindValue("user-name")
    userName: string = "";

	@BindValue("user-count",(v:number)=>v.toString())
    userCount: number = 0;

    @BindStyle("user-count","color")
    userCountColor:string="red";
    
    constructor() {
        super(html, css);
    }

	// will link up to the button element
    onIncrementBtnClick() {
        let n: number = +this.userCount;
        this.userCount = (n + 1).toString();
    }
}
```

-   Decorate methods with various event handlers. These include Click, Blur, Change, Input. There is also a generic event handler decorator GenericEvent which takes the id of the element and the name of the event you want in order to allow all html events to be captured.

```
export class MainComponent extends WebzComponent {
	@BindValue("user-name")
    userName: string = "";

	@BindValue("user-count",(v:number)=>v.toString())
    userCount: number = 0;

    @BindStyle("user-count","color")
    userCountColor:string="red";
    
    constructor() {
        super(html, css);
    }

	@Click("increment-btn")
    onIncrementBtnClick() {
        let n: number = +this.userCount;
        this.userCount = (n + 1).toString();
    }
}
```
## Adding sub-components
You add subcomponents to a component (like MainComponent) by calling the AddComponent method and passing it an instance of the child component.  You can optionally specify the id of the html element into which you want to place the child component.
### AddComponent(component,?htmlid)
Installs a component as a child of the current component.  In the following example, MainComponent is the top level component created automatically by the framework.  ChildComponent is another Webz generated component you would like to add.  If htmlid is not provided, the child component is added to the bottom of the parent html document. You should try to attach it to an element.
```
HTML File (main.component.html):
<div id="childhere"></div>
```
```
TS File (main.component.ts)
export class MainComponent{
    private childComponent:ChildComponent=new ChildComponent();

    constructor(){
        super(html,css);
        this.addComponent(childComponent,"childhere");
    }
}
```
>Note: For every sub-component there are two steps.  You must create an instance of the component with ```new``` then attach it to your parent component with ```addComponent```.  Unless you do both, your component will not show up on your website.
## Bind Decorators
### @BindValue(id)
> Binds to string, or must have a transform that returns a string 

Connects the value property of an html element with id.  Optionally takes a transform method.  If the element is a checkbox, returns either ```"on"``` or ```""``` depending on if it is checked or unchecked.
```
HTML FILE:
<input type='text' id='inp1'/>
<input type='text' id='inp2'/>
```

```
TS File:
@BindValue("inp1") inputValue:string="";
@BindValue("inp2",(v:number)=>v.toString())  inputValue2:number=0;


```
### @BindCSSClass(id)
> Binds to string or must have a transform that returns a string.

Connects the css class of an html element with id with a member variable of the class.  This does not effect css classes defined in the html.
```
HTML File:
<div id="div2"></div>
<div id="div3"></div>
```
```
TS File:
@BindCSSClass("div2") div2Class:string="btn btn-primary";
@BindCSSClass("div3",(v:boolean)=>v?"hidden":"") hidden:boolean=true;
```
### @BindStyle(id,style)
> Binds to string or must have a transform that returns a string.

Connects a specific style of an html element with id with a member variable of the class.  If the style you want has a -, the decorator expects in in camel case (i.e. background-color would be backgroundColor)
```
HTML File:
<div id="div2"></div>
<div id="div3"></div>
```
```
TS File:
@BindStyle('div2','backgroundColor') div3BgColor:string="red";
@BindStyle('div2','display',(v:boolean)=>v?"none":"block") hidden:boolean=true;
```
### @BindAttribute(id,attributeName)
> Binds to string or must have a transform that returns a string.

Connects an attribute of an html element with id with a member variable of the class.  If the value is the empty string, the attribute is deleted from the element.
```
HTML File:
<btn id="btn1">
<img id="img1">
```
```
TS File:
@BindAttribute("btn1","disabled",(v:boolean)=>v?"disabled":"")
disableBtn:boolean=false;

@BindAttribute("img1","src")
imgSrc:string="http://my.imagesrc.com/img1";
```
### @BindList(id,?trans,?replaceInnerHtml,?itemId)
> Binds to a string array or must have a transform that resolves to a string array.

Connects an element to an array by duplicating the element for each item in the array and setting the appropriate properties using the values in the array.  If replaceInnerHtml is provided and false, the innerHtml property of the duplicated item will not be modified.  If the itemId is an id of an element inside the duplicated item, then the value of that item will replace the item's innerHtml
```
HTML File
<select id="selector">
    <option id="option">
</select>
<ul>
    <li id="item">
</ul>
<div>
    <div id="list"><input type="checkbox" /> <span id="item"></span></div>
</div>
```
```
@BindList("option")
arr:string[]=["option 1","option 2", "option 3"];
@BindList("item",(value:number[])=>value.map(v=>v.toString()))
arr2:number[]=[1,2,3];
@BindList("list", undefined, false, ["item"])
list: string[] = ["item1", "item2", "item3"];
)
```
### @BindCheckedToBoolean(id)
> Binds to boolean

Connects a checkboxes checked attribute to a boolean value
```
HTML File:
<input id="inp1" type="checkbox">
```
```
@BindCheckedToBoolean("inp1")
checked:boolean=false;
```
### @BindCSSClassToBoolean(id,className)
> Binds to a boolean

Connects className to the element with id if the value is true.  Removes it otherwise.
```
HTML File:
<div id="div1"></div>
```
```
TS File:
@BindCSSClassToBoolean('div1','size-huge') makeItBig:boolean=true;

```

### BindDisabledToBoolean(id)
> Binds to a boolean

Disables the element with id when true.  Enables it otherwise
```
HTML File:
<div id="div1"></div>
```
```
TS File:
@BindDisabledToBoolean('div1') disabled:boolean=false;

```
### BindVisibleToBoolean(id)
>Binds to a boolean

Shows or hides an element based on the value of the boolean.
```
HTML File:
<div id="div1"></div>
```
```
TS File:
@BindVisibleToBoolean('div1') visible:boolean=true;

```
### BindValueToNumber(id)
>Binds to a number

Binds a numeric property to the elements with id's value and optionally appends a string to the end

```
HTML File:
<div id="div1></div>
<div id="div2></div>
```
```
TS File:
@BindValueToNumber("div1")
@BindValueToNumber("div2"," seconds")
private seconds:number=0;
```

### BindStyleToNumber(id,style,?append)
>Binds to a number

Binds a numeric property to the element style with id and optionally appends a string to the end
```
HTML File:
<div id="div1></div>
<div id="div2></div>
```
```
TS File:
@BindStyleToNumber("div1","width")
@BindStyleToNumber("div2","width","%")
private width:number=100;
```

### BindStyleToNumberAppendPx(id,style)
>Binds to a number

Binds a numeric property to the element style with id and appends "px" to the end of the string.
```
HTML File:
<div id="div1"></div>
```
```
TS File:
@BindStyleToNumberAppendPx("div1","width") width:number=200;

```


## Event Decorators
> For event handlers which handle the change or input events, you can have your method parameter be of type ValueEvent and you can get the value of the object from the value property.
```
@GenericEvent(input1,"input")
onInput(e:ValueEvent){
    console.log(e.value);
}
```
### @GenericEvent(id,event)
> Binds to {(evt:?Event)=>void} 

This will connect any html event on an html element with id with a member method of the class.  The method must be of the form ```(evt:?Event)=>void.```
```
HTML File:
<button id="btn1"></button>
```
```
TS FIle:
@GenericEvent(btn1,"click")
onBtn1Click(evt:Event){
    console.log(evt);
}
```
### @Click(id)
> Binds to {(evt:?MouseEvent)=>void} 

This will connect the html click event on an html element with id with a member method of the class.  The method must be of the form ```(evt:?MouseEvent)=>void.```
```
HTML File:
<button id="btn1"></button>
```
```
TS FIle:
@Click("btn1")
onBtn1Click(evt:MouseEvent){
    console.log(evt);
}
```
### @Blur(id)
> Binds to {(evt:?FocusEvent)=>void} 

This will connect the html blur event on an html element with id with a member method of the class.  The method must be of the form ```(evt:?FocusEvent)=>void.```
```
HTML File:
<input type="text" id="inp2"/>
```
```
TS FIle:
@Blur("inp2")
onInputBlur(evt:FocusEvent){
    console.log(evt);
}
```
### @Change(id)
> Binds to {(evt:?ValueEvent)=>void} 

This will connect the html change event on an html element with id with a member method of the class.  The method must be of the form ```(evt:?ValueEvent)=>void.```
```
HTML File:
<input type="text" id="inp2"/>
```
```
TS FIle:
@Change("inp2")
onInputChange(evt:ValueEvent){
    console.log(evt);
    // To get the actual value:
    console.log(evt.value);
}
```

### @Input(id)
> Binds to {(evt:?ValueEvent)=>void} 

This will connect the html input event on an html element with id with a member method of the class.  The method must be of the form ```(evt:?ValueEvent)=>void.```
```
HTML File:
<input type="text" id="inp2"/>
```
```
TS FIle:
@Input("inp2")
onInput(evt:ValueEvent){
    console.log(evt);
    // To get the actual value:
    console.log(evt.value);
}
```
### Bind Transforms

Unless otherwise specified, bind decorators can take an extra argument to convert the member you are binding's value to a string before sending it to the decorator.  These transform methods must return the appropriate type for the element and type of decorator.
```
HTML File:
<div id="mover" class="small-square-box"></div>
```
If our property is a string, we don't have to do anything.
```
TS File:
@BindStyle('mover','top') value:string="100px";
```
If our propety is a number, then we can still bind it like this
```
@BindStyle('mover','top',(v:number)=>v.toString()+"px") value:number=100;
```
Note that the method we pass in converts our property type (number) to a string.

We can also access the properties of the class in our wrapper if we need to:
```
@BindStyle('test','top',(this: MyComponent,v:boolean)=>v?this.value1:this.value2);
```

There are also some simple wrappers available to help you as documented above.  In the case of our last example, we could use a wrapper like this:
```
@BindStyleToNumberAppendPx("div1") value:number=100;
```
## Stacking Methods

All decorators can be stacked on methods and properties.  Stacked decorators are applied from bottom to top.
```
@BindValue("div1"}
@BindValue("div2")
@BindValue("input1")
inputValue:string='';

@Change("inp1")
@Change("inp2")
@Input("inp3")
onValuesChanged(evt:Event){
    console.log(evt);
}
```

## Utility Methods
### @Timer(milliseconds)
> Binds to {TimerCancelFunction} ()=>void

There is a special decorator ```@Timer(milliseconds)``` which will call the decorated method every interval until the supplied cancel function is called.
```
@Timer(1000)
onTimer(cancel: TimerCancelFunction){
    this.count++;
    console.log(this.count);
    if (this.count>=15) cancel();
}
```
This example will be called once per second.  It will print a counter from 0 to 15, and will stop the timer permenantly after 15 is printed.
### @WindowEvent(event)
> Binds to {e:Event)=>void}

There is another decorator ```@WindowEvent(event)``` which captures events on the entire window.  Useful for picking up keystrokes, mouse events, or resize events.
```
@WindowEvent("resize")

onMainWindowResize(evt:Event){
    console.log("The whole window is "+sz.windowWidth+" pixels wide.");
}
```
### focus(htmlElementId)
Set the focus to an element on the current component by id
```
this.setfocus('input1');
```
### getValue(htmlElementId)
Get the value of the elment on the current component by id.  If the element does not exist or does not have a value this method Throws an Error object.
```
try{
    let val:string=this.getValue("input1");
}catch(e){
    console.error(e)
}
```

### click(htmlElementId)
Click the element on the current component by id.  This is useful for testing.
```
this.click('button1')
```
### ajax\<T>(url,method,headers,data):Notifier\<T>
This allows you to make an asyncronous call and will return a Notifier<T> for you to subscribe.  The eventsource will fire the subscription when the request is complete.
```
this.ajax<UserRecord>("https://www.udel.edu",HttpMethod.GET)
    .subscribe((result:UserRecord)=>{
        console.log(result);
    });
const request=this.ajax<boolean>("http://api.test.com",HttpMethod.POST,[],userRecord);
    request.subscribe((result:boolean)=>{
        console.log(result)
    });
    request.error((err:Error)=>{
        console.error(err);
    });
```
## Other types of components
### WebzDialog
This WebzComponent derived class allows you to create popup dialogs just like other components.  Your component just shows up in the middle of the dialog.  You can hide or show your dialog with ```this.show(true|false)```.  There is also a utility static method ```popup``` that you can use for a quick alert or confirm message.  It returns a Notifier whose subscription is called when the dialog closes with the value of the button pressed (i.e. the text on the button).
```
Webz dialog editor
```
will create an editor (works similar to component) dialog.  This can be modified and used:
```
const dlg:EditorDialog=new EditorDialog();
this.addComponent(dlg);
dlg.show();
```
an alert box can be shown simply by using:
```
    WebzDialog.popup(this, "Message to display").subscribe(
    (value: string) => {
        console.log(value); //will be Ok
    },
);
```
A confirmation box can be shown by using:
```
        WebzDialog.popup(this, "Message to display", "Window title", [
            "Yes",
            "No",
            "Cancel","btn btn-primary"
        ]).subscribe((value: string) => {
            if (value === "Yes") {
                console.log("Yes");
            } else if (value === "No") {
                console.log("No");
            } else {
                console.log("Cancel");
            }
        });
```
We are specifying the title, the buttons to display, and a class for the buttons to style them.  It will return a subscription that will evaluate to the button name passed into the method.
### WebzRouter
The ```WebzRouter``` class handles routing.  You create one by calling WebzComponent's addRouter method with an array of routes and a target
```
HTML File:
<div class="main">
    <div class="header"></div>
    <div id="router" class="content"></div>
</div>
```
```
TS File:
     private routes = [
        { path: "/", component: new Page1Component() },
        { path: "/home", component: new Page1Component() },
        { path: "/about", component: new Page2Component() },
        { path: "/contact", component: new Page3Component() },
    ];
    constructor() {
        super(html, css);
        this.addRouter(this.routes, "router");
    }
```
You can change pages in code by calling the route method and passing it the path to route to.
```
    this.router?.route("/about");
```
## Utility Classes
### Notifier
The ```Notifier``` class can be used to handle asynchronous code. You can either ```subscribe``` to it or convert it to a promise with the ```toPromise``` method.  Many functions in ```Webz``` return a ```Notifier``` that you can subscribe to.
```
event:Notifier<boolean> = new Notifier<boolean>();
event.subscribe((result:boolean)=>{
    console.log(result);
},(err:Error)=>{
    console.log(err);
}
```
or
```
event:Notifier<boolean> = new Notifier<boolean>();
let result:boolean = await event.toPromise();
```
Trigger the notifier with
```
event:Notifier<boolean> = new Notifier<boolean>();
event.notify(true);
```

## Working example program
A fully working example can be found here: 
[https://boots-edu.github.io/Webz/example](https://boots-edu.github.io/Webz/example)

Another here:
[https://boots-edu.github.io/Webz/webpong](https://boots-edu.github.io/Webz/webpong)

And my personal favorite:
[https://boots-edu.github.io/Webz/lander](https://boots-edu.github.io/Webz/lander)

All of these were created with Webz without accessing any DOM elements directly.

## Full Technical Documenation

Full technical documentation is available [https://boots-edu.github.io/Webz/](https://boots-edu.github.io/Webz/)
