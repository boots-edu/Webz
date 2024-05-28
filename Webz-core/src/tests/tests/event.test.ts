import {
    describe,
    jest,
    expect,
    test,
    beforeAll,
    afterEach,
} from "@jest/globals";
import { bootstrap } from "../../bootstrap";
import { TestComponent } from "../testing_components/test.component";
import { TestComponent2 } from "../testing_components/test.component2";

declare const window: Window;

describe("Webz-Event", () => {
    let toplevel: any = undefined;
    describe("Constructor", () => {
        beforeAll(() => {
            const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
            toplevel = bootstrap<TestComponent>(TestComponent, html);
        });
        test("Create Instance", () => {
            expect(toplevel).toBeInstanceOf(TestComponent);
        });
    });
    describe("Single Events:Parent", () => {
        beforeAll(() => {
            const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
            toplevel = bootstrap<TestComponent>(TestComponent, html);
        });
        test("Click event on parent", () => {
            toplevel.testVal = false;
            expect(toplevel.testVal).toBe(false);
            toplevel["shadow"].getElementById("evtButton1").click();
            expect(toplevel.testVal).toBe(true);
            toplevel.testVal2 = false;
            expect(toplevel.testVal2).toBe(false);
            toplevel["shadow"].getElementById("evtDiv1").click();
            expect(toplevel.testVal2).toBe(true);
        });
        test("Stacked click event on parent", () => {
            toplevel.testVal3 = 0;
            expect(toplevel.testVal3).toBe(0);
            toplevel["shadow"].getElementById("evtDiv2").click();
            expect(toplevel.testVal3).toBe(1);
            toplevel["shadow"].getElementById("evtButton2").click();
            expect(toplevel.testVal3).toBe(2);
        });
        test("Test other events", () => {
            const el = toplevel["shadow"].getElementById(
                "evtInput1",
            ) as HTMLInputElement;
            toplevel.testVal4 = "";
            el.value = "test";
            el.dispatchEvent(new Event("change"));
            expect(toplevel.testVal4).toBe("test");
            el.value = "test2";
            el.dispatchEvent(new Event("input"));
            expect(toplevel.testVal4).toBe("test2");
            el.value = "test3";
            el.dispatchEvent(new Event("change"));
            expect(toplevel.testVal4).toBe("test3");
        });
    });
    describe("Checkbox Event Tests", () => {
        test("Checkbox Change Event", () => {
            let toplevel: any = undefined;
            toplevel = bootstrap<TestComponent>(TestComponent);
            const el = toplevel["shadow"].getElementById(
                "bindCheck24",
            ) as HTMLInputElement;
            expect(toplevel).toBeInstanceOf(TestComponent);
            expect(toplevel.testVal5).toEqual("");
            el.checked = true;
            el.dispatchEvent(new Event("change"));
            expect(toplevel.testVal5).toEqual("on");
            el.checked = false;
            el.dispatchEvent(new Event("change"));
            expect(toplevel.testVal5).toEqual("");
        });
    });
    describe("Events:Grandchild", () => {
        beforeAll(() => {
            const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
            toplevel = bootstrap<TestComponent>(TestComponent, html);
        });
        test("Click event on grandchild", () => {
            //***TODO */
            toplevel.child1.baby1.testVal = false;
            expect(toplevel.child1.baby1.testVal).toBe(false);
            toplevel.child1.baby1["shadow"]
                .getElementById("evtButton1")
                .click();
            expect(toplevel.child1.baby1.testVal).toBe(true);
        });
    });
    describe("Events: Lists", () => {
        beforeAll(() => {
            const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
            toplevel = bootstrap<TestComponent2>(TestComponent2, html);
        });
        test("change event on simple list", () => {
            let parent = toplevel["shadow"].getElementById("radio1")
                .parentElement as HTMLElement;
            (parent.children[2] as HTMLInputElement).click();
            parent.children[2].dispatchEvent(new Event("change"));
            expect(toplevel.testVal1).toBe("world");
        });
        test("change event on deeply embedded element in list", () => {
            let parent = toplevel["shadow"].getElementById("div2")
                .parentElement as HTMLElement;
            let el = parent.children[2].getElementsByTagName(
                "input",
            )[0] as HTMLInputElement;
            el.click();
            el.dispatchEvent(new Event("change"));
            expect(toplevel.testval2).toBe("am");
        });
    });
    describe("Timer Test", () => {
        beforeAll(() => {
            jest.useFakeTimers();
            const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
            toplevel = bootstrap<TestComponent>(TestComponent, html);
        });
        test("Test timer after interval", () => {
            toplevel.fn = jest.fn();
            expect(toplevel.fn).toHaveBeenCalledTimes(0);
            jest.advanceTimersByTime(1005);
            expect(toplevel.fn).toHaveBeenCalledTimes(1);
            jest.advanceTimersByTime(500);
            expect(toplevel.fn).toHaveBeenCalledTimes(1);
            jest.advanceTimersByTime(3500);
            expect(toplevel.fn).toHaveBeenCalledTimes(5);
            jest.advanceTimersByTime(10000);
            expect(toplevel.fn).toHaveBeenCalledTimes(5);
            expect(toplevel.timerTest1).toBe(5);
        });
        afterEach(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });
    });
    describe("Window Events", () => {
        test("Test window events", () => {
            const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
            toplevel = bootstrap<TestComponent>(TestComponent, html);
            const event = new Event("resize");
            window.dispatchEvent(event);
        });
    });
});
