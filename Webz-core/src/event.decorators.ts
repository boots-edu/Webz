import { WebzComponent } from "./WebzComponent";

declare const window: Window;

/**
 * @description Type of timer cancel events
 */
export declare type TimerCancelFunction = () => void;

/**
 * @description Returned by input and change events.  Has a value property.
 * @export
 * @interface ValueEvent
 * @extends {Event}
 * @group Event Types
 * @example @Change("myInput")
 * myInputChange(e: ValueEvent) {
 *  console.log("Input changed to " + e.value);
 * }
 */
export interface ValueEvent extends Event {
    value: string;
}

/** @ignore */
export interface ExtendedEventMap extends HTMLElementEventMap {
    input: ValueEvent;
    change: ValueEvent;
}

/** @ignore */
declare global {
    interface HTMLElement {
        addEventListener<K extends keyof ExtendedEventMap>(
            type: K,
            listener: (this: HTMLElement, ev: ExtendedEventMap[K]) => any,
            options?: boolean | AddEventListenerOptions,
        ): void;
    }
}

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
export function GenericEvent<K extends keyof HTMLElementEventMap>(
    htmlElementID: string,
    type: K,
) {
    return function <This extends WebzComponent>(
        target: (this: This, event: ExtendedEventMap[K]) => void,
        context: ClassMethodDecoratorContext<
            This,
            (this: This, event: ExtendedEventMap[K]) => void
        >,
    ): void {
        context.addInitializer(function (this: This) {
            let element: HTMLElement | null =
                this["shadow"].getElementById(htmlElementID);
            if (element) {
                element.addEventListener(type, (e: ExtendedEventMap[K]) => {
                    if (type === "input" || type === "change")
                        if ((element as HTMLInputElement).type === "checkbox") {
                            (e as ValueEvent).value =
                                (element as HTMLInputElement).checked ?
                                    "on"
                                :   "";
                        } else {
                            (e as ValueEvent).value = (
                                element as HTMLInputElement
                            ).value;
                        }
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
 * @group Event Decorators
 * @example
 * @WindowEvent("resize")
 * onResize(e: WindowEvent) {
 *   console.log("Window was resized");
 * }
 */
export function WindowEvent<K extends keyof WindowEventMap>(type: K) {
    return function <This extends WebzComponent>(
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
 * @group Event Decorators
 * @example
 * @Click("myButton")
 * myButtonClick(e: MouseEvent) {
 *   console.log("Button was clicked");
 * }
 */
export function Click<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    This extends WebzComponent,
>(htmlElementID: string) {
    return GenericEvent(htmlElementID, "click");
}

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
export function Blur<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    This extends WebzComponent,
>(htmlElementID: string) {
    return GenericEvent(htmlElementID, "blur");
}

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
export function Change<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    This extends WebzComponent,
>(htmlElementID: string) {
    return GenericEvent(htmlElementID, "change");
}

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
export function Input<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    This extends WebzComponent,
>(htmlElementID: string) {
    return GenericEvent(htmlElementID, "input");
}

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
export function Timer<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    This extends WebzComponent,
>(intervalMS: number) {
    return function <This extends WebzComponent, Value extends () => void>(
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
