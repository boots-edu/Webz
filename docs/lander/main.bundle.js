/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@boots-edu/webz/WebzComponent.js":
/*!*******************************************************!*\
  !*** ./node_modules/@boots-edu/webz/WebzComponent.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebzComponent = exports.HttpMethod = void 0;
const WebzRouter_1 = __webpack_require__(/*! ./WebzRouter */ "./node_modules/@boots-edu/webz/WebzRouter.js");
const eventsubject_1 = __webpack_require__(/*! ./eventsubject */ "./node_modules/@boots-edu/webz/eventsubject.js");
/**
 * @description An enum for the HTTP methods
 * @export
 * @group AJAX Support
 * @enum {string}
 */
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["OPTIONS"] = "OPTIONS";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
/**
 * @description A base class for creating web components
 * @export
 * @group Abstract Superclasses
 * @abstract
 * @class WebzComponent
 * @example class MyComponent extends WebzComponent {
 *   constructor() {
 *     super("<h1>Hello World</h1>", "h1{color:red;}");
 *   }
 * }
 */
class WebzComponent {
    /**
     * @description An event that fires when the window is resized
     * @readonly
     * @type {EventSubject<SizeInfo>}
     * @memberof WebzComponent
     * @example this.onResizeEvent.subscribe((sizeInfo) => {
     *  console.log(sizeInfo.windowWidth);
     *  console.log(sizeInfo.windowHeight);
     * });
     */
    get onResizeEvent() {
        return WebzComponent.resizeEvent;
    }
    /**
     * @description Creates an instance of WebzComponent.
     * @param {string} [html=""] The html as a string to be used as the body of this component
     * @param {string} [css=""] The css as a string to be used as the style of this component
     * @memberof WebzComponent
     * @public
     * @constructor
     */
    constructor(html, css) {
        this.html = html;
        this.css = css;
        /**
         * @hidden
         */
        this.router = null;
        this.htmlElement = window.document.createElement("div");
        this.shadow = this.htmlElement.attachShadow({ mode: "open" });
        this.template = window.document.createElement("template");
        this.template.innerHTML = this.html;
        for (let style of window.document.styleSheets) {
            /* Jest does not populate the ownerNode member, so this can't be tested*/
            if (style.ownerNode)
                this.shadow.appendChild(style.ownerNode.cloneNode(true));
        }
        this.styles = window.document.createElement("style");
        this.styles.innerHTML = this.css;
        this.shadow.appendChild(this.styles);
        const innerDiv = window.document.createElement("div");
        innerDiv.id = "rootTemplate";
        innerDiv.appendChild(this.template.content);
        this.template.content.appendChild(innerDiv);
        this.shadow.appendChild(innerDiv);
        this.shadow.appendChild(this.template.content.cloneNode(true));
        if (!window.onresize) {
            window.onresize = () => {
                WebzComponent.resizeEvent.next({
                    windowWidth: window.innerWidth,
                    windowHeight: window.innerHeight,
                });
            };
        }
    }
    /**
     * @description Add a component to the dom
     * @param component The component to add
     * @param id The id of the element to append the component to (optional)
     * @returns void
     * @memberof WebzComponent
     * @example
     *   component.addComponent(childComponent);
     *   component.addComponent(childComponent, "myDiv");
     */
    addComponent(component, id = "root", front = false) {
        if (front) {
            if (id === "root") {
                if (this.shadow.firstChild)
                    this.shadow.insertBefore(component.htmlElement, this.shadow.firstChild);
            }
            else {
                let el = this.shadow.getElementById(id);
                if (el) {
                    if (el.firstChild)
                        el.insertBefore(component.htmlElement, el.firstChild);
                    else
                        el.appendChild(component.htmlElement);
                }
            }
        }
        else {
            if (id === "root") {
                this.shadow.appendChild(component.htmlElement);
            }
            else {
                let el = this.shadow.getElementById(id);
                if (el) {
                    el.appendChild(component.htmlElement);
                }
            }
        }
    }
    /**
     * @description Add a router to the component
     * @param router The router to add
     * @param id The id of the element to append the router to (optional)
     * @returns the router
     * @memberof WebzComponent
     * @example component.addRouter(router);
     */
    addRouter(routes, id = "root") {
        if (this.router)
            throw new Error("A router has already been added to this component");
        this.router = new WebzRouter_1.WebzRouter(this, routes, id);
        this.router.route(window.location.pathname);
    }
    /**
     * @description Remove a component from the dom
     * @param component
     * @returns WebzComponent
     * @memberof WebzComponent
     * @example
     * component.addComponent(childComponent);
     * component.removeComponent(childComponent);
     */
    removeComponent(component) {
        component.htmlElement.remove();
        return component;
    }
    /**
     * @description Append the component to a dom element
     * @param domElement
     * @returns void
     * @memberof WebzComponent
     * @example component.appendToDomElement(document.getElementById("myDiv"));
     */
    appendToDomElement(domElement) {
        domElement.appendChild(this.htmlElement);
    }
    /**
     * @description Makes an AJAX call
     * @param {string} url The URL to make the AJAX call to
     * @param {HttpMethod} method The HTTP method to use (GET or POST)
     * @param {Headers} headers The headers to send with the request (optional)
     * @param {T} data The data to send in the request body (optional)
     * @returns {Promise<T>} A promise that resolves with the response data
     * @memberof WebzComponent
     * @static
     * @example myComponent.ajax("https://some.api.url.com/posts", HttpMethod.GET)
     *  .subscribe((data) => {
     *   console.log(data);
     * }, (error) => {
     *   console.error(error);
     * });
     */
    static ajax(url, method, headers = [], data) {
        const evt = new eventsubject_1.EventSubject();
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        for (let header of headers) {
            Object.keys(header).forEach((key) => {
                if (header[key])
                    xhr.setRequestHeader(key, header[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                evt.next(JSON.parse(xhr.responseText));
            }
            else {
                evt.error(new Error(xhr.statusText));
            }
        };
        xhr.onerror = () => {
            evt.error(new Error("Network error"));
        };
        xhr.send(JSON.stringify(data));
        return evt;
    }
    /**
     * @description Get the size of the window
     * @returns {SizeInfo} The size of the window
     * @memberof WebzComponent
     * @example const sizeInfo: SizeInfo = myComponent.getWindowSize();
     */
    getWindowSize() {
        return {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        };
    }
    /**
     * @description Set focus to an element on this component
     * @param {string} elementId The id of the element to focus
     * @returns void
     */
    focus(elementId) {
        let el = this.shadow.getElementById(elementId);
        if (el)
            el.focus();
    }
    /**
     * @description Click an element on this component
     * @param {string} elementId The id of the element to click
     * @returns void
     */
    click(elementId) {
        let el = this.shadow.getElementById(elementId);
        if (el)
            el.click();
    }
    /**
     * @description Get the value of an element on this component.
     * @param {string} elementId The id of the element to get the value of
     * @returns string | undefined
     * @throws Error when element does not have a value property or does not exist
     * @memberof
     */
    getValue(elementId) {
        const element = this.shadow.getElementById(elementId);
        if (element instanceof HTMLInputElement)
            return element.value;
        else if (element instanceof HTMLTextAreaElement)
            return element.value;
        else if (element instanceof HTMLSelectElement)
            return element.value;
        else if (element instanceof HTMLOptionElement)
            return element.value;
        else
            throw new Error("Element does not have a value property");
    }
}
exports.WebzComponent = WebzComponent;
WebzComponent.resizeEvent = new eventsubject_1.EventSubject();


/***/ }),

/***/ "./node_modules/@boots-edu/webz/WebzDialog.js":
/*!****************************************************!*\
  !*** ./node_modules/@boots-edu/webz/WebzDialog.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebzDialog = exports.popupDialog = void 0;
const WebzComponent_1 = __webpack_require__(/*! ./WebzComponent */ "./node_modules/@boots-edu/webz/WebzComponent.js");
const eventsubject_1 = __webpack_require__(/*! ./eventsubject */ "./node_modules/@boots-edu/webz/eventsubject.js");
/** @hidden */
exports.popupDialog = undefined;
const alertDialogTempalte = `
<div style="width: 600px; margin: -10px">
    <div
        id="title"
        style="
            background: silver;
            padding: 10px;
            font-size: 20pt;
            font-weight: bold;
            overflow: hidden;
        "
    >
        My Dialog
    </div>
    <div
        style="
            display: flex;
            min-height: 100px;
            margin: 10px;
            font-size: 20px;
            text-align: center;
            align-items: center;
            justify-items: center;
            line-height: 20px;
        "
    >
        <div
            id="content"
            style="display: block; width: 100%; text-align: center"
        >
            Question goes here
        </div>
    </div>
    <div id="buttonDiv" style="margin: 10px; text-align: right; justify-content: center">
    </div>
</div>`;
const backgroundTemplate = `
.dialog-background {
    display: none;
    position: absolute;
    text-align:center;
    z-index: 1050;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    outline: 0;
    background-color: rgb(0, 0, 0, 0.5);

}`;
const popupTemplate = `
.dialog-popup {
    position: relative;
    top:50%;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    transform: translateY(-50%);
    margin:auto;
    box-shadow: 4px 8px 8px 4px rgba(0, 0, 0, 0.2);
	display:inline-block;
	overflow:hidden;
}`;
/**
 * @description A dialog component that can be used to create a popup dialog
 * @export
 * @class WebzDialog
 * @group Abstract Superclasses
 * @extends {WebzComponent}
 * @example const dialog = new WebzDialog("<h1>Hello World</h1>", "h1{color:red;}");
 */
class WebzDialog extends WebzComponent_1.WebzComponent {
    /**
     * @description Creates an instance of WebzDialog.
     * @param {string} [html=""] The html as a string to be used as the body of this component
     * @param {string} [css=""] The css as a string to be used as the style of this component
     * @memberof WebzDialog
     * @public
     * @constructor
     * @example const dlg = new WebzDialog("<h1>Hello World</h1>", "h1{color:red;}");
     */
    constructor(html = "", css = "") {
        super(html, css);
        this.closeEvent = new eventsubject_1.EventSubject();
        const styleEl = window.document.createElement("style");
        styleEl.innerHTML = backgroundTemplate + popupTemplate;
        this["shadow"].appendChild(styleEl);
        //now add 2 more divs
        this.background = window.document.createElement("div");
        this.background.className = "dialog-background";
        this.background.id = "background-root";
        this.background.style.display = "none";
        this.popup = window.document.createElement("div");
        this.popup.className = "dialog-popup";
        this.background.appendChild(this.popup);
        this["shadow"].appendChild(this.background);
        const outside = this["shadow"].getElementById("rootTemplate");
        if (outside)
            this.popup.appendChild(outside);
    }
    /**
     * @description Show or hide the dialog
     * @param {boolean} [show=true] Show or hide the dialog
     * @returns void
     * @memberof WebzDialog
     * @example
     * const dialog = new MyDialog();
     * dialog.show();
     * dialog.closeEvent.subscribe((value) => {
     *    console.log(value);
     *    dialog.show(false);
     * });
     */
    show(show = true) {
        if (show) {
            this.background.style.display = "inline-block";
        }
        else {
            this.background.style.display = "none";
        }
    }
    static clickPopupButton(buttonNumber) {
        if (exports.popupDialog) {
            const button = this.popupButtons.length > buttonNumber ?
                this.popupButtons[buttonNumber]
                : undefined;
            if (button)
                button.click();
        }
    }
    /**
     * @description Show a popup dialog
     * @static
     * @param {WebzComponent} attachTo The component to attach the dialog to
     * @param {string} message The message to display
     * @param {string} [title="Alert"] The title of the dialog
     * @param {string[]} [buttons=["Ok"]] The buttons to display
     * @param {string} [btnClass=""] The class to apply to the buttons
     * @returns {EventSubject<string>} The event subject that is triggered when the dialog is closed
     * @memberof WebzDialog
     * @example
     * WebzDialog.popup("Hello World", "Alert", ["Ok","Cancel"], "btn btn-primary")
     *    .subscribe((value:string) => {
     *       if (value === "Ok") console.log("Ok was clicked");
     *       else console.log("Cancel was clicked");
     *   });
     *
     *
     */
    static popup(attachTo, message, title = "Alert", buttons = ["Ok"], btnClass = "") {
        const dialog = new WebzDialog(alertDialogTempalte);
        exports.popupDialog = dialog;
        let titleEl = dialog["shadow"].getElementById("title");
        if (titleEl)
            titleEl.innerHTML = title;
        let contentEl = dialog["shadow"].getElementById("content");
        if (contentEl)
            contentEl.innerHTML = message;
        //add buttons
        const buttonDiv = dialog["shadow"].getElementById("buttonDiv");
        if (buttonDiv) {
            for (let btn of buttons) {
                let button = window.document.createElement("button");
                button.innerHTML = btn;
                button.value = btn;
                button.id = "btn_" + btn;
                button.className = btnClass;
                button.style.marginLeft = "10px";
                button.addEventListener("click", () => {
                    dialog.show(false);
                    dialog.closeEvent.next(button.value);
                });
                this.popupButtons.push(button);
                buttonDiv.appendChild(button);
            }
        }
        attachTo.addComponent(dialog);
        dialog.show();
        dialog.closeEvent.subscribe(() => {
            attachTo["removeComponent"](dialog);
        });
        return dialog.closeEvent;
    }
}
exports.WebzDialog = WebzDialog;
WebzDialog.popupButtons = [];


/***/ }),

/***/ "./node_modules/@boots-edu/webz/WebzRouter.js":
/*!****************************************************!*\
  !*** ./node_modules/@boots-edu/webz/WebzRouter.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebzRouter = void 0;
class WebzRouter {
    constructor(container, routes, id) {
        this.container = container;
        this.routes = routes;
        this.id = id;
        this.baseRoute = URLHREF || "";
        this.currentComponent = null;
        this.selectedPage = 0;
        this.route(window.location.pathname.replace(this.baseRoute, ""));
    }
    selectedRoute() {
        return this.selectedPage;
    }
    route(path) {
        const route = this.routes.find((r) => r.path === path);
        if (route) {
            this.selectedPage = this.routes.indexOf(route);
            if (this.currentComponent)
                this.container["removeComponent"](this.currentComponent);
            this.currentComponent = route.component;
            if (this.id === "root") {
                this.container.addComponent(route.component);
            }
            else {
                this.container.addComponent(route.component, this.id);
            }
            window.history.pushState({}, "", this.baseRoute + path);
        }
    }
}
exports.WebzRouter = WebzRouter;


/***/ }),

/***/ "./node_modules/@boots-edu/webz/bind.decorators.js":
/*!*********************************************************!*\
  !*** ./node_modules/@boots-edu/webz/bind.decorators.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BindStyleToNumberAppendPx = exports.BindStyleToNumber = exports.BindValueToNumber = exports.BindCheckedToBoolean = exports.BindVisibleToBoolean = exports.BindDisabledToBoolean = exports.BindCSSClassToBoolean = exports.BindList = exports.BindAttribute = exports.BindValue = exports.BindCSSClass = exports.BindStyle = void 0;
const eventsubject_1 = __webpack_require__(/*! ./eventsubject */ "./node_modules/@boots-edu/webz/eventsubject.js");
/**
 * @description Gets the public key of the field name
 * @param name the name of the field
 * @returns the public key
 * @ignore
 */
function getPublicKey(name) {
    return String(name);
}
/**
 * @description Gets the private key of the field name
 * @param name the name of the field
 * @returns the private key
 * @ignore
 */
function getPrivateKey(name) {
    return `__${String(name)}`;
}
/**
 * @description replaces a property with a new setter and the default getter.  The new setter can call the original setter.
 * @param target the class to replace the setter in
 * @param name the property to replace the setter for
 * @param value the initial value of the property
 * @param setter the new setter to replace the original setter with, this does not need to update the hidden private property.
 * @param callSetterFirst if true, the setter is called before the original setter, otherwise it is called after.
 * @ignore
 */
function hookProperty(target, name, value, setter, callSetterFirst = false) {
    const publicKey = getPublicKey(name);
    const privateKey = getPrivateKey(name);
    Object.defineProperty(target, privateKey, {
        value,
        writable: true,
        enumerable: false,
        configurable: true,
    });
    Object.defineProperty(target, publicKey, {
        get() {
            return this[privateKey];
        },
        set(value) {
            if (callSetterFirst)
                setter(value);
            this[privateKey] = value;
            if (!callSetterFirst)
                setter(value);
        },
        enumerable: true,
        configurable: true,
    });
}
/**
 * @description Replace setter and getter with the ones provided.  These may call the original setter and getter.
 * @param target the class to replace the setter and getter in
 * @param name the property to replace the setter and getter for
 * @param origDescriptor the original property descriptor
 * @param setter the new setter to replace the original setter with, this does not need to update the hidden private property.
 * @param callSetterFirst if true, the setter is called before the original setter, otherwise it is called after.
 * @ignore
 */
function hookPropertySetter(target, name, origDescriptor, setter, callSetterFirst = false) {
    const publicKey = getPublicKey(name);
    Object.defineProperty(target, publicKey, {
        get: origDescriptor.get, // Leave the get accessor as it was
        set(value) {
            if (callSetterFirst)
                setter(value);
            if (origDescriptor.set) {
                origDescriptor.set.call(target, value); // Call the original set accessor with the provided value
            }
            if (!callSetterFirst)
                setter(value);
        },
        enumerable: origDescriptor.enumerable,
        configurable: origDescriptor.configurable,
    });
}
/**
 * @description Returns a property descriptor for a property in this class
 * @param target the class to get the property descriptor from
 * @param key the property to get the descriptor for
 * @returns PropertyDescriptor
 * @throws Error if the property descriptor is not found
 * @ignore
 */
function getPropertyDescriptor(target, key) {
    let origDescriptor = Object.getOwnPropertyDescriptor(target, key);
    /* this can't happen.  Just here for type safety checking*/
    if (!origDescriptor) {
        throw new Error(`can not find setter with name: ${key}`);
    }
    return origDescriptor;
}
/**
 * @description Returns true if the element has a value attribute
 * @param element the element to check
 * @returns boolean
 * @ignore
 */
function elementHasValue(element) {
    return (element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLOptionElement ||
        element instanceof HTMLButtonElement);
}
function walkDOM(element, clone, func) {
    func(element, clone); // Process the current node
    // Recurse into child nodes
    element = element.firstChild;
    clone = clone.firstChild;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (element) {
        walkDOM(element, clone, func);
        element = element.nextSibling;
        clone = clone.nextSibling;
    }
}
/**
 * @description Clones the event listeners from the element to the clone
 * @param element the element to clone the event listeners from
 * @param clone the element to clone the event listeners to
 * @ignore
 */
function cloneEventListeners(element, clone) {
    const listeners = ["change", "input", "blur", "click"];
    listeners.forEach((listener) => {
        walkDOM(element, clone, (el, cl) => {
            cl.addEventListener(listener, (e) => {
                if (elementHasValue(el)) {
                    el.value = e.target.value;
                }
                if (element instanceof HTMLButtonElement)
                    element.innerHTML = e.target.innerHTML;
                if (element instanceof HTMLOptionElement)
                    element.text = e.target.text;
                el.dispatchEvent(new Event(listener));
            });
        });
    });
}
/**
 * @description Recreates the set of elements bound to the array by duplicating the element parameter for each element in the array
 * @param arr the array of values to bind to the elements
 * @param element the element to duplicate for each element in the array
 * @param overwrite if true, the innerHTML of the element will be replaced with the value in the array, otherwise the value will be set as the value of the element
 * @param listItemId an array of ids of the elements to set the value of in the list item
 * @returns void
 * @ignore
 */
function recreateBoundList(arr, element, overwrite, listItemId) {
    var _a, _b;
    //hide current element
    element.style.display = "none";
    const sibs = [];
    let n = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.firstChild;
    for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== element)
            sibs.push(n);
    }
    if (sibs.length > arr.length) {
        //remove extra siblings
        sibs.slice(arr.length).forEach((v) => {
            v.remove();
        });
    }
    else if (sibs.length < arr.length) {
        //add the extra siblings
        for (let i = sibs.length; i < arr.length; i++) {
            let clone = element.cloneNode(true);
            for (let id of listItemId) {
                const el = clone.querySelector(`#${id}`);
                if (el && elementHasValue(el)) {
                    el.value = arr[i];
                }
                else if (el) {
                    el.innerHTML = arr[i];
                }
            }
            cloneEventListeners(element, clone);
            sibs.push(clone);
            (_b = element.parentElement) === null || _b === void 0 ? void 0 : _b.appendChild(clone);
        }
    }
    //replace the value of the siblings with the value in the array
    arr.forEach((v, i) => {
        sibs[i].style.display = element.getAttribute("original-display") || "";
        if (sibs[i] instanceof HTMLOptionElement) {
            sibs[i].value = v;
            sibs[i].text = v;
        }
        else if (element instanceof HTMLButtonElement) {
            sibs[i].innerHTML = v;
            sibs[i].value = v;
        }
        else if (elementHasValue(sibs[i]))
            sibs[i].value = v;
        else if (overwrite)
            sibs[i].innerHTML = v;
    });
}
const boundProxyRebuild = new eventsubject_1.EventSubject();
/**
 * @description Creates a proxy object that will update the bound list when the array is modified
 * @param array the array to proxy
 * @param element the element to bind the array to
 * @returns Proxy
 * @ignore
 */
function boundProxyFactory(array) {
    return new Proxy(array, {
        set(target, prop, value) {
            if (prop !== "length") {
                target[prop] = value;
                boundProxyRebuild.next();
                //recreateBoundList(target, element);
            }
            return true;
        },
        get(target, prop) {
            let ops = [
                "fill",
                "copyWithin",
                "push",
                "pop",
                "reverse",
                "shift",
                "slice",
                "sort",
                "splice",
                "unshift",
            ];
            if (ops.indexOf(prop) !== -1) {
                const origMethod = target[prop];
                return function (...args) {
                    origMethod.apply(target, args);
                    boundProxyRebuild.next();
                    //recreateBoundList(target, element);
                };
            }
            return target[prop];
        },
    });
}
// Actual implementation, should not be in documentation as the overloads capture the two cases
/**@ignore */
function BindStyle(id, style, transform = (value) => value) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            //replace the style tag with the new value
            if (value !== undefined)
                element.style[style] = transform.call(this, value);
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, (value) => {
                    element.style[style] = transform.call(this, value);
                });
            }
            else {
                hookProperty(this, context.name, value, (value) => {
                    element.style[style] = transform.call(this, value);
                });
            }
        });
    };
}
exports.BindStyle = BindStyle;
// Actual implementation, should not be in documentation as the overloads capture the two cases
/**@ignore */
function BindCSSClass(id, transform = (value) => value) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            if (value !== undefined) {
                let valArray = transform
                    .call(this, value)
                    .split(" ")
                    .filter((v) => v.length > 0);
                if (valArray.length > 0)
                    element.className = valArray.join(" ");
            }
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, (value) => {
                    let origValue = context.access.get(this);
                    let currentList;
                    if (origValue) {
                        currentList = transform
                            .call(this, origValue)
                            .split(" ")
                            .filter((v) => v.length > 0);
                        if (currentList.length > 0)
                            currentList.forEach((v) => (element.className =
                                element.className.replace(v, "")));
                    }
                    let newClasses = transform
                        .call(this, value)
                        .split(" ")
                        .filter((v) => v.length > 0);
                    if (newClasses.length > 0)
                        newClasses.forEach((v) => (element.className += ` ${v}`));
                }, true);
            }
            else {
                hookProperty(this, context.name, value, (value) => {
                    let origValue = context.access.get(this);
                    let currentList;
                    if (origValue) {
                        currentList = transform
                            .call(this, origValue)
                            .split(" ")
                            .filter((v) => v.length > 0);
                        if (currentList.length > 0)
                            currentList.forEach((v) => (element.className =
                                element.className.replace(v, "")));
                    }
                    let newClasses = transform
                        .call(this, value)
                        .split(" ")
                        .filter((v) => v.length > 0);
                    if (newClasses.length > 0)
                        newClasses.forEach((v) => (element.className += ` ${v}`));
                }, true);
            }
        });
    };
}
exports.BindCSSClass = BindCSSClass;
// Actual implementation, should not be in documentation as the overloads capture the two cases
function BindValue(id, transform = (value) => value) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            if (element instanceof HTMLOptionElement) {
                element.value = transform.call(this, value);
                element.text = transform.call(this, value);
            }
            else if (element instanceof HTMLButtonElement) {
                element.innerHTML = transform.call(this, value);
                element.value = transform.call(this, value);
            }
            else if (value !== undefined) {
                if (elementHasValue(element))
                    element.value = transform.call(this, value);
                else
                    element.innerHTML = transform.call(this, value);
            }
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, (value) => {
                    if (element instanceof HTMLOptionElement) {
                        element.value =
                            transform.call(this, value);
                        element.text = transform.call(this, value);
                    }
                    else if (element instanceof HTMLButtonElement) {
                        element.innerHTML =
                            transform.call(this, value);
                        element.value = transform.call(this, value);
                    }
                    else if (elementHasValue(element))
                        element.value =
                            transform.call(this, value);
                    else
                        element.innerHTML = transform.call(this, value);
                });
            }
            else {
                hookProperty(this, context.name, value, (value) => {
                    if (element instanceof HTMLOptionElement) {
                        element.value =
                            transform.call(this, value);
                        element.text = transform.call(this, value);
                    }
                    else if (element instanceof HTMLButtonElement) {
                        element.innerHTML =
                            transform.call(this, value);
                        element.value = transform.call(this, value);
                    }
                    else if (elementHasValue(element))
                        element.value =
                            transform.call(this, value);
                    else
                        element.innerHTML = transform.call(this, value);
                });
            }
        });
    };
}
exports.BindValue = BindValue;
// Actual implementation, should not be in documentation as the overloads capture the two cases
function BindAttribute(id, attribute, transform = (value) => value) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            let setfn;
            setfn = (value) => {
                let val = transform.call(this, value);
                if (val !== "") {
                    if (attribute === "checked") {
                        element.checked = true;
                    }
                    else {
                        element.setAttribute(attribute, val);
                    }
                }
                else {
                    if (attribute === "checked") {
                        element.checked = false;
                    }
                    else {
                        element.removeAttribute(attribute);
                    }
                }
            };
            if (value !== undefined)
                setfn(value);
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, setfn);
            }
            else {
                hookProperty(this, context.name, value, setfn);
            }
        });
    };
}
exports.BindAttribute = BindAttribute;
//implementation
function BindList(id, transform = (value) => value, replaceInnerHtml = true, listItemId = []) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            if (element.parentElement &&
                element.parentElement.children.length !== 1)
                throw new Error("lists must be bound to elements that are only children of their parent");
            element.setAttribute("original-display", element.style.display);
            const value = context.access.get(this);
            const privateKey = getPrivateKey(context.name);
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const setfn = (value) => {
                recreateBoundList(transform.call(this, value), element, replaceInnerHtml, listItemId);
                boundProxyRebuild.subscribe(() => {
                    recreateBoundList(transform.call(this, value), element, replaceInnerHtml, listItemId);
                });
                this[privateKey] = boundProxyFactory(value);
            };
            setfn(value);
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, (value) => {
                    boundProxyRebuild.subscribe(() => {
                        recreateBoundList(transform.call(this, value), element, replaceInnerHtml, listItemId);
                    });
                    boundProxyFactory(value);
                    //recreateBoundList(transform.call(this, value));
                });
            }
            else {
                hookProperty(this, context.name, value, setfn);
            }
        });
    };
}
exports.BindList = BindList;
// Wrapper methods for specific operations
/**
 * @description Decorator to bind the cssClassName property if the boolean property is true
 * @param id the element to bind the property to
 * @param cssClassName the class name to add
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will add the css class myCSSClass to the div with id myDiv if the enabled property is true
 * @BindCSSClassToBoolean("myDiv", "myCSSClass")
 * public enabled: boolean = true;
 */
function BindCSSClassToBoolean(id, cssClassName) {
    return BindCSSClass(id, (value) => (value ? cssClassName : ""));
}
exports.BindCSSClassToBoolean = BindCSSClassToBoolean;
/**
 * @description Decorator to bind the disabled attribute of an element to a boolean
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will disable the button with id myButton if the disabled property is true
 * @BindDisabledToBoolean("myButton")
 * public disabled: boolean = true;
 */
function BindDisabledToBoolean(id) {
    return BindAttribute(id, "disabled", (value) => value ? "disabled" : "");
}
exports.BindDisabledToBoolean = BindDisabledToBoolean;
/**
 * @description Decorator to bind the visibility of an element to a boolean
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will hide the div with id myDiv1 if the visible property is false
 * @BindVisibleToBoolean("myDiv1")
 * public visible: boolean = true;
 */
function BindVisibleToBoolean(id) {
    return BindStyle(id, "display", (value) => value ? "block" : "none");
}
exports.BindVisibleToBoolean = BindVisibleToBoolean;
/**
 * @description Decorator to bind the checked/unchecked value of a checkbox input to a boolean
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will check the checkbox with id myCheckbox if the checked property is true
 * @BindCheckedToBoolean("myCheckbox")
 * public checked: boolean = true;
 */
function BindCheckedToBoolean(id) {
    return BindAttribute(id, "checked", (value) => value ? "checked" : "");
}
exports.BindCheckedToBoolean = BindCheckedToBoolean;
/**
 * @description Decorator to bind the value of an element to a number
 * @param id the element to bind the property to
 * @param append an optional string to append to the number before setting the value
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will bind the text (value) of the div with id myDiv1 to the number in value
 * @BindValueToNumber("myDiv1")
 * public value: number = 100;
 */
function BindValueToNumber(id, append = "") {
    return BindValue(id, (value) => `${value}${append}`);
}
exports.BindValueToNumber = BindValueToNumber;
/**
 * @description Decorator to bind a specific style to a number, and optionally append a string to the value
 * @param id the element to bind the property to
 * @param style the style to bind (i.e. background-color, left, top, etc.)
 * @Param optional string to append to the number before setting the value
 * @returns DecoratorCallback
 * @overload
 * @export
 * @group Bind Decorators
 * @example
 * //This will set the width of the div to the number in width
 * @BindStyleToNumber("myDiv", "width","%")
 * public width: number = 100;
 */
function BindStyleToNumber(id, style, append = "") {
    return BindStyle(id, style, (value) => `${value}${append}`);
}
exports.BindStyleToNumber = BindStyleToNumber;
/**
 * @description Decorator to bind a specific style to a number, and append a 'px' to the value
 * @param id the element to bind the property to
 * @param style the style to bind (i.e. background-color, left, top, etc.)
 * @returns DecoratorCallback
 * @overload
 * @export
 * @group Bind Decorators
 * @example
 * //This will set the width of the div to the number in width
 * @BindStyleToNumberAppendPx("myDiv", "width")
 * public width: number = 100;
 */
function BindStyleToNumberAppendPx(id, style) {
    return BindStyleToNumber(id, style, "px");
}
exports.BindStyleToNumberAppendPx = BindStyleToNumberAppendPx;


/***/ }),

/***/ "./node_modules/@boots-edu/webz/bootstrap.js":
/*!***************************************************!*\
  !*** ./node_modules/@boots-edu/webz/bootstrap.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bootstrap = void 0;
/** @hidden */
function bootstrap(target, testModeHTML = "", ...args) {
    if (testModeHTML.length > 0) {
        window.document.body.innerHTML = testModeHTML;
    }
    let obj = Object.assign(new target(...args));
    const element = window.document.getElementById("main-target");
    if (element)
        obj.appendToDomElement(element);
    else
        obj.appendToDomElement(window.document.body);
    return obj;
}
exports.bootstrap = bootstrap;


/***/ }),

/***/ "./node_modules/@boots-edu/webz/event.decorators.js":
/*!**********************************************************!*\
  !*** ./node_modules/@boots-edu/webz/event.decorators.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Timer = exports.Input = exports.Change = exports.Blur = exports.Click = exports.WindowEvent = exports.GenericEvent = void 0;
/**
 * @description Decorator to bind a generic event to an element
 * @param htmlElementID the element to bind the event to
 * @param type the event to bind
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * @GenericEvent("myButton", "click")
 * myButtonClick(e: MouseEvent) {
 *    console.log("Button was clicked");
 * }
 */
function GenericEvent(htmlElementID, type) {
    return function (target, context) {
        context.addInitializer(function () {
            let element = this["shadow"].getElementById(htmlElementID);
            if (element) {
                element.addEventListener(type, (e) => {
                    if (type === "input" || type === "change")
                        if (element.type === "checkbox") {
                            e.value =
                                element.checked ?
                                    "on"
                                    : "";
                        }
                        else {
                            e.value = element.value;
                        }
                    target.call(this, e);
                });
            }
        });
    };
}
exports.GenericEvent = GenericEvent;
/**
 * @description Decorator to bind a window event to the window
 * @param type the event to bind
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * @WindowEvent("resize")
 * onResize(e: WindowEvent) {
 *   console.log("Window was resized");
 * }
 */
function WindowEvent(type) {
    return function (target, context) {
        context.addInitializer(function () {
            window.addEventListener(type, (e) => {
                target.call(this, e);
            });
        });
    };
}
exports.WindowEvent = WindowEvent;
/**
 * @description Decorator to bind a click event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * @Click("myButton")
 * myButtonClick(e: MouseEvent) {
 *   console.log("Button was clicked");
 * }
 */
function Click(htmlElementID) {
    return GenericEvent(htmlElementID, "click");
}
exports.Click = Click;
/**
 * @description Decorator to bind a blur event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * @Blur("myInput")
 * myInputBlur(e: FocusEvent) {
 *  console.log("Input lost focus");
 * }
 */
function Blur(htmlElementID) {
    return GenericEvent(htmlElementID, "blur");
}
exports.Blur = Blur;
/**
 * @description Decorator to bind a change event to an element.  For checkboxes, this will return "on" when checked or "" when unchecked.
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * @Change("myInput")
 * myInputChange(e: ChangeEvent) {
 *   console.log("Input changed");
 */
function Change(htmlElementID) {
    return GenericEvent(htmlElementID, "change");
}
exports.Change = Change;
/**
 * @description Decorator to bind an input event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * @Input("myInput")
 * myInputChange(e: InputEvent) {
 *  console.log("Input changed");
 * }
 */
function Input(htmlElementID) {
    return GenericEvent(htmlElementID, "input");
}
exports.Input = Input;
/**
 * @description Decorator to call a method periodically with a timer
 * @param intervalMS the interval in milliseconds to call the method
 * @returns DecoratorCallback
 * @note This executes repeatedly.  The decorated function is passed a cancel function that can be called to stop the timer.
 * @export
 * @group Event Decorators
 * @example
 * let counter=0;
 * @Timer(1000)
 * myTimerMethod(cancel: TimerCancelMethod) {
 *   console.log("Timer method called once per second");
 *   if (counter++ > 5) cancel();
 */
function Timer(intervalMS) {
    return function (target, context) {
        context.addInitializer(function () {
            const intervalID = setInterval(() => {
                target.call(this, () => {
                    clearInterval(intervalID);
                });
            }, intervalMS);
        });
    };
}
exports.Timer = Timer;


/***/ }),

/***/ "./node_modules/@boots-edu/webz/eventsubject.js":
/*!******************************************************!*\
  !*** ./node_modules/@boots-edu/webz/eventsubject.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventSubject = void 0;
/**
 * EventSubject
 * @description A class for creating event subjects
 * @export
 * @class EventSubject
 * @group Async Event Sources
 */
class EventSubject {
    constructor() {
        this.refCount = 0;
        this.callbacks = [];
        this.errorFns = [];
    }
    /**
     * Subscribe to the event subject
     * @param callback The callback to call when the event is triggered
     * @param error The callback to call when an error is triggered
     * @returns The id of the subscription
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value:number) => {
     *  console.log(value);
     * });
     * subject.next(1);
     * subject.unsubscribe(id);
     */
    subscribe(callback, error) {
        this.callbacks.push({ id: this.refCount, fn: callback });
        if (error)
            this.errorFns.push({ id: this.refCount, fn: error });
        return this.refCount++;
    }
    /**
     * Unsubscribe from the event subject
     * @param id The id of the subscription to remove
     * @returns void
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value:number) => {
     *   console.log(value);
     * });
     * subject.next(1);
     * subject.unsubscribe(id);
     */
    unsubscribe(id) {
        this.callbacks = this.callbacks.filter((cb) => cb.id !== id);
        this.errorFns = this.errorFns.filter((cb) => cb.id !== id);
    }
    /**
     * Trigger the event subject
     * @param value The value to pass to the callback
     * @returns void
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value:number) => {
     *   console.log(value);
     * });
     * subject.next(1);
     * subject.unsubscribe(id);
     */
    next(value) {
        for (const callback of this.callbacks)
            callback.fn(value);
    }
    /**
     * Trigger the error event subject
     * @param value The value to pass to the callback
     * @returns void
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value:number) => {
     *   console.log(value);
     * }, (error) => {
     *  console.error(error);
     * });
     * subject.error(new Error("It doesnt't work!"));
     * subject.unsubscribe(id);
     */
    error(value) {
        for (const errorFn of this.errorFns)
            errorFn.fn(value);
    }
    /**
     * Convert the event subject to a promise
     * @description Convert the event subject to a promise.
     * This is useful for the async/await style async pattern.
     * @returns Promise<T>
     * @example
     * async myFunction() {
     *   const result=await WebzDialog.popup(
     *     "Hello World",
     *     "Alert", ["Ok","Cancel"]).toPromise();
     *   console.log(result);
     * }
     */
    toPromise() {
        return new Promise((resolve, reject) => {
            this.subscribe((value) => {
                resolve(value);
            }, (error) => {
                reject(error);
            });
        });
    }
}
exports.EventSubject = EventSubject;


/***/ }),

/***/ "./node_modules/@boots-edu/webz/index.js":
/*!***********************************************!*\
  !*** ./node_modules/@boots-edu/webz/index.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./bind.decorators */ "./node_modules/@boots-edu/webz/bind.decorators.js"), exports);
__exportStar(__webpack_require__(/*! ./event.decorators */ "./node_modules/@boots-edu/webz/event.decorators.js"), exports);
__exportStar(__webpack_require__(/*! ./WebzComponent */ "./node_modules/@boots-edu/webz/WebzComponent.js"), exports);
__exportStar(__webpack_require__(/*! ./WebzDialog */ "./node_modules/@boots-edu/webz/WebzDialog.js"), exports);
__exportStar(__webpack_require__(/*! ./WebzRouter */ "./node_modules/@boots-edu/webz/WebzRouter.js"), exports);
__exportStar(__webpack_require__(/*! ./eventsubject */ "./node_modules/@boots-edu/webz/eventsubject.js"), exports);
__exportStar(__webpack_require__(/*! ./bootstrap */ "./node_modules/@boots-edu/webz/bootstrap.js"), exports);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./styles.css":
/*!**********************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./styles.css ***!
  \**********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/*Put your global styles here.  
* Individual components can be styled locatlly
*/

/* Add your global styles here */
/* Note you cannot use url's in this file, you must put those in the component's css file 
* or put a new css file in the assets directory and add it to the head element
* of the index.html file if you need them to be global.
*/

body {
    padding: 0;
    margin: 0;
}
`, "",{"version":3,"sources":["webpack://./styles.css"],"names":[],"mappings":"AAAA;;CAEC;;AAED,gCAAgC;AAChC;;;CAGC;;AAED;IACI,UAAU;IACV,SAAS;AACb","sourcesContent":["/*Put your global styles here.  \n* Individual components can be styled locatlly\n*/\n\n/* Add your global styles here */\n/* Note you cannot use url's in this file, you must put those in the component's css file \n* or put a new css file in the assets directory and add it to the head element\n* of the index.html file if you need them to be global.\n*/\n\nbody {\n    padding: 0;\n    margin: 0;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/app/main.component.css":
/*!************************************!*\
  !*** ./src/app/main.component.css ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#header {\n    display: flex;\n    flex-direction: row;\n    color: black;\n}\n#header .left {\n    flex: 1;\n    color: white;\n    line-height: 50px;\n    padding-left: 30px;\n    font-size: 35px;\n    font-style: italic;\n    font-weight: bold;\n    text-shadow: 2px 2px 4px silver;\n}\n.lander-container {\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    display: flex;\n    flex-direction: column;\n    background-color: black;\n    background-image: url(assets/bg2.jpg);\n    background-size: cover;\n}\n#header {\n    height: 50px;\n    margin: 0;\n    width: 100%;\n}\n#header button {\n    padding-top: 3px;\n    padding-bottom: 3px;\n    margin: 0;\n}\n#header .right {\n    margin-top: 0;\n    padding-top: 0;\n    padding-right: 10px;\n    line-height: 50px;\n}\n\n#content {\n    position: relative;\n    flex: 1;\n    overflow: hidden;\n    padding: 0;\n}\n#terrain {\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    height: 150px;\n}\n#start {\n    margin-top: 15px;\n    margin-right: 20px;\n}\n\n.disabledContent,\n.disabledContent:hover {\n    cursor: not-allowed;\n    background-color: rgb(229, 229, 229) !important;\n    pointer-events: none;\n}\n\n.disabledContent * {\n    pointer-events: none;\n}\n#hud {\n    position: absolute;\n    top: 10px;\n    width: 270px;\n    right: 10px;\n    height: 95px;\n}\n");

/***/ }),

/***/ "./src/app/objects/hud/hud.component.css":
/*!***********************************************!*\
  !*** ./src/app/objects/hud/hud.component.css ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".hud-container {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    color: white;\n    border: solid 1px white;\n    border-radius: 10px;\n    z-index: 1;\n}\n\n.hud-border {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    color: white;\n    border: solid 1px white;\n    border-radius: 10px;\n    background: gray;\n    opacity: 30%;\n    z-index: 0;\n}\n#hud {\n    position: absolute;\n    top: 5px;\n    left: 5px;\n    right: 5px;\n    bottom: 5px;\n    color: white;\n    border: solid 1px white;\n    border-radius: 10px;\n    opacity: 100%;\n    display: flex;\n    flex-direction: row;\n}\n.hud-left,\n.hud-right {\n    text-align: left;\n    vertical-align: middle;\n    padding: 5px;\n    font-size: 12px;\n    overflow: hidden;\n}\n.hud-right {\n    flex: 1;\n}\n\n.hud-left {\n    border-right: 1px solid white;\n    width: 130px;\n}\n.hud-left,\n.hud-right,\n.hud-left > div,\n.hud-right > div {\n    display: inline-block;\n}\n\n.warning {\n    color: yellow;\n}\n.danger {\n    color: red;\n    font-weight: bold;\n}\n");

/***/ }),

/***/ "./src/app/objects/lander/lander.component.css":
/*!*****************************************************!*\
  !*** ./src/app/objects/lander/lander.component.css ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".lander-holder {\n    /*actual 50px;*/\n    height: 60px;\n    width: 65px;\n    position: absolute;\n\n    background-repeat: no-repeat;\n    background-size: contain;\n}\n#flame {\n    position: absolute;\n    bottom: 0;\n    left: 50%;\n    transform: translateX(-39%);\n    width: 10px;\n    height: 15px;\n    background-image: url(assets/flame.png);\n    background-repeat: no-repeat;\n    background-size: cover;\n}\n");

/***/ }),

/***/ "./src/app/objects/terrain/terrain.component.css":
/*!*******************************************************!*\
  !*** ./src/app/objects/terrain/terrain.component.css ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".outside {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n}\n\n.terrain {\n    background-image: url(assets/ground.jpg);\n}\n");

/***/ }),

/***/ "./src/app/main.component.html":
/*!*************************************!*\
  !*** ./src/app/main.component.html ***!
  \*************************************/
/***/ ((module) => {

module.exports = "<div class=\"lander-container\">\n    <div id=\"header\">\n        <div class=\"left\">WebEZ Lander Game</div>\n        <div class=\"right\">\n            <button id=\"start\" class=\"btn btn-success\">Start Game</button>\n        </div>\n    </div>\n    <div id=\"content\">\n        <div id=\"terrain\"></div>\n        <div id=\"hud\"></div>\n    </div>\n</div>\n";

/***/ }),

/***/ "./src/app/objects/hud/hud.component.html":
/*!************************************************!*\
  !*** ./src/app/objects/hud/hud.component.html ***!
  \************************************************/
/***/ ((module) => {

module.exports = "<div class=\"hud-border\"></div>\n<div class=\"hud-container\">\n    <div id=\"hud\">\n        <div class=\"hud-left\">\n            X DeltaV:\n            <div id=\"deltax\">0</div>\n            <br />\n            Y DeltaV:\n            <div id=\"deltay\">0</div>\n            <br />\n            Alt: (msl):\n            <div id=\"altitudemsl\">0</div>\n            <br />\n            Alt: (ground):\n            <div id=\"altitudeterrain\">0</div>\n        </div>\n        <div class=\"hud-right\">\n            Fuel:\n            <div id=\"fuel\">1000</div>\n            <br />\n            Time:\n            <div id=\"time\">0</div>\n            <br />Rotation (deg):\n            <div id=\"rotation\">0</div>\n            <br />Status:\n            <div id=\"status\">flying</div>\n        </div>\n    </div>\n</div>\n";

/***/ }),

/***/ "./src/app/objects/lander/lander.component.html":
/*!******************************************************!*\
  !*** ./src/app/objects/lander/lander.component.html ***!
  \******************************************************/
/***/ ((module) => {

module.exports = "<div id=\"lander\" class=\"lander-holder\">\n    <div id=\"flame\"></div>\n</div>\n";

/***/ }),

/***/ "./src/app/objects/terrain/terrain.component.html":
/*!********************************************************!*\
  !*** ./src/app/objects/terrain/terrain.component.html ***!
  \********************************************************/
/***/ ((module) => {

module.exports = "<div class=\"outside\">\n    <div id=\"terrain\" class=\"terrain-holder\"></div>\n</div>\n";

/***/ }),

/***/ "./styles.css":
/*!********************!*\
  !*** ./styles.css ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!./node_modules/css-loader/dist/cjs.js!./styles.css */ "./node_modules/css-loader/dist/cjs.js!./styles.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/app/globals.ts":
/*!****************************!*\
  !*** ./src/app/globals.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Globals = void 0;
/**
 * Global constants used in the game.
 */
exports.Globals = {
    LANDER_ROTATION_SPEED: 10,
    LANDER_FUEL_CAPACITY: 100,
    LANDER_FUEL_CONSUMPTION: 1,
    THRUST_MULTIPLIER: 2,
    GRAVITY: 1,
    TERRAIN_PART_WIDTH: 100,
    TERRAIN_GOOD_DIFFERENCE: 5,
    TERRAIN_GOOD_VELOCITYX: 3,
    TERRAIN_GOOD_VELOCITYY: 7,
};


/***/ }),

/***/ "./src/app/main.component.ts":
/*!***********************************!*\
  !*** ./src/app/main.component.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MainComponent = void 0;
const main_component_html_1 = __importDefault(__webpack_require__(/*! ./main.component.html */ "./src/app/main.component.html"));
const main_component_css_1 = __importDefault(__webpack_require__(/*! ./main.component.css */ "./src/app/main.component.css"));
const webz_1 = __webpack_require__(/*! @boots-edu/webz */ "./node_modules/@boots-edu/webz/index.js");
const lander_component_1 = __webpack_require__(/*! ./objects/lander/lander.component */ "./src/app/objects/lander/lander.component.ts");
const terrain_component_1 = __webpack_require__(/*! ./objects/terrain/terrain.component */ "./src/app/objects/terrain/terrain.component.ts");
const utils_1 = __webpack_require__(/*! ./objects/utils */ "./src/app/objects/utils.ts");
const hud_component_1 = __webpack_require__(/*! ./objects/hud/hud.component */ "./src/app/objects/hud/hud.component.ts");
/**
 * Main Component
 * @description The main component of the game
 * @class
 * @extends EzComponent
 * @method startGame - Starts the game
 * @method setupGame - Sets up the game
 * @property {LanderComponent} lander - The lander object
 * @property {TerrainComponent} terrain - The terrain object
 * @property {HudComponent} hud - The hud object
 */
let MainComponent = (() => {
    var _a;
    let _classSuper = webz_1.WebzComponent;
    let _instanceExtraInitializers = [];
    let __terrainHeight_decorators;
    let __terrainHeight_initializers = [];
    let __terrainHeight_extraInitializers = [];
    let __startClass_decorators;
    let __startClass_initializers = [];
    let __startClass_extraInitializers = [];
    let _startGame_decorators;
    return _a = class MainComponent extends _classSuper {
            /**
             * @description The constructor of the MainComponent
             * @summary Creates the main component
             * @memberof MainComponent
             * @constructor
             */
            constructor() {
                super(main_component_html_1.default, main_component_css_1.default);
                this.lander = __runInitializers(this, _instanceExtraInitializers);
                this.hud = new hud_component_1.HudComponent();
                /**
                 * @description The height of the terrain
                 * @type {string}
                 * @default "150"
                 * @summary The height of the terrain
                 * @summary Binds to the terrain component's height
                 * @summary Appends "px" to the value
                 */
                this._terrainHeight = __runInitializers(this, __terrainHeight_initializers, 150);
                /**
                 * @description The class of the start button (for disabling)
                 * @type {string}
                 * @default ""
                 * @summary The class of the start button
                 * @summary Binds to the start button's class (adds disableContent)
                 */
                this._startClass = (__runInitializers(this, __terrainHeight_extraInitializers), __runInitializers(this, __startClass_initializers, ""));
                __runInitializers(this, __startClass_extraInitializers);
                this.terrain = new terrain_component_1.TerrainComponent(this._terrainHeight);
                this.lander = new lander_component_1.LanderComponent(this.terrain.terrainItems, this.hud);
                this.addComponent(this.terrain, "terrain");
                this.addComponent(this.lander, "content");
                this.addComponent(this.hud, "hud");
                this.setupGame();
            }
            /**
             * @description Starts the game
             * @summary Starts the game
             * @method
             * @memberof MainComponent
             * @summary Binds to start button click event
             */
            startGame() {
                if (this._startClass === "disabledContent")
                    return;
                this._startClass = "disabledContent";
                this.lander.startFlying();
            }
            /**
             * @description Sets up the game
             * @summary Sets up the game.  Shows the help screen, then subscribes to the game over event
             * @method
             * @memberof MainComponent
             * @async
             */
            setupGame() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield webz_1.WebzDialog.popup(this, "Use the <em><b>'A'</b></em> and <em><b>'D'</b></em> keys to rotate the lander.<br/> Use the 'Space Bar' to thrust. <br/>Land on a flat area!<br/><br/>Good Luck!!!", "Welcome to Lunar Lander!", ["Play Game"], "btn btn-success").toPromise();
                    this.lander.gameOver.subscribe((status) => {
                        let title = "";
                        if (status === utils_1.GameStatus.Crash) {
                            title = "You crashed!";
                        }
                        else if (status === utils_1.GameStatus.Orbit) {
                            title = "You have achieved escape velocity!";
                        }
                        else if (status === utils_1.GameStatus.Miss) {
                            title = "You left the landing zone!";
                        }
                        else if (status === utils_1.GameStatus.Land) {
                            title = "You landed!";
                        }
                        webz_1.WebzDialog.popup(this, "Try again?", title, ["Yes", "No"], "btn btn-primary").subscribe((response) => {
                            if (response === "Yes") {
                                this._startClass = "";
                                this.startGame();
                            }
                            else {
                                this._startClass = "";
                            }
                        });
                    });
                });
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            __terrainHeight_decorators = [(0, webz_1.BindStyleToNumberAppendPx)("terrain", "height")];
            __startClass_decorators = [(0, webz_1.BindCSSClass)("start")];
            _startGame_decorators = [(0, webz_1.Click)("start")];
            __esDecorate(_a, null, _startGame_decorators, { kind: "method", name: "startGame", static: false, private: false, access: { has: obj => "startGame" in obj, get: obj => obj.startGame }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, __terrainHeight_decorators, { kind: "field", name: "_terrainHeight", static: false, private: false, access: { has: obj => "_terrainHeight" in obj, get: obj => obj._terrainHeight, set: (obj, value) => { obj._terrainHeight = value; } }, metadata: _metadata }, __terrainHeight_initializers, __terrainHeight_extraInitializers);
            __esDecorate(null, null, __startClass_decorators, { kind: "field", name: "_startClass", static: false, private: false, access: { has: obj => "_startClass" in obj, get: obj => obj._startClass, set: (obj, value) => { obj._startClass = value; } }, metadata: _metadata }, __startClass_initializers, __startClass_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.MainComponent = MainComponent;


/***/ }),

/***/ "./src/app/objects/hud/hud.component.ts":
/*!**********************************************!*\
  !*** ./src/app/objects/hud/hud.component.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HudComponent = void 0;
const webz_1 = __webpack_require__(/*! @boots-edu/webz */ "./node_modules/@boots-edu/webz/index.js");
const hud_component_html_1 = __importDefault(__webpack_require__(/*! ./hud.component.html */ "./src/app/objects/hud/hud.component.html"));
const hud_component_css_1 = __importDefault(__webpack_require__(/*! ./hud.component.css */ "./src/app/objects/hud/hud.component.css"));
const utils_1 = __webpack_require__(/*! ../utils */ "./src/app/objects/utils.ts");
const globals_1 = __webpack_require__(/*! ../../globals */ "./src/app/globals.ts");
/**
 * @description The HUD component (Heads up display)
 * @class
 * @extends WebzComponent
 * @method resetFlags - Resets the flags
 * @property {string} Velocity - The velocity of the lander
 * @property {string} flagRotation - The flag for the rotation
 * @property {string} flagDeltaV - The flag for the horizontal velocity
 * @property {string} flagVVelocity - The flag for the vertical velocity
 * @property {string} flagAltitude - The flag for the altitude
 * @property {string} AltitudeMSL - The altitude above mean sea level
 * @property {string} AltitudeTerrain - The altitude above terrain
 * @property {string} Fuel - The fuel remaining
 * @property {string} Time - The time remaining
 * @property {string} Rotation - The rotation of the lander
 * @property {string} status - The status of the lander
 * @
 */
let HudComponent = (() => {
    var _a;
    let _classSuper = webz_1.WebzComponent;
    let __horizDeltaV_decorators;
    let __horizDeltaV_initializers = [];
    let __horizDeltaV_extraInitializers = [];
    let __vertDeltaV_decorators;
    let __vertDeltaV_initializers = [];
    let __vertDeltaV_extraInitializers = [];
    let __flagRotation_decorators;
    let __flagRotation_initializers = [];
    let __flagRotation_extraInitializers = [];
    let __flagDeltaV_decorators;
    let __flagDeltaV_initializers = [];
    let __flagDeltaV_extraInitializers = [];
    let __flagVVelocity_decorators;
    let __flagVVelocity_initializers = [];
    let __flagVVelocity_extraInitializers = [];
    let __flagAltitude_decorators;
    let __flagAltitude_initializers = [];
    let __flagAltitude_extraInitializers = [];
    let __altMSL_decorators;
    let __altMSL_initializers = [];
    let __altMSL_extraInitializers = [];
    let __altTerain_decorators;
    let __altTerain_initializers = [];
    let __altTerain_extraInitializers = [];
    let __fuelWarning_decorators;
    let __fuelWarning_initializers = [];
    let __fuelWarning_extraInitializers = [];
    let __fuel_decorators;
    let __fuel_initializers = [];
    let __fuel_extraInitializers = [];
    let __time_decorators;
    let __time_initializers = [];
    let __time_extraInitializers = [];
    let __rotation_decorators;
    let __rotation_initializers = [];
    let __rotation_extraInitializers = [];
    let __status_decorators;
    let __status_initializers = [];
    let __status_extraInitializers = [];
    return _a = class HudComponent extends _classSuper {
            /**
             * @description The velocity of the lander as a vector
             * @type {{x: number; y: number}}
             * @default {x: 0, y: 0}
             * @summary The velocity of the lander as a vector
             */
            set Velocity(value) {
                this._horizDeltaV = value.x.toFixed(0);
                this._vertDeltaV = value.y.toFixed(0);
            }
            /**
             * @description The flag for the rotation
             * @type {boolean}
             * @default false
             * @summary The flag for the rotation
             * @summary Sets the color of the rotation display text
             */
            set flagRotation(value) {
                this._flagRotation = value ? "red" : "white";
            }
            /**
             * @description The flag for the horizontal velocity
             * @type {boolean}
             * @default false
             * @summary The flag for the horizontal velocity
             * @summary Sets the color of the horizontal velocity display text
             */
            set flagHVelocity(value) {
                this._flagDeltaV = value ? "red" : "white";
            }
            /**
             * @description The flag for the vertical velocity
             * @type {boolean}
             * @default false
             * @summary The flag for the vertical velocity sets the color of the vertical velocity display text to red or white
             */
            set flagVVelocity(value) {
                this._flagVVelocity = value ? "red" : "white";
            }
            /**
             * @description The flag for the altitude
             * @type {boolean}
             * @default false
             * @summary The flag for the altitude sets the color of the altitude display text to red or white
             */
            set flagAltitude(value) {
                this._flagAltitude = value ? "red" : "white";
            }
            /**
             * @description The altitude above msl
             * @type {number}
             * @summary The altitude above msl
             */
            set AltitudeMSL(value) {
                this._altMSL = value.toFixed(0);
            }
            /**
             * @description The altitude above terrain
             * @type {number}
             * @summary The altitude above terrain
             */
            set AltitudeTerrain(value) {
                this._altTerain = value.toFixed(0);
            }
            /**
             * @description The Fuel level
             * @type {number}
             * @summary The fuel level of the lander
             * @summary Sets the fuel level of the lander and sets the fuel warning color
             */
            set Fuel(value) {
                if (value < 10) {
                    this._fuelWarning = "danger";
                }
                else if (value < 40) {
                    this._fuelWarning = "warning";
                }
                else
                    this._fuelWarning = "";
                this._fuel = value.toFixed(0);
            }
            /**
             * @description The time elapsed
             * @type {number}
             * @summary The time elapsed
             */
            set Time(value) {
                this._time = value.toFixed(0);
            }
            /**
             * @description The rotation of the lander
             * @type {number}
             * @summary The rotation of the lander
             */
            set Rotation(value) {
                let val = value.toFixed(0);
                if (value > 180)
                    val = (value - 360).toFixed(0);
                this._rotation = val;
            }
            /**
             * @description The status of the lander
             * @type {GameStatus}
             * @summary The status of the lander
             */
            set status(value) {
                if (value === utils_1.GameStatus.Crash) {
                    this._status = "Crashed";
                }
                else if (value === utils_1.GameStatus.Orbit) {
                    this._status = "Orbit";
                }
                else if (value === utils_1.GameStatus.Miss) {
                    this._status = "Missed";
                }
                else if (value === utils_1.GameStatus.Land) {
                    this._status = "Landed";
                }
                else {
                    this._status = "Flying";
                }
            }
            /**
             * @description The constructor of the HudComponent
             * @summary Creates the HUD component
             * @memberof HudComponent
             * @constructor
             */
            constructor() {
                super(hud_component_html_1.default, hud_component_css_1.default);
                /** @description The deltaX display value
                 * @type {string}
                 * @default "0"
                 * @summary The deltaX display value
                 * @summary Binds to the deltaX element innerHTML
                 * @summary Appends " m/s" to the value
                 */
                this._horizDeltaV = __runInitializers(this, __horizDeltaV_initializers, "0");
                /**
                 * @description The deltaY display value
                 * @type {string}
                 * @default "0"
                 * @summary The deltaY display value
                 * @summary Binds to the deltaY element innerHTML
                 * @summary Appends " m/s" to the value
                 */
                this._vertDeltaV = (__runInitializers(this, __horizDeltaV_extraInitializers), __runInitializers(this, __vertDeltaV_initializers, "0"));
                /**
                 * @description THe rotation display color
                 * @type {string}
                 * @default "white"
                 */
                this._flagRotation = (__runInitializers(this, __vertDeltaV_extraInitializers), __runInitializers(this, __flagRotation_initializers, "white"));
                /**
                 * @description The color of the horizontal velocity display text
                 * @type {string}
                 * @default "white"
                 * @summary The color of the horizontal velocity display text
                 * @summary Sets the color of the horizontal velocity display text
                 */
                this._flagDeltaV = (__runInitializers(this, __flagRotation_extraInitializers), __runInitializers(this, __flagDeltaV_initializers, "white"));
                /**
                 * @description The color of the vertical velocity display text
                 * @type {string}
                 * @default "white"
                 * @summary The color of the vertical velocity display text
                 * @summary Sets the color of the vertical velocity display text
                 */
                this._flagVVelocity = (__runInitializers(this, __flagDeltaV_extraInitializers), __runInitializers(this, __flagVVelocity_initializers, "white"));
                /**
                 * @description The color for the altitude above terrain
                 * @type {string}
                 * @default false
                 */
                this._flagAltitude = (__runInitializers(this, __flagVVelocity_extraInitializers), __runInitializers(this, __flagAltitude_initializers, "white"));
                /**
                 * @description The altitude above mean sea level
                 * @type {string}
                 * @default 0
                 * @summary The altitude above mean sea level
                 * @summary Binds to the altitude above mean sea level element innerHTML
                 * @summary Appends " m" to the value
                 */
                this._altMSL = (__runInitializers(this, __flagAltitude_extraInitializers), __runInitializers(this, __altMSL_initializers, "0"));
                /**
                 * @description The altitude above terrain
                 * @type {string}
                 * @default 0
                 * @summary The altitude above terrain
                 * @summary Binds to the altitude above terrain element innerHTML
                 * @summary Appends " m" to the value
                 */
                this._altTerain = (__runInitializers(this, __altMSL_extraInitializers), __runInitializers(this, __altTerain_initializers, "0"));
                /**
                 * @description The fuel remaining warning color
                 * @type {string}
                 * @memberof HudComponent
                 * @summary Turns yellow or red on low fuel
                 * @summary Binds to the fuel element className
                 */
                this._fuelWarning = (__runInitializers(this, __altTerain_extraInitializers), __runInitializers(this, __fuelWarning_initializers, ""));
                /**
                 * @description The fuel remaining
                 * @type {string}
                 * @default "0"
                 * @summary The fuel remaining
                 * @summary Binds to the fuel element innerHTML
                 * @summary Appends " lbs" to the value
                 */
                this._fuel = (__runInitializers(this, __fuelWarning_extraInitializers), __runInitializers(this, __fuel_initializers, globals_1.Globals.LANDER_FUEL_CAPACITY.toString()));
                /**
                 * @description The time elapsed
                 * @type {string}
                 * @default "0"
                 * @summary The time elapsed
                 * @summary Binds to the time element innerHTML
                 * @summary Appends " s" to the value
                 */
                this._time = (__runInitializers(this, __fuel_extraInitializers), __runInitializers(this, __time_initializers, "0"));
                /**
                 * @description The rotation of the lander
                 * @type {string}
                 * @default "0"
                 * @summary The rotation of the lander
                 * @summary Binds to the rotation element innerHTML
                 */
                this._rotation = (__runInitializers(this, __time_extraInitializers), __runInitializers(this, __rotation_initializers, "0"));
                /**
                 * @description The status of the lander
                 * @type {string}
                 * @default "Waiting..."
                 * @summary The status of the lander
                 * @summary Binds to the status element innerHTML
                 */
                this._status = (__runInitializers(this, __rotation_extraInitializers), __runInitializers(this, __status_initializers, "Waiting..."));
                __runInitializers(this, __status_extraInitializers);
            }
            /**
             * @description Resets the flags
             * @summary Resets the flags (background colors of all items)
             * @memberof HudComponent
             */
            resetFlags() {
                this.flagAltitude = false;
                this.flagHVelocity = false;
                this.flagRotation = false;
                this.flagVVelocity = false;
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            __horizDeltaV_decorators = [(0, webz_1.BindValue)("deltax", (value) => value + " m/s")];
            __vertDeltaV_decorators = [(0, webz_1.BindValue)("deltay", (value) => value + " m/s")];
            __flagRotation_decorators = [(0, webz_1.BindStyle)("rotation", "color")];
            __flagDeltaV_decorators = [(0, webz_1.BindStyle)("deltax", "color")];
            __flagVVelocity_decorators = [(0, webz_1.BindStyle)("deltay", "color")];
            __flagAltitude_decorators = [(0, webz_1.BindStyle)("altitudeterrain", "color")];
            __altMSL_decorators = [(0, webz_1.BindValue)("altitudemsl", (value) => value + " m")];
            __altTerain_decorators = [(0, webz_1.BindValue)("altitudeterrain", (value) => value + " m")];
            __fuelWarning_decorators = [(0, webz_1.BindCSSClass)("fuel")];
            __fuel_decorators = [(0, webz_1.BindValue)("fuel", (value) => value + " lbs")];
            __time_decorators = [(0, webz_1.BindValue)("time", (value) => value + " s")];
            __rotation_decorators = [(0, webz_1.BindValue)("rotation")];
            __status_decorators = [(0, webz_1.BindValue)("status")];
            __esDecorate(null, null, __horizDeltaV_decorators, { kind: "field", name: "_horizDeltaV", static: false, private: false, access: { has: obj => "_horizDeltaV" in obj, get: obj => obj._horizDeltaV, set: (obj, value) => { obj._horizDeltaV = value; } }, metadata: _metadata }, __horizDeltaV_initializers, __horizDeltaV_extraInitializers);
            __esDecorate(null, null, __vertDeltaV_decorators, { kind: "field", name: "_vertDeltaV", static: false, private: false, access: { has: obj => "_vertDeltaV" in obj, get: obj => obj._vertDeltaV, set: (obj, value) => { obj._vertDeltaV = value; } }, metadata: _metadata }, __vertDeltaV_initializers, __vertDeltaV_extraInitializers);
            __esDecorate(null, null, __flagRotation_decorators, { kind: "field", name: "_flagRotation", static: false, private: false, access: { has: obj => "_flagRotation" in obj, get: obj => obj._flagRotation, set: (obj, value) => { obj._flagRotation = value; } }, metadata: _metadata }, __flagRotation_initializers, __flagRotation_extraInitializers);
            __esDecorate(null, null, __flagDeltaV_decorators, { kind: "field", name: "_flagDeltaV", static: false, private: false, access: { has: obj => "_flagDeltaV" in obj, get: obj => obj._flagDeltaV, set: (obj, value) => { obj._flagDeltaV = value; } }, metadata: _metadata }, __flagDeltaV_initializers, __flagDeltaV_extraInitializers);
            __esDecorate(null, null, __flagVVelocity_decorators, { kind: "field", name: "_flagVVelocity", static: false, private: false, access: { has: obj => "_flagVVelocity" in obj, get: obj => obj._flagVVelocity, set: (obj, value) => { obj._flagVVelocity = value; } }, metadata: _metadata }, __flagVVelocity_initializers, __flagVVelocity_extraInitializers);
            __esDecorate(null, null, __flagAltitude_decorators, { kind: "field", name: "_flagAltitude", static: false, private: false, access: { has: obj => "_flagAltitude" in obj, get: obj => obj._flagAltitude, set: (obj, value) => { obj._flagAltitude = value; } }, metadata: _metadata }, __flagAltitude_initializers, __flagAltitude_extraInitializers);
            __esDecorate(null, null, __altMSL_decorators, { kind: "field", name: "_altMSL", static: false, private: false, access: { has: obj => "_altMSL" in obj, get: obj => obj._altMSL, set: (obj, value) => { obj._altMSL = value; } }, metadata: _metadata }, __altMSL_initializers, __altMSL_extraInitializers);
            __esDecorate(null, null, __altTerain_decorators, { kind: "field", name: "_altTerain", static: false, private: false, access: { has: obj => "_altTerain" in obj, get: obj => obj._altTerain, set: (obj, value) => { obj._altTerain = value; } }, metadata: _metadata }, __altTerain_initializers, __altTerain_extraInitializers);
            __esDecorate(null, null, __fuelWarning_decorators, { kind: "field", name: "_fuelWarning", static: false, private: false, access: { has: obj => "_fuelWarning" in obj, get: obj => obj._fuelWarning, set: (obj, value) => { obj._fuelWarning = value; } }, metadata: _metadata }, __fuelWarning_initializers, __fuelWarning_extraInitializers);
            __esDecorate(null, null, __fuel_decorators, { kind: "field", name: "_fuel", static: false, private: false, access: { has: obj => "_fuel" in obj, get: obj => obj._fuel, set: (obj, value) => { obj._fuel = value; } }, metadata: _metadata }, __fuel_initializers, __fuel_extraInitializers);
            __esDecorate(null, null, __time_decorators, { kind: "field", name: "_time", static: false, private: false, access: { has: obj => "_time" in obj, get: obj => obj._time, set: (obj, value) => { obj._time = value; } }, metadata: _metadata }, __time_initializers, __time_extraInitializers);
            __esDecorate(null, null, __rotation_decorators, { kind: "field", name: "_rotation", static: false, private: false, access: { has: obj => "_rotation" in obj, get: obj => obj._rotation, set: (obj, value) => { obj._rotation = value; } }, metadata: _metadata }, __rotation_initializers, __rotation_extraInitializers);
            __esDecorate(null, null, __status_decorators, { kind: "field", name: "_status", static: false, private: false, access: { has: obj => "_status" in obj, get: obj => obj._status, set: (obj, value) => { obj._status = value; } }, metadata: _metadata }, __status_initializers, __status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.HudComponent = HudComponent;


/***/ }),

/***/ "./src/app/objects/lander/lander.component.ts":
/*!****************************************************!*\
  !*** ./src/app/objects/lander/lander.component.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LanderComponent = void 0;
const lander_component_html_1 = __importDefault(__webpack_require__(/*! ./lander.component.html */ "./src/app/objects/lander/lander.component.html"));
const lander_component_css_1 = __importDefault(__webpack_require__(/*! ./lander.component.css */ "./src/app/objects/lander/lander.component.css"));
const webz_1 = __webpack_require__(/*! @boots-edu/webz */ "./node_modules/@boots-edu/webz/index.js");
const globals_1 = __webpack_require__(/*! ../../globals */ "./src/app/globals.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/app/objects/utils.ts");
/**
 * @description The Lander Component
 * @class
 * @extends WebzComponent

 * @property {EventSubject<GameStatus>} gameOver - The game over event
 */
let LanderComponent = (() => {
    var _a;
    let _classSuper = webz_1.WebzComponent;
    let _instanceExtraInitializers = [];
    let __landerImg_decorators;
    let __landerImg_initializers = [];
    let __landerImg_extraInitializers = [];
    let __xPos_decorators;
    let __xPos_initializers = [];
    let __xPos_extraInitializers = [];
    let __yPos_decorators;
    let __yPos_initializers = [];
    let __yPos_extraInitializers = [];
    let __transform_decorators;
    let __transform_initializers = [];
    let __transform_extraInitializers = [];
    let __flameDisplay_decorators;
    let __flameDisplay_initializers = [];
    let __flameDisplay_extraInitializers = [];
    let __showLander_decorators;
    let __showLander_initializers = [];
    let __showLander_extraInitializers = [];
    let _stopFlame_decorators;
    let _moveAndFlame_decorators;
    let _UpdatePosition_decorators;
    return _a = class LanderComponent extends _classSuper {
            /**
             * @description The position of the lander
             * @returns {Position} The position of the lander
             * @private
             * @memberof LanderComponent
             * @summary Gets the position of the lander in screen coordinates
             */
            get position() {
                return { x: this._xPos, y: this._yPos };
            }
            /**
             * @description Sets the position of the lander
             * @param {Position} value The new position
             * @private
             * @memberof LanderComponent
             * @summary Sets the position of the lander in screen coordinates within the game div
             */
            set position(value) {
                this._xPos = value.x;
                this._yPos = value.y;
            }
            /**
             * @description The world position of the lander
             * @returns {Position} The world position of the lander
             * @private
             * @memberof LanderComponent
             * @summary Gets the position of the lander in world coordinates origin lower left
             */
            get worldPosition() {
                //Note: 50 is the title height
                //12 is the height of the flame
                return {
                    x: this.position.x,
                    y: this.getWindowSize().windowHeight -
                        50 -
                        this.position.y -
                        this.landerHeight +
                        12,
                };
            }
            /**
             * @description Set The rotation of the lander in degrees
             * @type {number} The rotation of the lander in degrees
             * @private
             * @memberof LanderComponent
             */
            set rotation(value) {
                if (value < 0)
                    value = 360 + value;
                if (value > 360)
                    value = value % 360;
                this._angle = value;
                this._transform = `rotate(${value}deg)`;
            }
            /**
             * @description Get The rotation of the lander in degrees
             * @returns {number} The rotation of the lander in degrees
             * @private
             * @memberof LanderComponent
             */
            get rotation() {
                return this._angle;
            }
            /**
             * @description Set The flame display
             * @param {boolean} value The flame display
             * @memberof LanderComponent
             * @summary Sets the flame display to show or hide
             * @private
             */
            set flameDisplay(value) {
                this._flameDisplay = value ? "block" : "none";
            }
            /**
             * @description Get The flame display
             * @returns {boolean} The flame display
             * @private
             * @memberof LanderComponent
             * @summary Gets the flame display
             */
            get flameDisplay() {
                return this._flameDisplay === "block";
            }
            /**
             * @description Get The display of the lander (block or none)
             * @returns {boolean} The display of the lander
             * @private
             * @memberof LanderComponent
             */
            get showLander() {
                return this._showLander === "block";
            }
            /**
             * @description Set The display of the lander (block or none)
             * @param {boolean} value The display of the lander
             * @memberof LanderComponent
             * @summary Sets the display of the lander to show or hide
             * @private
             */
            set showLander(value) {
                this._showLander = value ? "block" : "none";
            }
            /**
             * @description The altitude above the terrain
             * @type {number}
             * @private
             * @memberof LanderComponent
             */
            get altitudeTerrain() {
                return this.getAltitudeAt(this.position.x + this.landerWidth / 2);
            }
            /**
             * @description The terrain altitude
             * @type {number}
             * @private
             * @memberof LanderComponent
             */
            constructor(_terrain, hud) {
                super(lander_component_html_1.default, lander_component_css_1.default);
                this._terrain = (__runInitializers(this, _instanceExtraInitializers), _terrain);
                this.hud = hud;
                /**
                 * @description The lander image
                 * @type {string}
                 * @default "assets/lander.png"
                 * @private
                 */
                this._landerImg = __runInitializers(this, __landerImg_initializers, "assets/lander.png");
                /** @description Various lander stats
                 * @private
                 * @memberof LanderComponent
                 */
                this.landerWidth = (__runInitializers(this, __landerImg_extraInitializers), 65);
                this.landerHeight = 60;
                this.fuel = 0;
                /**
                 * @description The start time for elapsed time calculation
                 * @private
                 */
                this.startTime = new Date();
                /**
                 * @description The x position of the lander
                 * @type {string}
                 * @default "0"
                 * @private
                 * @summary Binds to the lander's style.left
                 */
                this._xPos = __runInitializers(this, __xPos_initializers, 0);
                /**
                 * @description The y position of the lander
                 * @type {string}
                 * @default "0"
                 * @private
                 * @summary Binds to the lander's style.top
                 */
                this._yPos = (__runInitializers(this, __xPos_extraInitializers), __runInitializers(this, __yPos_initializers, 0));
                /**
                 * @description The rotation transform for the lander
                 * @type {string}
                 * @default "0"
                 * @private
                 * @summary Binds to the lander's style.transform
                 * @memberof LanderComponent
                 * @default "rotate(0 deg)"
                 */
                this._transform = (__runInitializers(this, __yPos_extraInitializers), __runInitializers(this, __transform_initializers, "rotate(0 deg)"));
                /**
                 * @description The rotation of the lander in degrees
                 * @type {number}
                 * @default 0
                 * @private
                 * @memberof LanderComponent
                 */
                this._angle = (__runInitializers(this, __transform_extraInitializers), 0);
                /**
                 * @description The flame display
                 * @type {string}
                 * @default "none"
                 * @private
                 * @memberof LanderComponent
                 * @summary Binds to the flame's style.display : show or hide
                 */
                this._flameDisplay = __runInitializers(this, __flameDisplay_initializers, "none");
                /**
                 * @description The velocity of the lander
                 * @type {Position}
                 * @private
                 * @memberof LanderComponent
                 */
                this.velocity = (__runInitializers(this, __flameDisplay_extraInitializers), { x: 0, y: 0 });
                /**
                 * @description The display of the lander (block or none)
                 * @type {string}
                 * @default "none"
                 * @private
                 * @memberof LanderComponent
                 * @summary Binds to the lander's style.display : show or hide
                 */
                this._showLander = __runInitializers(this, __showLander_initializers, "none");
                /**
                 * @description boolean as to whether the game is active
                 * @type {TerrainItem[]}
                 * @private
                 * @memberof LanderComponent
                 */
                this.flying = (__runInitializers(this, __showLander_extraInitializers), false);
                /**
                 * @description The game over event
                 * @type {EventSubject<GameStatus>}
                 * @private
                 * @memberof LanderComponent
                 */
                this.gameOver = new webz_1.EventSubject();
                this.position = { x: 50, y: 50 };
            }
            /**
             * @description Stops the flame
             * @param {KeyboardEvent} event The keyboard event
             * @method
             * @memberof LanderComponent
             * @summary Stops the flame on a space bar keyup event
             */
            stopFlame(event) {
                if (event.key === " ") {
                    this.flameDisplay = false;
                }
            }
            /**
             * @description Moves and flames the lander
             * @param {KeyboardEvent} event The keyboard event
             * @method
             * @memberof LanderComponent
             * @summary Rotate the lander left or right and apply thrust by turning
             * on the flame
             */
            moveAndFlame(event) {
                if (this.flying) {
                    switch (event.key) {
                        case "a":
                        case "A":
                            this.rotation -= globals_1.Globals.LANDER_ROTATION_SPEED;
                            break;
                        case "d":
                        case "D":
                            this.rotation += globals_1.Globals.LANDER_ROTATION_SPEED;
                            break;
                        case " ":
                            this.flameDisplay = this.fuel > 0;
                            break;
                    }
                }
            }
            /**
             * @description Tests the velocity of the lander
             * @returns {boolean} Whether the velocity is slow enough to land
             * @private
             * @memberof LanderComponent
             */
            velocityTest() {
                return (Math.abs(this.velocity.x) < globals_1.Globals.TERRAIN_GOOD_VELOCITYX &&
                    Math.abs(this.velocity.y) < globals_1.Globals.TERRAIN_GOOD_VELOCITYY);
            }
            /**
             * @description Main loop Updates the position of the lander
             * @method
             * @memberof LanderComponent
             * @summary Updates the position of the lander based on thrust, gravity and collision detection
             * @summary Stops the game if the lander crashes, lands, orbits or misses
             * @summary Binds to timer event every 100ms
             *      * @private
             */
            UpdatePosition() {
                if (this.flying) {
                    //shouldn't happen after collision detection
                    if (this.position.y > this.getWindowSize().windowHeight) {
                        this.stopFlying(utils_1.GameStatus.Crash);
                        return;
                    }
                    //thrust
                    //this is title height+lander height+20
                    if (this.position.y < -50) {
                        this.stopFlying(utils_1.GameStatus.Orbit);
                        return;
                    }
                    if (this.position.x > this.getWindowSize().windowWidth - 65 ||
                        this.position.x < 0) {
                        this.stopFlying(utils_1.GameStatus.Miss);
                        return;
                    }
                    if (this.flameDisplay && this.fuel > 0) {
                        this.velocity.x +=
                            Math.sin((this.rotation * Math.PI) / 180) *
                                globals_1.Globals.THRUST_MULTIPLIER;
                        this.velocity.y -=
                            Math.cos((this.rotation * Math.PI) / 180) *
                                globals_1.Globals.THRUST_MULTIPLIER;
                        this.fuel -= globals_1.Globals.LANDER_FUEL_CONSUMPTION;
                    }
                    this.hud.Fuel = this.fuel;
                    //gravity
                    this.velocity.y += globals_1.Globals.GRAVITY;
                    this.hud.Velocity = this.velocity;
                    this.position = {
                        x: this.position.x + this.velocity.x,
                        y: this.position.y + this.velocity.y,
                    };
                    this.hud.AltitudeMSL = this.worldPosition.y;
                    this.hud.AltitudeTerrain = this.altitudeTerrain;
                    this.hud.Rotation = this.rotation;
                    this.hud.Time = Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000);
                    //collision detection
                    if (this.altitudeTerrain <= 0) {
                        this.hud.AltitudeTerrain = 0;
                        const midX = this.position.x + this.landerWidth / 2;
                        this.position = {
                            x: this.position.x,
                            y: this.getWindowSize().windowHeight -
                                this.getTerrainHeightAt(midX) -
                                50 -
                                this.landerHeight +
                                12,
                        };
                        let y1 = this.getAltitudeAt(this.position.x);
                        let y2 = this.getAltitudeAt(this.position.x + this.landerWidth);
                        if (this.rotation != 0) {
                            this.hud.flagRotation = true;
                            this._landerImg = "assets/explode.gif";
                            this.stopFlying(utils_1.GameStatus.Crash);
                            return;
                        }
                        else if (this.velocity.x > globals_1.Globals.TERRAIN_GOOD_VELOCITYX) {
                            this.hud.flagHVelocity = true;
                            this._landerImg = "assets/explode.gif";
                            this.stopFlying(utils_1.GameStatus.Crash);
                        }
                        else if (this.velocity.y > globals_1.Globals.TERRAIN_GOOD_VELOCITYY) {
                            this.hud.flagVVelocity = true;
                            this._landerImg = "assets/explode.gif";
                            this.stopFlying(utils_1.GameStatus.Crash);
                        }
                        else if (Math.abs(y1 - y2) > globals_1.Globals.TERRAIN_GOOD_DIFFERENCE) {
                            this.hud.flagAltitude = true;
                            //show explosion
                            this._landerImg = "assets/explode.gif";
                            this.stopFlying(utils_1.GameStatus.Crash);
                        }
                        else {
                            this.stopFlying(utils_1.GameStatus.Land);
                        }
                    }
                }
            }
            /**
             * @description Resets the HUD
             * @method
             * @memberof LanderComponent
             */
            resetHud() {
                this.hud.Rotation = this.rotation;
                this.hud.Velocity = this.velocity;
                this.hud.status = utils_1.GameStatus.Ok;
                this.hud.AltitudeMSL = this.position.y;
                this.hud.AltitudeTerrain = this.position.y;
                this.hud.Fuel = this.fuel;
                this.hud.Time = 0;
                this.hud.resetFlags();
            }
            /**
             * @description Starts the lander flying
             * @method
             * @memberof LanderComponent
             * @summary Starts the lander flying with a random x position
             */
            startFlying() {
                this._landerImg = "assets/lander.png";
                this.startTime = new Date();
                this.rotation = 0;
                this.velocity = { x: 0, y: 0 };
                const randomX = Math.floor(Math.random() * (this.getWindowSize().windowWidth - 100 + 1) + 50);
                this.position = { x: randomX, y: 50 };
                this.fuel = globals_1.Globals.LANDER_FUEL_CAPACITY;
                this.resetHud();
                this.flying = true;
                this.showLander = true;
            }
            stopFlying(stopType) {
                this.flying = false;
                this.hud.status = stopType;
                this.gameOver.next(stopType);
            }
            /**
             * @description Gets the altitude above the terrain at a given x position
             * @param {number} x The x position
             * @returns {number} The altitude at the x position
             * @method
             * @memberof LanderComponent
             */
            getAltitudeAt(x) {
                const terrain = this._terrain[Math.floor(x / globals_1.Globals.TERRAIN_PART_WIDTH)];
                return this.worldPosition.y - terrain.height + terrain.getYatX(x);
            }
            /**
             * @description Gets the terrain height at a given x position
             * @param {number} x The x position
             * @returns {number} The terrain height at the x position
             * @method
             * @memberof LanderComponent
             */
            getTerrainHeightAt(x) {
                return this._terrain[Math.floor(x / globals_1.Globals.TERRAIN_PART_WIDTH)].getHeightatX(x);
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            __landerImg_decorators = [(0, webz_1.BindStyle)("lander", "backgroundImage", (value) => `url(${value}?v=${new Date().valueOf()})`)];
            __xPos_decorators = [(0, webz_1.BindStyleToNumberAppendPx)("lander", "left")];
            __yPos_decorators = [(0, webz_1.BindStyleToNumberAppendPx)("lander", "top")];
            __transform_decorators = [(0, webz_1.BindStyle)("lander", "transform")];
            __flameDisplay_decorators = [(0, webz_1.BindStyle)("flame", "display")];
            __showLander_decorators = [(0, webz_1.BindStyle)("lander", "display")];
            _stopFlame_decorators = [(0, webz_1.WindowEvent)("keyup")];
            _moveAndFlame_decorators = [(0, webz_1.WindowEvent)("keydown")];
            _UpdatePosition_decorators = [(0, webz_1.Timer)(100)];
            __esDecorate(_a, null, _stopFlame_decorators, { kind: "method", name: "stopFlame", static: false, private: false, access: { has: obj => "stopFlame" in obj, get: obj => obj.stopFlame }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _moveAndFlame_decorators, { kind: "method", name: "moveAndFlame", static: false, private: false, access: { has: obj => "moveAndFlame" in obj, get: obj => obj.moveAndFlame }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _UpdatePosition_decorators, { kind: "method", name: "UpdatePosition", static: false, private: false, access: { has: obj => "UpdatePosition" in obj, get: obj => obj.UpdatePosition }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, __landerImg_decorators, { kind: "field", name: "_landerImg", static: false, private: false, access: { has: obj => "_landerImg" in obj, get: obj => obj._landerImg, set: (obj, value) => { obj._landerImg = value; } }, metadata: _metadata }, __landerImg_initializers, __landerImg_extraInitializers);
            __esDecorate(null, null, __xPos_decorators, { kind: "field", name: "_xPos", static: false, private: false, access: { has: obj => "_xPos" in obj, get: obj => obj._xPos, set: (obj, value) => { obj._xPos = value; } }, metadata: _metadata }, __xPos_initializers, __xPos_extraInitializers);
            __esDecorate(null, null, __yPos_decorators, { kind: "field", name: "_yPos", static: false, private: false, access: { has: obj => "_yPos" in obj, get: obj => obj._yPos, set: (obj, value) => { obj._yPos = value; } }, metadata: _metadata }, __yPos_initializers, __yPos_extraInitializers);
            __esDecorate(null, null, __transform_decorators, { kind: "field", name: "_transform", static: false, private: false, access: { has: obj => "_transform" in obj, get: obj => obj._transform, set: (obj, value) => { obj._transform = value; } }, metadata: _metadata }, __transform_initializers, __transform_extraInitializers);
            __esDecorate(null, null, __flameDisplay_decorators, { kind: "field", name: "_flameDisplay", static: false, private: false, access: { has: obj => "_flameDisplay" in obj, get: obj => obj._flameDisplay, set: (obj, value) => { obj._flameDisplay = value; } }, metadata: _metadata }, __flameDisplay_initializers, __flameDisplay_extraInitializers);
            __esDecorate(null, null, __showLander_decorators, { kind: "field", name: "_showLander", static: false, private: false, access: { has: obj => "_showLander" in obj, get: obj => obj._showLander, set: (obj, value) => { obj._showLander = value; } }, metadata: _metadata }, __showLander_initializers, __showLander_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.LanderComponent = LanderComponent;


/***/ }),

/***/ "./src/app/objects/terrain/terrain.component.ts":
/*!******************************************************!*\
  !*** ./src/app/objects/terrain/terrain.component.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TerrainComponent = exports.TerrainItem = void 0;
const webz_1 = __webpack_require__(/*! @boots-edu/webz */ "./node_modules/@boots-edu/webz/index.js");
const terrain_component_html_1 = __importDefault(__webpack_require__(/*! ./terrain.component.html */ "./src/app/objects/terrain/terrain.component.html"));
const terrain_component_css_1 = __importDefault(__webpack_require__(/*! ./terrain.component.css */ "./src/app/objects/terrain/terrain.component.css"));
const globals_1 = __webpack_require__(/*! ../../globals */ "./src/app/globals.ts");
/**
 * @description A function to get a random integer between two numbers
 * @param {number} min - The minimum number
 * @param {number} max - The maximum number
 * @returns {number} - A random number between min and max
 * @function
 */
function getRandomInt(min, max) {
    return Math.floor(Math.floor(Math.random() * (max - min + 1)) + min);
}
/**
 * @description A terrain item class
 * @class
 * @extends WebzComponent
 */
class TerrainItem extends webz_1.WebzComponent {
    /**
     * @description The constructor of the TerrainItem
     * @summary Creates a terrain item
     * @memberof TerrainItem
     * @constructor
     */
    constructor(x1, y1, x2, y2, height) {
        super(`<div id='holder'>
               <svg>
               <defs>
                        <pattern id="image" x="0" y="0" patternUnits="userSpaceOnUse" height="500" width="500">
                        <image x="0" y="0" xlink:href="assets/ground.jpg"></image>
                    </pattern>
                </defs>
                <polygon class="terrain" points='0 ${height},0 ${y1},${x2 - x1} ${y2},${x2 - x1} ${height}' 
                    style='fill:url(#image);stroke:black;stroke-width:0'>
                </polygon>
            </svg></g></svg></div>`, `#holder{
                position: absolute;
                top: 0;
                left:${x1}px;
                width:${x2 - x1}px;
                height:${height}px;               
                `);
        this.height = height;
        /**
         * @description the top left corner of the polygon
         */
        this.x1 = 0;
        this.y1 = 0;
        /**
         * @description the bottom right corner of the polygon
         */
        this.x2 = 0;
        this.y2 = 0;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    /**
     * @description Gets the y value at a given x
     * @param {number} x - The x value
     * @returns {number} - The y value at x
     * @method
     * @memberof TerrainItem
     */
    getYatX(x) {
        let slope = (this.y2 - this.y1) / (this.x2 - this.x1);
        return slope * (x - this.x1) + this.y1;
    }
    /**
     * @description Gets the height of the terrain at a given x
     * @param {number} x - The x value
     * @returns {number} - The height at x
     * @method
     * @memberof TerrainItem
     */
    getHeightatX(x) {
        return this.height - this.getYatX(x);
    }
}
exports.TerrainItem = TerrainItem;
/**
 * @description The terrain component
 * @class
 * @extends WebzComponent
 * @property {TerrainItem[]} terrainItems - The terrain items
 */
class TerrainComponent extends webz_1.WebzComponent {
    /**
     * @description The terrain items
     * @type {TerrainItem[]}
     * @summary this is the array of terrain item
     * @public
     */
    get terrainItems() {
        return this._polys;
    }
    /**
     * @description The constructor of the TerrainComponent
     * @param {number} terrainHeight - The height of the terrain
     * @summary Creates a terrain component
     * @summary Randomly allocates terrain block polygons
     * @memberof TerrainComponent
     * @constructor
     */
    constructor(terrainHeight = 100) {
        super(terrain_component_html_1.default, terrain_component_css_1.default);
        /**
         * @description The width of the terrain
         * @type {number}
         * @summary this is the number of pixels wide each terrain block is
         */
        this._width = globals_1.Globals.TERRAIN_PART_WIDTH;
        /**
         * @description The terrain items
         * @type {TerrainItem[]}
         * @summary this is the array of terrain items
         */
        this._polys = [];
        this._terrainHeight = terrainHeight;
        const numTerainBlocks = this.getWindowSize().windowWidth / this._width + 1;
        let oldPoint = getRandomInt(20, this._terrainHeight - 20);
        const rflat1 = getRandomInt(0, numTerainBlocks);
        const rflat2 = getRandomInt(0, numTerainBlocks);
        for (let i = 0; i < numTerainBlocks; i++) {
            if (i === rflat1 || i === rflat2) {
                const p = new TerrainItem(i * this._width, oldPoint, (i + 1) * this._width, oldPoint, terrainHeight);
                this._polys.push(p);
                this.addComponent(p, "terrain");
            }
            else {
                let newPoint = getRandomInt(20, this._terrainHeight - 20);
                const p = new TerrainItem(i * this._width, oldPoint, (i + 1) * this._width, newPoint, terrainHeight);
                this._polys.push(p);
                this.addComponent(p, "terrain");
                oldPoint = newPoint;
            }
        }
    }
}
exports.TerrainComponent = TerrainComponent;


/***/ }),

/***/ "./src/app/objects/utils.ts":
/*!**********************************!*\
  !*** ./src/app/objects/utils.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameStatus = void 0;
/**
 * @description Describes possible game states
 * @enum
 */
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["Ok"] = 0] = "Ok";
    GameStatus[GameStatus["Crash"] = 1] = "Crash";
    GameStatus[GameStatus["Land"] = 2] = "Land";
    GameStatus[GameStatus["Orbit"] = 3] = "Orbit";
    GameStatus[GameStatus["Miss"] = 4] = "Miss";
})(GameStatus || (exports.GameStatus = GameStatus = {}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!*************************!*\
  !*** ./wbcore/start.ts ***!
  \*************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ../styles.css */ "./styles.css");
const webz_1 = __webpack_require__(/*! @boots-edu/webz */ "./node_modules/@boots-edu/webz/index.js");
const main_component_1 = __webpack_require__(/*! ../src/app/main.component */ "./src/app/main.component.ts");
(0, webz_1.bootstrap)(main_component_1.MainComponent);

})();

/******/ })()
;
//# sourceMappingURL=main.bundle.js.map