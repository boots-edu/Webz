import { EzComponent } from "./EzComponent";

declare const window: Window;

/**
 * @description Type of timer cancel events
 */
export declare type TimerCancelFunction = () => void;

/**
 * @description Decorator to bind a generic event to an element
 * @param htmlElementID the element to bind the event to
 * @param type the event to bind
 * @returns DecoratorCallback
 * @export
 * @example
 * @GenericEvent("myButton", "click")
 * myButtonClick(e: MouseEvent) {
 *    console.log("Button was clicked");
 * }
 */
export function GenericEvent<K extends keyof HTMLElementEventMap>(
    htmlElementID: string,
    type: K,
) {
    return function <This extends EzComponent>(
        target: (this: This, event: HTMLElementEventMap[K]) => void,
        context: ClassMethodDecoratorContext<
            This,
            (this: This, event: HTMLElementEventMap[K]) => void
        >,
    ): void {
        context.addInitializer(function (this: This) {
            let element: HTMLElement | null =
                this["shadow"].getElementById(htmlElementID);
            if (element) {
                element.addEventListener(type, (e: HTMLElementEventMap[K]) => {
                    target.call(this, e);
                });
            }
        });
    };
}

/**
 * @description Decorator to bind a window event to the window
 * @param type the event to bind
 * @returns DecoratorCallback
 * @export
 * @example
 * @WindowEvent("resize")
 * onResize(e: WindowEvent) {
 *   console.log("Window was resized");
 * }
 */
export function WindowEvent<K extends keyof WindowEventMap>(type: K) {
    return function <This extends EzComponent>(
        target: (this: This, event: WindowEventMap[K]) => void,
        context: ClassMethodDecoratorContext<
            This,
            (this: This, event: WindowEventMap[K]) => void
        >,
    ): void {
        context.addInitializer(function (this: This) {
            window.addEventListener(type, (e: WindowEventMap[K]) => {
                target.call(this, e);
            });
        });
    };
}

/**
 * @description Decorator to bind a click event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @example
 * @Click("myButton")
 * myButtonClick(e: MouseEvent) {
 *   console.log("Button was clicked");
 * }
 */
export function Click(htmlElementID: string) {
    return GenericEvent(htmlElementID, "click");
}

/**
 * @description Decorator to bind a blur event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @example
 * @Blur("myInput")
 * myInputBlur(e: FocusEvent) {
 *  console.log("Input lost focus");
 * }
 */
export function Blur(htmlElementID: string) {
    return GenericEvent(htmlElementID, "blur");
}

/**
 * @description Decorator to bind a change event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @example
 * @Change("myInput")
 * myInputChange(e: ChangeEvent) {
 *   console.log("Input changed");
 */
export function Change(htmlElementID: string) {
    return GenericEvent(htmlElementID, "change");
}

/**
 * @description Decorator to bind an input event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @example
 * @Input("myInput")
 * myInputChange(e: InputEvent) {
 *  console.log("Input changed");
 * }
 */
export function Input(htmlElementID: string) {
    return GenericEvent(htmlElementID, "input");
}

/**
 * @description Decorator to call a method periodically with a timer
 * @param intervalMS the interval in milliseconds to call the method
 * @returns DecoratorCallback
 * @note This executes repeatedly.  The decorated function is passed a cancel function that can be called to stop the timer.
 * @export
 * @example
 * let counter=0;
 * @Timer(1000)
 * myTimerMethod(cancel: TimerCancelMethod) {
 *   console.log("Timer method called once per second");
 *   if (counter++ > 5) cancel();
 */
export function Timer(intervalMS: number) {
    return function <This extends EzComponent, Value extends () => void>(
        target: (this: This, cancelFn: TimerCancelFunction) => void,
        context: ClassMethodDecoratorContext<
            This,
            (this: This, cancel: Value) => void
        >,
    ): void {
        context.addInitializer(function (this: This) {
            const intervalID = setInterval(() => {
                target.call(this, () => {
                    clearInterval(intervalID);
                });
            }, intervalMS);
        });
    };
}
