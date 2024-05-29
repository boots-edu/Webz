/**
 * CallbackDescription
 * @description The type of the subscribe callback
 * @export
 * @interface CallbackDescription
 * @group Type Aliases
 */
interface CallbackDescription {
    id: number;
    fn: (value: any) => void;
}

/**
 * Notifier
 * @description A class for creating events
 * @export
 * @class Notifier
 * @group Async Event Sources
 */
export class Notifier<T = void> {
    private refCount: number = 0;
    private callbacks: CallbackDescription[] = [];
    private errorFns: CallbackDescription[] = [];
    constructor() {}

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
    subscribe(callback: (value: T) => void, error?: (value: Error) => void) {
        this.callbacks.push({ id: this.refCount, fn: callback });
        if (error) this.errorFns.push({ id: this.refCount, fn: error });
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
    unsubscribe(id: number) {
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
    next(value: T) {
        for (const callback of this.callbacks) callback.fn(value);
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
    notify(value: T) {
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
    error(value: Error) {
        for (const errorFn of this.errorFns) errorFn.fn(value);
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
    toPromise(): Promise<T> {
        return new Promise((resolve, reject) => {
            this.subscribe(
                (value: T) => {
                    resolve(value);
                },
                (error) => {
                    reject(error);
                },
            );
        });
    }
}
