import { WebzComponent } from "./WebzComponent";

declare const window: Window;

type Constructor<T> = { new (...args: any[]): T };

/** @hidden */
export function bootstrap<T extends WebzComponent>(
    target: Constructor<T>,
    testModeHTML: string = "",
    ...args: any[]
): T {
    if (testModeHTML.length > 0) {
        window.document.body.innerHTML = testModeHTML;
    }
    let obj: T = Object.assign(new target(...args)) as T;
    const element = window.document.getElementById("main-target");

    if (element) obj.appendToDomElement(element);
    else obj.appendToDomElement(window.document.body);
    return obj;
}
