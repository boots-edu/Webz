import { WebzRouter, Route } from "./WebzRouter";
import { EventSubject } from "./eventsubject";
declare const window: Window;
/**
 * @description An enum for the HTTP methods
 * @export
 * @group AJAX Support
 * @enum {string}
 */
export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    OPTIONS = "OPTIONS",
}
/**
 * @description An interface for the size of the window
 * @export
 * @interface SizeInfo
 * @group Utility Types
 * @example const sizeInfo: SizeInfo = {
 *  windowWidth: window.innerWidth,
 *  windowHeight: window.innerHeight
 * };
 */
export interface SizeInfo {
    windowWidth: number;
    windowHeight: number;
}

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
export abstract class WebzComponent {
    private htmlElement: HTMLElement;
    /**
     * @hidden
     */
    protected router: WebzRouter | null = null;
    private shadow: ShadowRoot;
    private template: HTMLTemplateElement;
    private styles: HTMLStyleElement;

    private static resizeEvent: EventSubject<SizeInfo> =
        new EventSubject<SizeInfo>();

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
    public get onResizeEvent(): EventSubject<SizeInfo> {
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
    constructor(
        private html: string,
        private css: string,
    ) {
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
    public addComponent(
        component: WebzComponent,
        id: string = "root",
        front: boolean = false,
    ) {
        if (front) {
            if (id === "root") {
                if (this.shadow.firstChild)
                    this.shadow.insertBefore(
                        component.htmlElement,
                        this.shadow.firstChild,
                    );
            } else {
                let el: HTMLElement | null = this.shadow.getElementById(id);
                if (el) {
                    if (el.firstChild)
                        el.insertBefore(component.htmlElement, el.firstChild);
                    else el.appendChild(component.htmlElement);
                }
            }
        } else {
            if (id === "root") {
                this.shadow.appendChild(component.htmlElement);
            } else {
                let el: HTMLElement | null = this.shadow.getElementById(id);
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
    public addRouter(routes: Route[], id: string = "root"): void {
        if (this.router)
            throw new Error(
                "A router has already been added to this component",
            );
        this.router = new WebzRouter(this, routes, id);
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
    protected removeComponent(component: WebzComponent): WebzComponent {
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
    public appendToDomElement(domElement: HTMLElement) {
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
    static ajax<T = any>(
        url: string,
        method: HttpMethod,
        headers: any[] = [],
        data?: any,
    ): EventSubject<T> {
        const evt: EventSubject<T> = new EventSubject<T>();
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        for (let header of headers) {
            Object.keys(header).forEach((key) => {
                if (header[key]) xhr.setRequestHeader(key, header[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                evt.next(JSON.parse(xhr.responseText));
            } else {
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
    public getWindowSize(): SizeInfo {
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
    focus(elementId: string) {
        let el = this.shadow.getElementById(elementId);
        if (el) el.focus();
    }

    /**
     * @description Click an element on this component
     * @param {string} elementId The id of the element to click
     * @returns void
     */
    click(elementId: string) {
        let el = this.shadow.getElementById(elementId);
        if (el) el.click();
    }

    /**
     * @description Get the value of an element on this component.
     * @param {string} elementId The id of the element to get the value of
     * @returns string | undefined
     * @throws Error when element does not have a value property or does not exist
     * @memberof
     */
    getValue(elementId: string): string {
        const element = this.shadow.getElementById(elementId);
        if (element instanceof HTMLInputElement)
            return (element as HTMLInputElement).value;
        else if (element instanceof HTMLTextAreaElement)
            return (element as HTMLTextAreaElement).value;
        else if (element instanceof HTMLSelectElement)
            return (element as HTMLSelectElement).value;
        else if (element instanceof HTMLOptionElement)
            return (element as HTMLOptionElement).value;
        else throw new Error("Element does not have a value property");
    }
}
