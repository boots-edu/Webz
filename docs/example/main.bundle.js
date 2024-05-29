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
const notifier_1 = __webpack_require__(/*! ./notifier */ "./node_modules/@boots-edu/webz/notifier.js");
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
     * @type {Notifier<SizeInfo>}
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
                WebzComponent.resizeEvent.notify({
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
        const evt = new notifier_1.Notifier();
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
                evt.notify(JSON.parse(xhr.responseText));
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
WebzComponent.resizeEvent = new notifier_1.Notifier();


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
const notifier_1 = __webpack_require__(/*! ./notifier */ "./node_modules/@boots-edu/webz/notifier.js");
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
        this.closeEvent = new notifier_1.Notifier();
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
     * @returns {Notifier<string>} The event subject that is triggered when the dialog is closed
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
                    dialog.closeEvent.notify(button.value);
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
const notifier_1 = __webpack_require__(/*! ./notifier */ "./node_modules/@boots-edu/webz/notifier.js");
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
const boundProxyRebuild = new notifier_1.Notifier();
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
                boundProxyRebuild.notify();
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
                    boundProxyRebuild.notify();
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
__exportStar(__webpack_require__(/*! ./notifier */ "./node_modules/@boots-edu/webz/notifier.js"), exports);
__exportStar(__webpack_require__(/*! ./bootstrap */ "./node_modules/@boots-edu/webz/bootstrap.js"), exports);


/***/ }),

/***/ "./node_modules/@boots-edu/webz/notifier.js":
/*!**************************************************!*\
  !*** ./node_modules/@boots-edu/webz/notifier.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Notifier = void 0;
/**
 * Notifier
 * @description A class for creating events
 * @export
 * @class Notifier
 * @group Async Event Sources
 */
class Notifier {
    constructor() {
        this.refCount = 0;
        this.callbacks = [];
        this.errorFns = [];
    }
    /**
     * Subscribe to the event
     * @param callback The callback to call when the event is triggered
     * @param error The callback to call when an error is triggered
     * @returns The id of the subscription
     * @example
     * const event = new Notifier<number>();
     * const id = event.subscribe((value:number) => {
     *  console.log(value);
     * });
     * event.notify(1);
     * event.unsubscribe(id);
     */
    subscribe(callback, error) {
        this.callbacks.push({ id: this.refCount, fn: callback });
        if (error)
            this.errorFns.push({ id: this.refCount, fn: error });
        return this.refCount++;
    }
    /**
     * Unsubscribe from the event
     * @param id The id of the subscription to remove
     * @returns void
     * @example
     * const event = new Notifier<number>();
     * const id = event.subscribe((value:number) => {
     *   console.log(value);
     * });
     * event.notify(1);
     * event.unsubscribe(id);
     */
    unsubscribe(id) {
        this.callbacks = this.callbacks.filter((cb) => cb.id !== id);
        this.errorFns = this.errorFns.filter((cb) => cb.id !== id);
    }
    /**
     * Trigger the event
     * @param value The value to pass to the callback
     * @returns void
     * @example
     * const event = new Notifier<number>();
     * const id = event.subscribe((value:number) => {
     *   console.log(value);
     * });
     * event.notify(1);
     * event.unsubscribe(id);
     * @deprecated Use notify instead
     */
    next(value) {
        for (const callback of this.callbacks)
            callback.fn(value);
    }
    /**
     * Trigger the event
     * @param value The value to pass to the callback
     * @returns void
     * @example
     * const event = new Notifier<number>();
     * const id = event.subscribe((value:number) => {
     *   console.log(value);
     * });
     * event.notify(1);
     * event.unsubscribe(id);
     */
    notify(value) {
        this.next(value);
    }
    /**
     * Trigger the error event event
     * @param value The value to pass to the callback
     * @returns void
     * @example
     * const event = new Notifier<number>();
     * const id = event.subscribe((value:number) => {
     *   console.log(value);
     * }, (error) => {
     *  console.error(error);
     * });
     * event.error(new Error("It doesnt't work!"));
     * event.unsubscribe(id);
     */
    error(value) {
        for (const errorFn of this.errorFns)
            errorFn.fn(value);
    }
    /**
     * Convert the event to a promise
     * @description Convert the event to a promise.
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
exports.Notifier = Notifier;


/***/ }),

/***/ "./src/app/components/taskeditor/taskeditor.component.css":
/*!****************************************************************!*\
  !*** ./src/app/components/taskeditor/taskeditor.component.css ***!
  \****************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.editor-line {
    display: flex;
    flex-direction: row;
    width: 100%;
    position: relative;
}

.editor-input {
    text-align: left;
    font-size: 14pt;
    font-weight: bold;
    flex: 1;
    display: inline-block;
    padding-right: 20px;
}
.editor-input input {
    width: 100%;
    text-align: left;
}
`, "",{"version":3,"sources":["webpack://./src/app/components/taskeditor/taskeditor.component.css"],"names":[],"mappings":"AAAA;IACI,aAAa;IACb,mBAAmB;IACnB,WAAW;IACX,kBAAkB;AACtB;;AAEA;IACI,gBAAgB;IAChB,eAAe;IACf,iBAAiB;IACjB,OAAO;IACP,qBAAqB;IACrB,mBAAmB;AACvB;AACA;IACI,WAAW;IACX,gBAAgB;AACpB","sourcesContent":[".editor-line {\n    display: flex;\n    flex-direction: row;\n    width: 100%;\n    position: relative;\n}\n\n.editor-input {\n    text-align: left;\n    font-size: 14pt;\n    font-weight: bold;\n    flex: 1;\n    display: inline-block;\n    padding-right: 20px;\n}\n.editor-input input {\n    width: 100%;\n    text-align: left;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/app/components/taskline/taskline.component.css":
/*!************************************************************!*\
  !*** ./src/app/components/taskline/taskline.component.css ***!
  \************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.hidden {
    display: none;
}
.visible {
    display: block;
}
#line {
    width: 100%;
    padding-bottom: 10px;
    padding-top: 10px;
    border-bottom: solid 1px black;
}
`, "",{"version":3,"sources":["webpack://./src/app/components/taskline/taskline.component.css"],"names":[],"mappings":"AAAA;IACI,aAAa;AACjB;AACA;IACI,cAAc;AAClB;AACA;IACI,WAAW;IACX,oBAAoB;IACpB,iBAAiB;IACjB,8BAA8B;AAClC","sourcesContent":[".hidden {\n    display: none;\n}\n.visible {\n    display: block;\n}\n#line {\n    width: 100%;\n    padding-bottom: 10px;\n    padding-top: 10px;\n    border-bottom: solid 1px black;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/app/components/tasks/tasks.component.css":
/*!******************************************************!*\
  !*** ./src/app/components/tasks/tasks.component.css ***!
  \******************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.main-window {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    border-radius: 20px;
    box-shadow: 4px 8px 8px 4px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
}

.header {
    position: relative;
    background-color: lightgray;
    margin: 0;
    border-radius: 20px 20px 0 0;
    display: flex;
    flex-direction: row;
    padding: 15px;
}

.title,
.control {
    display: inline-flex;
}
.title {
    flex: 1;
    font-size: 25px;
    font-weight: bold;
}
.list-body {
    margin: 10px;
    border: solid 1px silver;
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 10px;
    border-radius: 10px 0 0 10px;
}
.control button {
    margin-left: 5px;
}
`, "",{"version":3,"sources":["webpack://./src/app/components/tasks/tasks.component.css"],"names":[],"mappings":"AAAA;IACI,MAAM;IACN,SAAS;IACT,OAAO;IACP,QAAQ;IACR,kBAAkB;IAClB,mBAAmB;IACnB,8CAA8C;IAC9C,aAAa;IACb,sBAAsB;AAC1B;;AAEA;IACI,kBAAkB;IAClB,2BAA2B;IAC3B,SAAS;IACT,4BAA4B;IAC5B,aAAa;IACb,mBAAmB;IACnB,aAAa;AACjB;;AAEA;;IAEI,oBAAoB;AACxB;AACA;IACI,OAAO;IACP,eAAe;IACf,iBAAiB;AACrB;AACA;IACI,YAAY;IACZ,wBAAwB;IACxB,OAAO;IACP,kBAAkB;IAClB,kBAAkB;IAClB,aAAa;IACb,4BAA4B;AAChC;AACA;IACI,gBAAgB;AACpB","sourcesContent":[".main-window {\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    position: absolute;\n    border-radius: 20px;\n    box-shadow: 4px 8px 8px 4px rgba(0, 0, 0, 0.2);\n    display: flex;\n    flex-direction: column;\n}\n\n.header {\n    position: relative;\n    background-color: lightgray;\n    margin: 0;\n    border-radius: 20px 20px 0 0;\n    display: flex;\n    flex-direction: row;\n    padding: 15px;\n}\n\n.title,\n.control {\n    display: inline-flex;\n}\n.title {\n    flex: 1;\n    font-size: 25px;\n    font-weight: bold;\n}\n.list-body {\n    margin: 10px;\n    border: solid 1px silver;\n    flex: 1;\n    overflow-y: scroll;\n    overflow-x: hidden;\n    padding: 10px;\n    border-radius: 10px 0 0 10px;\n}\n.control button {\n    margin-left: 5px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/app/components/taskviewer/taskviewer.component.css":
/*!****************************************************************!*\
  !*** ./src/app/components/taskviewer/taskviewer.component.css ***!
  \****************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.view-line {
    display: flex;
    flex-direction: row;
}

.task-view {
    text-align: left;
    font-size: 14pt;
    font-weight: bold;
    flex: 1;
    display: inline-block;
}

.task-line {
    width: 100%;
    position: relative;
    padding-bottom: 10px;
    border-bottom: solid 1px black;
}
`, "",{"version":3,"sources":["webpack://./src/app/components/taskviewer/taskviewer.component.css"],"names":[],"mappings":"AAAA;IACI,aAAa;IACb,mBAAmB;AACvB;;AAEA;IACI,gBAAgB;IAChB,eAAe;IACf,iBAAiB;IACjB,OAAO;IACP,qBAAqB;AACzB;;AAEA;IACI,WAAW;IACX,kBAAkB;IAClB,oBAAoB;IACpB,8BAA8B;AAClC","sourcesContent":[".view-line {\n    display: flex;\n    flex-direction: row;\n}\n\n.task-view {\n    text-align: left;\n    font-size: 14pt;\n    font-weight: bold;\n    flex: 1;\n    display: inline-block;\n}\n\n.task-line {\n    width: 100%;\n    position: relative;\n    padding-bottom: 10px;\n    border-bottom: solid 1px black;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/app/main.component.css":
/*!************************************!*\
  !*** ./src/app/main.component.css ***!
  \************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `div {
    box-sizing: border-box;
}
.header {
    text-align: center;
    padding: 10px;
    margin-bottom: 10px;
    position: relative;
}
.title {
    color: blue;
    font-size: 40px;
    font-weight: bold;
}
.subtitle {
    font-size: 20px;
    font-weight: bold;
}

.working-area {
    position: relative;
    width: 90%;
    margin-left: 5%;
    min-height: 10px;
    margin-bottom: 50px;
    flex: 1;
    display: flex;
    flex-direction: column;
}
.fill-vertical {
    text-align: center;
    display: flex;
    flex-direction: column;
    height: 100vh;
    position: relative;
}
`, "",{"version":3,"sources":["webpack://./src/app/main.component.css"],"names":[],"mappings":"AAAA;IACI,sBAAsB;AAC1B;AACA;IACI,kBAAkB;IAClB,aAAa;IACb,mBAAmB;IACnB,kBAAkB;AACtB;AACA;IACI,WAAW;IACX,eAAe;IACf,iBAAiB;AACrB;AACA;IACI,eAAe;IACf,iBAAiB;AACrB;;AAEA;IACI,kBAAkB;IAClB,UAAU;IACV,eAAe;IACf,gBAAgB;IAChB,mBAAmB;IACnB,OAAO;IACP,aAAa;IACb,sBAAsB;AAC1B;AACA;IACI,kBAAkB;IAClB,aAAa;IACb,sBAAsB;IACtB,aAAa;IACb,kBAAkB;AACtB","sourcesContent":["div {\n    box-sizing: border-box;\n}\n.header {\n    text-align: center;\n    padding: 10px;\n    margin-bottom: 10px;\n    position: relative;\n}\n.title {\n    color: blue;\n    font-size: 40px;\n    font-weight: bold;\n}\n.subtitle {\n    font-size: 20px;\n    font-weight: bold;\n}\n\n.working-area {\n    position: relative;\n    width: 90%;\n    margin-left: 5%;\n    min-height: 10px;\n    margin-bottom: 50px;\n    flex: 1;\n    display: flex;\n    flex-direction: column;\n}\n.fill-vertical {\n    text-align: center;\n    display: flex;\n    flex-direction: column;\n    height: 100vh;\n    position: relative;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


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
`, "",{"version":3,"sources":["webpack://./styles.css"],"names":[],"mappings":"AAAA;;CAEC;;AAED,gCAAgC","sourcesContent":["/*Put your global styles here.  \n* Individual components can be styled locatlly\n*/\n\n/* Add your global styles here */\n"],"sourceRoot":""}]);
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

/***/ "./node_modules/guid/guid.js":
/*!***********************************!*\
  !*** ./node_modules/guid/guid.js ***!
  \***********************************/
/***/ ((module) => {

(function () {
  var validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");

  function gen(count) {
    var out = "";
    for (var i=0; i<count; i++) {
      out += (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return out;
  }

  function Guid(guid) {
    if (!guid) throw new TypeError("Invalid argument; `value` has no value.");
      
    this.value = Guid.EMPTY;
    
    if (guid && guid instanceof Guid) {
      this.value = guid.toString();

    } else if (guid && Object.prototype.toString.call(guid) === "[object String]" && Guid.isGuid(guid)) {
      this.value = guid;
    }
    
    this.equals = function(other) {
      // Comparing string `value` against provided `guid` will auto-call
      // toString on `guid` for comparison
      return Guid.isGuid(other) && this.value == other;
    };

    this.isEmpty = function() {
      return this.value === Guid.EMPTY;
    };
    
    this.toString = function() {
      return this.value;
    };
    
    this.toJSON = function() {
      return this.value;
    };
  };

  Guid.EMPTY = "00000000-0000-0000-0000-000000000000";

  Guid.isGuid = function(value) {
    return value && (value instanceof Guid || validator.test(value.toString()));
  };

  Guid.create = function() {
    return new Guid([gen(2), gen(1), gen(1), gen(1), gen(3)].join("-"));
  };

  Guid.raw = function() {
    return [gen(2), gen(1), gen(1), gen(1), gen(3)].join("-");
  };

  if( true && module.exports) {
    module.exports = Guid;
  }
  else if (typeof window != 'undefined') {
    window.Guid = Guid;
  }
})();


/***/ }),

/***/ "./src/app/components/taskeditor/taskeditor.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/components/taskeditor/taskeditor.component.html ***!
  \*****************************************************************/
/***/ ((module) => {

module.exports = "<div class=\"editor-line\">\n    <div class=\"editor-input\">\n        <div class=\"form-group\">\n            <input\n                class=\"form-control\"\n                type=\"text\"\n                id=\"tasktext\"\n                placeholder=\"Enter your Task\"\n            />\n        </div>\n    </div>\n    <div class=\"editor-buttons\">\n        <button id=\"save\" class=\"btn btn-primary\">Save</button>\n        <button id=\"cancel\" class=\"btn btn-primary\">Cancel</button>\n    </div>\n</div>\n";

/***/ }),

/***/ "./src/app/components/taskline/taskline.component.html":
/*!*************************************************************!*\
  !*** ./src/app/components/taskline/taskline.component.html ***!
  \*************************************************************/
/***/ ((module) => {

module.exports = "<div id=\"line\">\n    <div id=\"editor\" class=\"hidden\"></div>\n    <div id=\"viewer\" class=\"hidden\"></div>\n</div>\n";

/***/ }),

/***/ "./src/app/components/tasks/tasks.component.html":
/*!*******************************************************!*\
  !*** ./src/app/components/tasks/tasks.component.html ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = "<div class=\"main-window\">\n    <div class=\"header\">\n        <div class=\"title\">Tasks</div>\n        <div class=\"control\">\n            <div class=\"form-group\">\n                <button class=\"btn btn-primary\" id=\"add-task\">Add Task</button>\n                <button class=\"btn btn-danger\" id=\"clear-tasks\">\n                    Clear all\n                </button>\n            </div>\n        </div>\n    </div>\n    <div class=\"list-body\">\n        <div class=\"row\">\n            <div class=\"col-12\">\n                <ul class=\"list-group\" id=\"task-list\"></ul>\n            </div>\n        </div>\n    </div>\n</div>\n<div id=\"alert-target\"></div>\n";

/***/ }),

/***/ "./src/app/components/taskviewer/taskviewer.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/components/taskviewer/taskviewer.component.html ***!
  \*****************************************************************/
/***/ ((module) => {

module.exports = "<div class=\"view-line\">\n    <div id=\"taskview\" class=\"task-view\"></div>\n    <div class=\"task-buttons\">\n        <button id=\"edit\" class=\"btn btn-primary\">Edit</button>\n        <button id=\"delete\" class=\"btn btn-primary\">Delete</button>\n    </div>\n</div>\n";

/***/ }),

/***/ "./src/app/main.component.html":
/*!*************************************!*\
  !*** ./src/app/main.component.html ***!
  \*************************************/
/***/ ((module) => {

module.exports = "<div class=\"flow-container fill-vertical\">\n    <div class=\"header\">\n        <div class=\"title\">Webz Example</div>\n        <div class=\"subtitle\">Task List</div>\n    </div>\n    <div class=\"working-area\" id=\"task-target\"></div>\n</div>\n";

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

/***/ "./src/app/components/taskeditor/taskeditor.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/components/taskeditor/taskeditor.component.ts ***!
  \***************************************************************/
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
exports.TaskeditorComponent = void 0;
const webz_1 = __webpack_require__(/*! @boots-edu/webz */ "./node_modules/@boots-edu/webz/index.js");
const taskeditor_component_html_1 = __importDefault(__webpack_require__(/*! ./taskeditor.component.html */ "./src/app/components/taskeditor/taskeditor.component.html"));
const taskeditor_component_css_1 = __importDefault(__webpack_require__(/*! ./taskeditor.component.css */ "./src/app/components/taskeditor/taskeditor.component.css"));
/**
 * @description Component for editing a task.
 * @class TaskEditorComponent
 * @extends {WebzComponent}
 * @property {Notifier<boolean>} editClose - event subject for the close event.  true if the save button was clicked, false if the cancel button was clicked.
 * @memberof TaskEditorComponent
 */
let TaskeditorComponent = (() => {
    var _a;
    let _classSuper = webz_1.WebzComponent;
    let _instanceExtraInitializers = [];
    let _tasktext_decorators;
    let _tasktext_initializers = [];
    let _tasktext_extraInitializers = [];
    let _saveDisabled_decorators;
    let _saveDisabled_initializers = [];
    let _saveDisabled_extraInitializers = [];
    let _onTaskTextChange_decorators;
    let _onSave_decorators;
    let _onCancel_decorators;
    return _a = class TaskeditorComponent extends _classSuper {
            onTaskTextChange(evt) {
                try {
                    this.tasktext = evt.value;
                }
                catch (e) {
                    console.error(e);
                }
                this.saveDisabled = this.tasktext === "";
            }
            /**
             * @description Creates an instance of TaskEditorComponent.
             * @param tasks - the task data to edit.  If no task data is provided, the task text will be empty and uniqueID will be undefined.
             * @memberof TaskEditorComponent
             */
            constructor(tasks = { taskText: "" }) {
                super(taskeditor_component_html_1.default, taskeditor_component_css_1.default);
                this.tasks = (__runInitializers(this, _instanceExtraInitializers), tasks);
                this.tasktext = __runInitializers(this, _tasktext_initializers, "");
                this.saveDisabled = (__runInitializers(this, _tasktext_extraInitializers), __runInitializers(this, _saveDisabled_initializers, true));
                this.editClose = (__runInitializers(this, _saveDisabled_extraInitializers), new webz_1.Notifier());
                this.tasktext = tasks.taskText;
            }
            /**
             * @description event handler for the save button.  sets the task text and emits the editClose event with true.
             */
            onSave() {
                this.tasks.taskText = this.tasktext;
                this.editClose.notify(true);
            }
            /**
             * @description event handler for the cancel button.  emits the editClose event with false.
             * @memberof TaskEditorComponent
             */
            onCancel() {
                this.tasktext = this.tasks.taskText;
                this.editClose.notify(false);
            }
            focusInput() {
                this.focus("tasktext");
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _tasktext_decorators = [(0, webz_1.BindValue)("tasktext")];
            _saveDisabled_decorators = [(0, webz_1.BindDisabledToBoolean)("save")];
            _onTaskTextChange_decorators = [(0, webz_1.Input)("tasktext")];
            _onSave_decorators = [(0, webz_1.Click)("save")];
            _onCancel_decorators = [(0, webz_1.Click)("cancel")];
            __esDecorate(_a, null, _onTaskTextChange_decorators, { kind: "method", name: "onTaskTextChange", static: false, private: false, access: { has: obj => "onTaskTextChange" in obj, get: obj => obj.onTaskTextChange }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onSave_decorators, { kind: "method", name: "onSave", static: false, private: false, access: { has: obj => "onSave" in obj, get: obj => obj.onSave }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onCancel_decorators, { kind: "method", name: "onCancel", static: false, private: false, access: { has: obj => "onCancel" in obj, get: obj => obj.onCancel }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _tasktext_decorators, { kind: "field", name: "tasktext", static: false, private: false, access: { has: obj => "tasktext" in obj, get: obj => obj.tasktext, set: (obj, value) => { obj.tasktext = value; } }, metadata: _metadata }, _tasktext_initializers, _tasktext_extraInitializers);
            __esDecorate(null, null, _saveDisabled_decorators, { kind: "field", name: "saveDisabled", static: false, private: false, access: { has: obj => "saveDisabled" in obj, get: obj => obj.saveDisabled, set: (obj, value) => { obj.saveDisabled = value; } }, metadata: _metadata }, _saveDisabled_initializers, _saveDisabled_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TaskeditorComponent = TaskeditorComponent;


/***/ }),

/***/ "./src/app/components/taskline/taskline.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/components/taskline/taskline.component.ts ***!
  \***********************************************************/
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
exports.TasklineComponent = void 0;
const webz_1 = __webpack_require__(/*! @boots-edu/webz */ "./node_modules/@boots-edu/webz/index.js");
const taskline_component_html_1 = __importDefault(__webpack_require__(/*! ./taskline.component.html */ "./src/app/components/taskline/taskline.component.html"));
const taskline_component_css_1 = __importDefault(__webpack_require__(/*! ./taskline.component.css */ "./src/app/components/taskline/taskline.component.css"));
const taskeditor_component_1 = __webpack_require__(/*! ../taskeditor/taskeditor.component */ "./src/app/components/taskeditor/taskeditor.component.ts");
const taskviewer_component_1 = __webpack_require__(/*! ../taskviewer/taskviewer.component */ "./src/app/components/taskviewer/taskviewer.component.ts");
/**
 * @description Component for a single task line.
 * @class TaskLineComponent
 * @extends {WebzComponent}
 * @property {Notifier<void>} lineEdit - event subject for the edit event.
 * @property {Notifier<boolean>} lineEditClose - event subject for the close event.  true if the save button was clicked, false if the cancel button was clicked.
 * @property {Notifier<TaskData>} lineDelete - event subject for the delete event.
 * @property {TaskData} data - the task data for the line.
 * @method {disableViewButtons} - disables the view buttons.
 * @method {disableEditing} - disables editing.
 * @method {startEditing} - starts editing.
 * @memberof TaskLineComponent
 */
let TasklineComponent = (() => {
    var _a;
    let _classSuper = webz_1.WebzComponent;
    let _editorVisible_decorators;
    let _editorVisible_initializers = [];
    let _editorVisible_extraInitializers = [];
    let _viewerVisible_decorators;
    let _viewerVisible_initializers = [];
    let _viewerVisible_extraInitializers = [];
    return _a = class TasklineComponent extends _classSuper {
            set editing(value) {
                this._editing = value;
                this.editorVisible = value ? "visible" : "hidden";
                this.viewerVisible = value ? "hidden" : "visible";
                this.editor.focusInput();
                this.lineEdit.notify();
            }
            get editing() {
                return this._editing;
            }
            get data() {
                return this.taskData;
            }
            constructor(taskData = { taskText: "" }) {
                super(taskline_component_html_1.default, taskline_component_css_1.default);
                this.taskData = taskData;
                this.editorVisible = __runInitializers(this, _editorVisible_initializers, "hidden");
                this.viewerVisible = (__runInitializers(this, _editorVisible_extraInitializers), __runInitializers(this, _viewerVisible_initializers, "hidden"));
                //event sources
                this.lineEdit = (__runInitializers(this, _viewerVisible_extraInitializers), new webz_1.Notifier());
                this.lineEditClose = new webz_1.Notifier();
                this.lineDelete = new webz_1.Notifier();
                this._editing = false;
                this.editor = new taskeditor_component_1.TaskeditorComponent(taskData);
                this.viewer = new taskviewer_component_1.TaskviewerComponent(taskData);
                this.addComponent(this.editor, "editor", true);
                this.addComponent(this.viewer, "viewer", true);
                this.wireUpEditor();
                this.wireUpViewer();
                this.editing = true;
            }
            wireUpEditor() {
                this.editor.editClose.subscribe((save) => {
                    this.editing = false;
                    this.viewer.setData(this.taskData);
                    this.lineEditClose.notify(save);
                });
            }
            wireUpViewer() {
                //if delete is clicked bubble event up.
                //if edit is clicked, then disable all other buttons and enable the editor
                this.viewer.deleting.subscribe(() => {
                    this.lineDelete.notify(this.taskData);
                });
                this.viewer.editing.subscribe(() => {
                    this.lineEdit.notify();
                    this.editing = true;
                });
            }
            disableViewButtons(disable = true) {
                this.viewer.disableButtons(disable);
            }
            disableEditing() {
                this.editing = false;
            }
            startEditing() {
                this.editing = true;
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _editorVisible_decorators = [(0, webz_1.BindCSSClass)("editor")];
            _viewerVisible_decorators = [(0, webz_1.BindCSSClass)("viewer")];
            __esDecorate(null, null, _editorVisible_decorators, { kind: "field", name: "editorVisible", static: false, private: false, access: { has: obj => "editorVisible" in obj, get: obj => obj.editorVisible, set: (obj, value) => { obj.editorVisible = value; } }, metadata: _metadata }, _editorVisible_initializers, _editorVisible_extraInitializers);
            __esDecorate(null, null, _viewerVisible_decorators, { kind: "field", name: "viewerVisible", static: false, private: false, access: { has: obj => "viewerVisible" in obj, get: obj => obj.viewerVisible, set: (obj, value) => { obj.viewerVisible = value; } }, metadata: _metadata }, _viewerVisible_initializers, _viewerVisible_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TasklineComponent = TasklineComponent;


/***/ }),

/***/ "./src/app/components/tasks/tasks.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/components/tasks/tasks.component.ts ***!
  \*****************************************************/
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
exports.TasksComponent = void 0;
const webz_1 = __webpack_require__(/*! @boots-edu/webz */ "./node_modules/@boots-edu/webz/index.js");
const tasks_component_html_1 = __importDefault(__webpack_require__(/*! ./tasks.component.html */ "./src/app/components/tasks/tasks.component.html"));
const tasks_component_css_1 = __importDefault(__webpack_require__(/*! ./tasks.component.css */ "./src/app/components/tasks/tasks.component.css"));
const taskline_component_1 = __webpack_require__(/*! ../taskline/taskline.component */ "./src/app/components/taskline/taskline.component.ts");
const guid_1 = __importDefault(__webpack_require__(/*! guid */ "./node_modules/guid/guid.js"));
/**
 * @description Top level component of the task list.
 * @class TasksComponent
 * @extends {WebzComponent}
 * @property {Notifier<TaskData[]>} saveData - event subject for the save event.  emits the task data when the save event is triggered.
 * @memberof TasksComponent
 */
let TasksComponent = (() => {
    var _a;
    let _classSuper = webz_1.WebzComponent;
    let _instanceExtraInitializers = [];
    let _addDisabled_decorators;
    let _addDisabled_initializers = [];
    let _addDisabled_extraInitializers = [];
    let _onAddTask_decorators;
    let _onClearTasks_decorators;
    let _counterfn_decorators;
    return _a = class TasksComponent extends _classSuper {
            /**
             * @description Extracts the task data for the component from the task lines.
             * @memberof TasksComponent
             * @type {TaskData[]}
             */
            get taskData() {
                return this.taskLines.map((task) => task.data);
            }
            /**
             * @description Sets the task data for the component by creating new task lines for the data.
             * @memberof TasksComponent
             * @type {TaskData[]}
             * @example
             * this.taskData = [{taskText: "Task 1"}, {taskText: "Task 2"}];
             */
            set taskData(data) {
                this.taskLines.forEach((line) => {
                    this.removeComponent(line);
                });
                this.taskLines = [];
                data.forEach((task) => {
                    let line = new taskline_component_1.TasklineComponent(task);
                    this.addComponent(line, "task-list");
                    this.taskLines.push(line);
                    this.wireUpTaskLine(line);
                    line.disableEditing();
                });
                this.taskLines.forEach((task) => {
                    task.disableViewButtons(false);
                });
                this.addDisabled = "";
            }
            /**
             * @description Creates an instance of TasksComponent.
             * @param {TaskData[]} [data=[]] - the task data to initialize the component with.
             * @memberof TasksComponent
             * @constructor
             */
            constructor(data = []) {
                super(tasks_component_html_1.default, tasks_component_css_1.default);
                /**
                 * @description CSS class for the add button when it is disabled.
                 * @memberof TasksComponent
                 * @type {string}
                 * @default ""
                 * @summary Binds the value to the className of add-task id in the html file.
                 */
                this.addDisabled = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _addDisabled_initializers, void 0));
                this.taskLines = (__runInitializers(this, _addDisabled_extraInitializers), []);
                this.counter = 0;
                /**
                 * @description Event subject for the save event.  emits the task data when the save event is triggered.
                 * @memberof TasksComponent
                 * @type {Notifier<TaskData[]>}
                 * @example
                 * this.saveData.subscribe((data) => {
                 *    console.log(data);
                 * });
                 */
                this.saveData = new webz_1.Notifier();
                this.addDisabled = "";
                this.taskData = data;
            }
            /**
             * @description Event handler for the add task button.  Adds a new task line to the list.
             * @memberof TasksComponent
             * @method onAddTask
             * @summary Binds the method to the add-task id in the html file.
             * @private
             */
            onAddTask() {
                let taskLine = new taskline_component_1.TasklineComponent();
                this.addComponent(taskLine, "task-list", true);
                this.taskLines.unshift(taskLine);
                this.wireUpTaskLine(taskLine);
                taskLine.startEditing();
            }
            /**
             * @description Event handler for the clear tasks button.  Clears all tasks from the list.
             * @memberof TasksComponent
             * @method onClearTasks
             * @summary Binds the method to the clear-tasks id in the html file.
             * @private
             */
            onClearTasks() {
                if (this.taskLines.length === 0) {
                    webz_1.WebzDialog.popup(this, "There are no tasks to clear.", "Notice", ["Ok"], "btn btn-primary");
                }
                else {
                    webz_1.WebzDialog.popup(this, "Are you sure you want to clear all tasks?", "Warning", ["Yes", "No", "Cancel"], "btn btn-primary").subscribe((result) => {
                        if (result === "Yes") {
                            this.taskLines.forEach((task) => {
                                this.removeComponent(task);
                            });
                            this.taskLines = [];
                            this.saveData.notify(this.taskData);
                        }
                    });
                }
            }
            /**
             * @description Connects the taskLine Notifiers to the TasksComponent.
             * @memberof TasksComponent
             * @method onDeleteAllTasks
             * @param {TasklineComponent} line - the task line to connect the events to.
             * @returns {void}
             * @summary Binds the lineEdit, lineEditClose, and lineDelete events to the line.
             * On Line edit, the add button is disabled and all child edit/cancel buttons are disabled.
             * On Line delete, the line is removed from the list and the component is removed.
             * On Line edit close, the add button is enabled and all child edit/cancel buttons are enabled.
             * @private
             */
            wireUpTaskLine(line) {
                //if we start editing, then we want to disable the add button and all child edit/cancel buttons
                line.lineEdit.subscribe(() => {
                    this.addDisabled = "disabled";
                    this.taskLines.forEach((task) => {
                        task.disableViewButtons();
                    });
                });
                //if we are deleting, then we want to remove the line from the list and remove the component
                line.lineDelete.subscribe(() => {
                    this.removeComponent(line);
                    this.taskLines.splice(this.taskLines.indexOf(line), 1);
                    this.saveData.notify(this.taskData);
                });
                //if we are closing editor, then we want to enable the add button and all child edit/cancel buttons
                line.lineEditClose.subscribe((save) => {
                    this.addDisabled = "";
                    this.taskLines.forEach((task) => {
                        task.disableViewButtons(false);
                    });
                    if (save) {
                        if (line.data.uniqueID === undefined) {
                            line.data.uniqueID = guid_1.default.create();
                        }
                        //save the data to a datasource
                        this.saveData.notify(this.taskData);
                    }
                    else if (line.data.uniqueID === undefined) {
                        this.removeComponent(line);
                        this.taskLines.splice(this.taskLines.indexOf(line), 1);
                    }
                });
            }
            /**
             * @description Event handler for the counter function.  Increments the counter and cancels the function when the counter reaches 15.
             * @memberof TasksComponent
             * @method counterfn
             * @param {CancelFunction} cancel - the function to call to cancel the timer.
             * @summary Calls the cancel function once per second until the counter reaches 15, then uses the supplied cancel function to kill the timer.
             * @private
             */
            counterfn(cancel) {
                this.counter++;
                console.log(this.counter);
                if (this.counter >= 15) {
                    cancel();
                }
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _addDisabled_decorators = [(0, webz_1.BindCSSClass)("add-task")];
            _onAddTask_decorators = [(0, webz_1.Click)("add-task")];
            _onClearTasks_decorators = [(0, webz_1.Click)("clear-tasks")];
            _counterfn_decorators = [(0, webz_1.Timer)(1000)];
            __esDecorate(_a, null, _onAddTask_decorators, { kind: "method", name: "onAddTask", static: false, private: false, access: { has: obj => "onAddTask" in obj, get: obj => obj.onAddTask }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onClearTasks_decorators, { kind: "method", name: "onClearTasks", static: false, private: false, access: { has: obj => "onClearTasks" in obj, get: obj => obj.onClearTasks }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _counterfn_decorators, { kind: "method", name: "counterfn", static: false, private: false, access: { has: obj => "counterfn" in obj, get: obj => obj.counterfn }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _addDisabled_decorators, { kind: "field", name: "addDisabled", static: false, private: false, access: { has: obj => "addDisabled" in obj, get: obj => obj.addDisabled, set: (obj, value) => { obj.addDisabled = value; } }, metadata: _metadata }, _addDisabled_initializers, _addDisabled_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TasksComponent = TasksComponent;


/***/ }),

/***/ "./src/app/components/taskviewer/taskviewer.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/components/taskviewer/taskviewer.component.ts ***!
  \***************************************************************/
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
exports.TaskviewerComponent = void 0;
const webz_1 = __webpack_require__(/*! @boots-edu/webz */ "./node_modules/@boots-edu/webz/index.js");
const taskviewer_component_html_1 = __importDefault(__webpack_require__(/*! ./taskviewer.component.html */ "./src/app/components/taskviewer/taskviewer.component.html"));
const taskviewer_component_css_1 = __importDefault(__webpack_require__(/*! ./taskviewer.component.css */ "./src/app/components/taskviewer/taskviewer.component.css"));
/**
 * @description Component for viewing a task.
 * @class TaskViewerComponent
 * @extends {WebzComponent}
 * @property {Notifier<void>} editing - event subject for the edit event.
 * @property {Notifier<void>} deleting - event subject for the delete event.
 * @property {TaskData} data - the task data for the viewer.
 * @method {setData} - sets the task data for the viewer.
 * @method {disableButtons} - disables the buttons.
 * @memberof TaskViewerComponent
 */
let TaskviewerComponent = (() => {
    var _a;
    let _classSuper = webz_1.WebzComponent;
    let _instanceExtraInitializers = [];
    let _taskview_decorators;
    let _taskview_initializers = [];
    let _taskview_extraInitializers = [];
    let _editDisabled_decorators;
    let _editDisabled_initializers = [];
    let _editDisabled_extraInitializers = [];
    let _deleteDisabled_decorators;
    let _deleteDisabled_initializers = [];
    let _deleteDisabled_extraInitializers = [];
    let _onEdit_decorators;
    let _onDelete_decorators;
    return _a = class TaskviewerComponent extends _classSuper {
            /**
             * @description Creates an instance of TaskViewerComponent.
             * @param {TaskData} [data={ taskText: "" }] - the task data to view.  If no task data is provided, the task text will be empty.
             * @memberof TaskViewerComponent
             */
            constructor(data = { taskText: "" }) {
                super(taskviewer_component_html_1.default, taskviewer_component_css_1.default);
                this.data = (__runInitializers(this, _instanceExtraInitializers), data);
                //event sources
                this.editing = new webz_1.Notifier();
                this.deleting = new webz_1.Notifier();
                this.taskview = __runInitializers(this, _taskview_initializers, "");
                this.editDisabled = (__runInitializers(this, _taskview_extraInitializers), __runInitializers(this, _editDisabled_initializers, ""));
                this.deleteDisabled = (__runInitializers(this, _editDisabled_extraInitializers), __runInitializers(this, _deleteDisabled_initializers, ""));
                __runInitializers(this, _deleteDisabled_extraInitializers);
                this.data = data;
                this.taskview = data.taskText;
            }
            /**
             * @description event handler for the edit button.  emits the editing event.
             * @memberof TaskViewerComponent
             */
            onEdit() {
                this.editing.notify();
            }
            /**
             * @description event handler for the delete button.  emits the deleting event.
             * @memberof TaskViewerComponent
             */
            onDelete() {
                webz_1.WebzDialog.popup(this, "Are you sure you want to delete this task?", "Confirm Delete", ["Yes", "No", "Cancel"], "btn btn-primary").subscribe((result) => {
                    if (result === "Yes")
                        this.deleting.notify();
                });
            }
            /**
             * @description sets the task data for the viewer.
             * @param {TaskData} data - the task data to view.
             * @memberof TaskViewerComponent
             */
            setData(data) {
                this.data = data;
                this.taskview = data.taskText;
            }
            /**
             * @description disables the buttons.
             * @param {boolean} [disable=true] - true to disable the buttons, false to enable them.
             * @memberof TaskViewerComponent
             */
            disableButtons(disable = true) {
                this.editDisabled = disable ? "disabled" : "";
                this.deleteDisabled = disable ? "disabled" : "";
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _taskview_decorators = [(0, webz_1.BindValue)("taskview")];
            _editDisabled_decorators = [(0, webz_1.BindCSSClass)("edit")];
            _deleteDisabled_decorators = [(0, webz_1.BindCSSClass)("delete")];
            _onEdit_decorators = [(0, webz_1.Click)("edit")];
            _onDelete_decorators = [(0, webz_1.Click)("delete")];
            __esDecorate(_a, null, _onEdit_decorators, { kind: "method", name: "onEdit", static: false, private: false, access: { has: obj => "onEdit" in obj, get: obj => obj.onEdit }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onDelete_decorators, { kind: "method", name: "onDelete", static: false, private: false, access: { has: obj => "onDelete" in obj, get: obj => obj.onDelete }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _taskview_decorators, { kind: "field", name: "taskview", static: false, private: false, access: { has: obj => "taskview" in obj, get: obj => obj.taskview, set: (obj, value) => { obj.taskview = value; } }, metadata: _metadata }, _taskview_initializers, _taskview_extraInitializers);
            __esDecorate(null, null, _editDisabled_decorators, { kind: "field", name: "editDisabled", static: false, private: false, access: { has: obj => "editDisabled" in obj, get: obj => obj.editDisabled, set: (obj, value) => { obj.editDisabled = value; } }, metadata: _metadata }, _editDisabled_initializers, _editDisabled_extraInitializers);
            __esDecorate(null, null, _deleteDisabled_decorators, { kind: "field", name: "deleteDisabled", static: false, private: false, access: { has: obj => "deleteDisabled" in obj, get: obj => obj.deleteDisabled, set: (obj, value) => { obj.deleteDisabled = value; } }, metadata: _metadata }, _deleteDisabled_initializers, _deleteDisabled_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TaskviewerComponent = TaskviewerComponent;


/***/ }),

/***/ "./src/app/main.component.ts":
/*!***********************************!*\
  !*** ./src/app/main.component.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MainComponent = void 0;
const main_component_html_1 = __importDefault(__webpack_require__(/*! ./main.component.html */ "./src/app/main.component.html"));
const main_component_css_1 = __importDefault(__webpack_require__(/*! ./main.component.css */ "./src/app/main.component.css"));
const webz_1 = __webpack_require__(/*! @boots-edu/webz */ "./node_modules/@boots-edu/webz/index.js");
const tasks_component_1 = __webpack_require__(/*! ./components/tasks/tasks.component */ "./src/app/components/tasks/tasks.component.ts");
/**
 * @description Top level component of the application.
 * @class MainComponent
 * @extends {WebzComponent}
 * @memberof MainComponent
 */
class MainComponent extends webz_1.WebzComponent {
    /**
     * @description Creates an instance of MainComponent.
     * @memberof MainComponent
     */
    constructor() {
        super(main_component_html_1.default, main_component_css_1.default);
        //using cookies for persistence.  In a real application we would use a database or some other form of storage like an API
        let savedData = window.localStorage.getItem("taskData");
        if (savedData) {
            let data = JSON.parse(savedData);
            this.taskComponent = new tasks_component_1.TasksComponent(data);
        }
        else {
            this.taskComponent = new tasks_component_1.TasksComponent();
        }
        this.addComponent(this.taskComponent, "task-target");
        this.taskComponent.saveData.subscribe((data) => {
            window.localStorage.setItem("taskData", JSON.stringify(data));
        });
    }
}
exports.MainComponent = MainComponent;


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