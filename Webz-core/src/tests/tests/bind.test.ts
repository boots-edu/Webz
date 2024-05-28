import { describe, expect, test, beforeAll } from "@jest/globals";
import { bootstrap } from "../../bootstrap";
import { TestComponent } from "../testing_components/test.component";
import {
    BadAttributeComponent,
    BadCssComponent,
    BadStyleComponent,
    BadValueComponent,
} from "../testing_components/exceptions/bad.components";
import { TestComponent2 } from "../testing_components/test.component2";

describe("Webz-Bind", () => {
    let toplevel: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        toplevel = bootstrap<TestComponent>(TestComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(toplevel).toBeInstanceOf(TestComponent);
        });
    });
    describe("Bind:Parent", () => {
        test("Bind innerHtml single", () => {
            let el = toplevel["shadow"].getElementById(
                "bindDiv1",
            ) as HTMLElement;
            expect(toplevel.testbind1).toBe("hello");
            expect(el.innerHTML).toEqual("hello");
            toplevel.testbind1 = "testing";
            expect(toplevel.testbind1).toBe("testing");
            expect(el.innerHTML).toEqual("testing");
        });
        test("Bind value single", () => {
            const el = toplevel["shadow"].getElementById(
                "bindInput1",
            ) as HTMLInputElement;
            expect(toplevel.testbind2).toBe("hello");
            expect(el.value).toEqual("hello");
            toplevel.testbind2 = "testing";
            expect(toplevel.testbind2).toBe("testing");
            expect(el.value).toEqual("testing");
            el.value = "not testing";
            el.dispatchEvent(new Event("input"));
            expect(toplevel.testbind2).toBe("not testing");
            toplevel.testbind2 = "hello";
        });
        test("Stacked Binders all InnerHTML", () => {
            let el1 = toplevel["shadow"].getElementById(
                "bindDiv2",
            ) as HTMLElement;
            let el2 = toplevel["shadow"].getElementById(
                "bindDiv3",
            ) as HTMLElement;
            expect(toplevel.testbind3).toBe("hello");
            expect(el1.innerHTML).toEqual("hello");
            expect(el2.innerHTML).toEqual("hello");
            toplevel.testbind3 = "testing";
            expect(toplevel.testbind3).toBe("testing");
            expect(el1.innerHTML).toEqual("testing");
            expect(el2.innerHTML).toEqual("testing");
        });
        test("Stacked Binders with BindValue", () => {
            let el1 = toplevel["shadow"].getElementById(
                "bindDiv4",
            ) as HTMLElement;
            let el2 = toplevel["shadow"].getElementById(
                "bindDiv5",
            ) as HTMLElement;
            let el3 = toplevel["shadow"].getElementById(
                "bindInput2",
            ) as HTMLInputElement;

            expect(toplevel.testbind4).toBe("hello");
            expect(el1.innerHTML).toEqual("hello");
            expect(el2.innerHTML).toEqual("hello");
            expect(el3.value).toEqual("hello");
            toplevel.testbind4 = "testing";
            expect(toplevel.testbind4).toBe("testing");
            expect(el1.innerHTML).toEqual("testing");
            expect(el2.innerHTML).toEqual("testing");
            expect(el3.value).toEqual("testing");
            el3.value = "not testing";
            el3.dispatchEvent(new Event("input"));
            expect(toplevel.testbind4).toBe("not testing");
            expect(el1.innerHTML).toBe("not testing");
            expect(el2.innerHTML).toBe("not testing");
            expect(el3.value).toBe("not testing");
        });
        test("Single Binders with CSSClass", () => {
            let el = toplevel["shadow"].getElementById(
                "bindDiv13",
            ) as HTMLElement;
            expect(toplevel.testcss2).toContain("btn");
            expect(el.className).toContain("btn");
            expect(el.className).not.toContain("btn2");
            toplevel.testcss2 = "btn2";
            expect(toplevel.testcss2).toContain("btn2");
            expect(el.className).toContain("btn2");
            el = toplevel["shadow"].getElementById("bindDiv14") as HTMLElement;
            expect(el.className).toContain("title");
            toplevel.testcss3 = false;
            expect(toplevel.testcss3).toBe(false);
            expect(el.className).not.toContain("title");
            toplevel.testcss3 = true;
            expect(toplevel.testcss3).toBe(true);
            expect(el.className).toContain("title");
            el = toplevel["shadow"].getElementById("bindDiv15") as HTMLElement;
            expect(el.className).not.toContain("title");
            toplevel.testcss4 = true;
            expect(toplevel.testcss4).toBe(true);
            expect(el.className).toContain("title");
            toplevel.testcss4 = false;
            expect(toplevel.testcss4).toBe(false);
            expect(el.className).not.toContain("title");
        });
        test("Stacked Binders with CSSClass", () => {
            let el1 = toplevel["shadow"].getElementById(
                "bindDiv11",
            ) as HTMLElement;
            let el2 = toplevel["shadow"].getElementById(
                "bindDiv12",
            ) as HTMLElement;
            expect(toplevel.testcss1).toContain("btn");
            expect(el1.className).toContain("btn");
            expect(el2.className).toContain("btn");
            expect(el2.className).not.toContain("btn2");
            toplevel.testcss1 = " btn2";
            expect(toplevel.testcss1).toContain("btn2");
            expect(el1.className).toContain("btn2");
            expect(el2.className).toContain("btn2");
            let el = toplevel["shadow"].getElementById(
                "bindDiv15",
            ) as HTMLElement;
            expect(el.className).not.toContain("header");
            expect(el.className).not.toContain("title");
            toplevel.testcss5 = true;
            expect(toplevel.testcss5).toBe(true);
            expect(el.className).toContain("header");
            expect(el.className).toContain("title");
            toplevel.testcss5 = false;
            expect(toplevel.testcss5).toBe(false);
            expect(el.className).not.toContain("header");
            expect(el.className).not.toContain("title");
            el = toplevel["shadow"].getElementById("bindDiv16") as HTMLElement;
            expect(el.className).toContain("title");
            toplevel.testcss6 = false;
            expect(toplevel.testcss6).toBe(false);
            expect(el.className).not.toContain("header");
            expect(el.className).not.toContain("title");
            toplevel.testcss6 = true;
            expect(toplevel.testcss6).toBe(true);
            expect(el.className).toContain("header");
            expect(el.className).toContain("title");
            el = toplevel["shadow"].getElementById("bindDiv17") as HTMLElement;
            expect(el.className).not.toContain("title");
            expect(el.className).toContain("initial");
        });
        test("Single Binders with BindStyle", () => {
            let el = toplevel["shadow"].getElementById(
                "styleDiv1",
            ) as HTMLElement;
            expect(toplevel.testStyle1).toBe("red");
            expect(el.style.color).toBe("red");
            toplevel.testStyle1 = "blue";
            expect(toplevel.testStyle1).toBe("blue");
            expect(el.style.color).toBe("blue");
        });
        test("Stacked Binders with BindStyle", () => {
            let el1 = toplevel["shadow"].getElementById(
                "styleDiv2",
            ) as HTMLElement;
            let el2 = toplevel["shadow"].getElementById(
                "styleDiv3",
            ) as HTMLElement;
            expect(toplevel.testStyle2).toBe("blue");
            expect(el1.style.color).toBe("blue");
            expect(el2.style.color).toBe("blue");
            toplevel.testStyle2 = "red";
            expect(toplevel.testStyle2).toBe("red");
            expect(el1.style.color).toBe("red");
            expect(el2.style.color).toBe("red");
        });
        test("BindStyleToNumberAppendPx", () => {
            let el = toplevel["shadow"].getElementById(
                "styleDiv4",
            ) as HTMLElement;
            expect(toplevel.testStyle4).toBe(100);
            expect(el.style.width).toBe("100px");
            toplevel.testStyle4 = 50;
            expect(toplevel.testStyle4).toBe(50);
            expect(el.style.width).toBe("50px");
        });
        test("Single Binders with BindAttribute", () => {
            let el = toplevel["shadow"].getElementById(
                "attribBtn1",
            ) as HTMLButtonElement;
            expect(toplevel.testAttrib1).toBe(false);
            expect(el.disabled).toBe(false);
            toplevel.testAttrib1 = true;
            expect(toplevel.testAttrib1).toBe(true);
            expect(el.disabled).toBe(true);
        });
        test("Stacked Binders with BindAttribute", () => {
            let el1 = toplevel["shadow"].getElementById(
                "attribImg1",
            ) as HTMLImageElement;
            let el2 = toplevel["shadow"].getElementById(
                "attribDiv1",
            ) as HTMLElement;
            toplevel.testAttrib2 = "testing";
            expect(toplevel.testAttrib2).toBe("testing");
            expect(el1.src).toBe("http://localhost/testing");
            expect(el2.innerHTML).toBe("testing");
            toplevel.testAttrib2 = "testing2";
            expect(toplevel.testAttrib2).toBe("testing2");
            expect(el1.src).toBe("http://localhost/testing2");
            expect(el2.innerHTML).toBe("testing2");
            toplevel.testAttrib5 = false;
            expect(toplevel.testAttrib5).toBe(false);
            toplevel.testAttrib5 = true;
            expect(toplevel.testAttrib5).toBe(true);
        });
        test("Test Binders on value elements", () => {
            let el1 = toplevel["shadow"].getElementById(
                "bindTa1",
            ) as HTMLTextAreaElement;
            let el2 = toplevel["shadow"].getElementById(
                "bindSel1",
            ) as HTMLSelectElement;
            let el3 = toplevel["shadow"].getElementById(
                "bindOpt1",
            ) as HTMLOptionElement;
            expect(toplevel.testTa1).toBe("hello");
            expect(el1.value).toBe("hello");
            toplevel.testTa1 = "testing";
            expect(el1.value).toBe("testing");
            expect(toplevel.testSel1).toBe("2");
            expect(el2.value).toBe("2");
            toplevel.testSel1 = "3";
            expect(el2.value).toBe("3");
            expect(toplevel.testOpt1).toBe("99");
            expect(el3.value).toBe("99");
            expect(el3.text).toBe("99");
            toplevel.testOpt1 = "100";
            expect(el3.value).toBe("100");
            expect(el3.text).toBe("100");
        });
        test("Test Binders on value elements stacked", () => {
            let el1 = toplevel["shadow"].getElementById(
                "bindTa2",
            ) as HTMLTextAreaElement;
            let el2 = toplevel["shadow"].getElementById(
                "bindSel2",
            ) as HTMLSelectElement;
            let el3 = toplevel["shadow"].getElementById(
                "bindOpt2",
            ) as HTMLOptionElement;
            let el4 = toplevel["shadow"].getElementById(
                "bindInput3",
            ) as HTMLInputElement;
            expect(toplevel.testTa2).toBe("hello");
            expect(el1.value).toBe("hello");
            toplevel.testTa2 = "testing";
            expect(el1.value).toBe("testing");
            expect(toplevel.testSel2).toBe("2");
            expect(el2.value).toBe("2");
            toplevel.testSel2 = "3";
            expect(el2.value).toBe("3");
            expect(toplevel.testOpt2).toBe("99");
            expect(el3.value).toBe("99");
            expect(el3.text).toBe("99");
            toplevel.testOpt2 = "100";
            expect(el3.value).toBe("100");
            expect(el3.text).toBe("100");
            expect(toplevel.testInput3).toBe("hello");
            expect(el4.value).toBe("hello");
            toplevel.testInput3 = "testing";
            expect(el4.value).toBe("testing");
        });
        describe("Test Specialty boolean Binders", () => {
            test("BindDisabledToBoolean", () => {
                let el1 = toplevel["shadow"].getElementById(
                    "bindBtn22",
                ) as HTMLButtonElement;
                expect(toplevel.testDisabled1).toBe(true);
                expect(el1.disabled).toBeTruthy();
                toplevel.testDisabled1 = false;
                expect(el1.disabled).toBeFalsy();
                toplevel.testDisabled1 = true;
                expect(el1.disabled).toBeTruthy();
            });
            test("BindVisibleToBoolean", () => {
                let el2 = toplevel["shadow"].getElementById(
                    "bindDiv23",
                ) as HTMLElement;
                expect(toplevel.testVisible1).toBe(false);
                expect(el2.style.display).toBe("none");
                toplevel.testVisible1 = true;
                expect(el2.style.display).toBe("block");
                toplevel.testVisible1 = false;
                expect(el2.style.display).toBe("none");
            });
            test("BindCheckedToBoolean", () => {
                let el3 = toplevel["shadow"].getElementById(
                    "bindCheck24",
                ) as HTMLInputElement;
                expect(toplevel.testChecked1).toBe(true);
                expect(el3.checked).toBeTruthy();
                toplevel.testChecked1 = false;
                expect(el3.checked).toBeFalsy();
                toplevel.testChecked1 = true;
                expect(el3.checked).toBeTruthy();
            });
            test("BindCheckedToBoolean clicking", () => {
                let el4 = toplevel["shadow"].getElementById(
                    "bindCheck25",
                ) as HTMLInputElement;
                expect(toplevel.testChecked2).toBe(true);
                expect(el4.checked).toBeTruthy();
                // Simulate click to change checked status
                el4.click();
                expect(el4.checked).toBeFalsy();
                expect(toplevel.testChecked2).toBe(false);
                el4.click();
                expect(el4.checked).toBeTruthy();
                expect(toplevel.testChecked2).toBe(true);
                // Should still be able to control the value
                toplevel.testChecked2 = false;
                expect(el4.checked).toBeFalsy();
                toplevel.testChecked2 = true;
                expect(el4.checked).toBeTruthy();
            });
        });
    });

    describe("Bind:Lists", () => {
        beforeAll(() => {
            const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
            toplevel = bootstrap<TestComponent2>(TestComponent2, html);
        });
        test("Simple list bind stacked", () => {
            let parent = toplevel["shadow"].getElementById("list1")
                .parentElement as HTMLElement;
            expect(parent.children.length).toBe(3);
            parent = toplevel["shadow"].getElementById("list1")
                .parentElement as HTMLElement;
            expect(parent.children.length).toBe(3);
            for (let i = 1; i < parent.children.length; i++) {
                expect(parent.children[i].innerHTML).toBe(
                    `${toplevel.testList1[i - 1]}`,
                );
            }
            toplevel.testList1.push("new");
            expect(parent.children.length).toBe(4);
            expect(parent.children[3].innerHTML).toBe("new");
            toplevel.testList1.pop();
            expect(parent.children.length).toBe(3);
            toplevel.testList1[0] = "something";
            expect(parent.children[1].innerHTML).toBe("something");
        });
        test("checkbox list bind to number with transform", () => {
            let parent = toplevel["shadow"].getElementById("checkbox1")
                .parentElement as HTMLElement;
            expect(parent.children.length).toBe(4);
        });
        test("radio list bind", () => {
            let parent = toplevel["shadow"].getElementById("radio1")
                .parentElement as HTMLElement;
            expect(parent.children.length).toBe(3);
        });
        test("deep bind list", () => {
            let parent = toplevel["shadow"].getElementById("div2")
                .parentElement as HTMLElement;
            expect(parent.children.length).toBe(5);
            toplevel.testList4.push("new");
            expect(parent.children.length).toBe(6);
            toplevel.testList4.pop();
            expect(parent.children.length).toBe(5);
            toplevel.testList4[0] = "something";
        });
    });
});
describe("Exceptions", () => {
    describe("Target Exceptions", () => {
        const id = "doesNotExist";
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        test("invalid element in style decorator", () => {
            const setupFn = () => {
                bootstrap<BadStyleComponent>(BadStyleComponent, html);
            };
            expect(setupFn).toThrowError(Error);
            expect(setupFn).toThrowError(
                `can not find HTML element with id: ${id}`,
            );
        });
        test("invalid element in cssclass decorator", () => {
            const setupFn = () => {
                bootstrap<BadCssComponent>(BadCssComponent, html);
            };
            expect(setupFn).toThrowError(Error);
            expect(setupFn).toThrowError(
                `can not find HTML element with id: ${id}`,
            );
        });
        test("invalid element in value decorator", () => {
            const setupFn = () => {
                bootstrap<BadValueComponent>(BadValueComponent, html);
            };
            expect(setupFn).toThrowError(Error);
            expect(setupFn).toThrowError(
                `can not find HTML element with id: ${id}`,
            );
        });
        test("Invalid element in attribute decorator", () => {
            const setupFn = () => {
                bootstrap<BadAttributeComponent>(BadAttributeComponent, html);
            };
            expect(setupFn).toThrowError(Error);
            expect(setupFn).toThrowError(
                `can not find HTML element with id: ${id}`,
            );
        });
    });
});
