interface CallbackDescription {
    id: number;
    fn: (value: any) => void;
}
export class EventSubject<T = void> {
    refCount: number = 0;
    private callbacks: CallbackDescription[] = [];
    private errorFns: CallbackDescription[] = [];
    constructor() {}

    /**
     * Subscribe to the event subject
     * @param callback The callback to call when the event is triggered
     * @param error The callback to call when an error is triggered
     * @returns The id of the subscription
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value) => {
     *  console.log(value);
     * });
     * subject.next(1);
     * subject.unsubscribe(id);
     */
    subscribe(callback: (value: T) => void, error?: (value: Error) => void) {
        this.callbacks.push({ id: this.refCount, fn: callback });
        if (error) this.errorFns.push({ id: this.refCount, fn: error });
        return this.refCount++;
    }
    /**
     * Unsubscribe from the event subject
     * @param id The id of the subscription to remove
     * @returns void
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value) => {
     *   console.log(value);
     * });
     * subject.next(1);
     * subject.unsubscribe(id);
     */
    unsubscribe(id: number) {
        this.callbacks = this.callbacks.filter((cb) => cb.id !== id);
        this.errorFns = this.errorFns.filter((cb) => cb.id !== id);
    }

    /**
     * Trigger the event subject
     * @param value The value to pass to the callback
     * @returns void
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value) => {
     *   console.log(value);
     * });
     * subject.next(1);
     * subject.unsubscribe(id);
     */
    next(value: T) {
        for (const callback of this.callbacks) callback.fn(value);
    }

    /**
     * Trigger the error event subject
     * @param value The value to pass to the callback
     * @returns void
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value) => {
     *   console.log(value);
     * }, (error) => {
     *  console.error(error);
     * });
     * subject.error(new Error("It doesnt't work!"));
     * subject.unsubscribe(id);
     */
    error(value: Error) {
        for (const errorFn of this.errorFns) errorFn.fn(value);
    }

    /**
     * Convert the event subject to a promise
     * @returns Promise<T>
     * @example
     * const subject = new EventSubject<number>();
     * const promise = subject.toPromise();
     * subject.next(1);
     * promise.then((value) => {
     *  console.log(value);
     * }).catch((error) => {
     *  console.error(error);
     * });
     * subject.unsubscribe(id);
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
