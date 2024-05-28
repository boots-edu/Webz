import { describe, expect, test, beforeAll } from "@jest/globals";
import { TestComponent } from "../testing_components/test.component";
import { bootstrap } from "../../bootstrap";
import { TestChild1Component } from "../testing_components/test-child1.component";

declare const window: Window;

describe("Webz-Construction and DOM", () => {
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
    describe("DOM", () => {
        test("DOM Parent Attachment", () => {
            let target = window.document.getElementById("main-target");
            expect(target).toBeTruthy();
            expect(target).toBeInstanceOf(HTMLElement);
            expect(target?.children.length).toBe(1);
            let parent = toplevel["htmlElement"] as HTMLElement;
            expect(parent).toBeInstanceOf(HTMLElement);
            expect(target?.children[0]).toBe(parent);
        });
        test("DOM Child Attachment", () => {
            let parent = toplevel["htmlElement"] as HTMLElement;
            expect(parent).toBeTruthy();
            expect(parent).toBeInstanceOf(HTMLElement);
            let childCheck = toplevel.child1["htmlElement"] as HTMLElement;
            let child1 = toplevel["shadow"].getElementById("child1")
                ?.children[0] as HTMLElement;
            expect(child1).toBeInstanceOf(HTMLElement);
            expect(childCheck).toBeInstanceOf(HTMLElement);
            expect(child1).toBe(childCheck);
            childCheck = toplevel.child2["htmlElement"] as HTMLElement;
            let child2 = toplevel["shadow"].getElementById("child2")
                .children[0] as HTMLElement;
            expect(child2).toBeInstanceOf(HTMLElement);
            expect(childCheck).toBeInstanceOf(HTMLElement);
            expect(child2).toBe(childCheck);
            childCheck = toplevel.child3["htmlElement"] as HTMLElement;
            let child3 = toplevel["shadow"].getElementById("child3")
                .children[0] as HTMLElement;
            expect(child3).toBeInstanceOf(HTMLElement);
            expect(childCheck).toBeInstanceOf(HTMLElement);
            expect(child3).toBe(childCheck);
            childCheck = toplevel.child4["htmlElement"] as HTMLElement;
            let child4 = toplevel["shadow"].getElementById("child4")
                .children[0] as HTMLElement;
            expect(child4).toBeInstanceOf(HTMLElement);
            expect(childCheck).toBeInstanceOf(HTMLElement);
            expect(child4).toBe(childCheck);
            // Ensure that the children are not the same reference when they are the same type
            expect(child1).not.toBe(child3);
            expect(child2).not.toBe(child4);
        });
        test("DOM Grandchild Attachment", () => {
            let parent = toplevel["htmlElement"] as HTMLElement;
            expect(parent).toBeTruthy();
            expect(parent).toBeInstanceOf(HTMLElement);
            let childElt = toplevel.child1["htmlElement"] as HTMLElement;
            expect(childElt).toBeInstanceOf(HTMLElement);
            let childObj = toplevel.child1 as TestChild1Component;
            expect(childObj).toBeInstanceOf(TestChild1Component);
            let grandchild1 = childObj.baby1["htmlElement"] as HTMLElement;
            let grandchild2 = childObj.baby2["htmlElement"] as HTMLElement;
            expect(grandchild1).toBeInstanceOf(HTMLElement);
            expect(grandchild2).toBeInstanceOf(HTMLElement);
            let gccheck1 = childObj["shadow"].getElementById("baby1")
                ?.children[0] as HTMLElement;
            expect(gccheck1).toBeInstanceOf(HTMLElement);
            let gccheck2 = childObj["shadow"].getElementById("baby2")
                ?.children[0] as HTMLElement;
            expect(gccheck1).toBeInstanceOf(HTMLElement);
            expect(gccheck2).toBeInstanceOf(HTMLElement);
            expect(grandchild1).toStrictEqual(gccheck1);
            expect(grandchild2).toStrictEqual(gccheck2);
            expect(grandchild1).not.toBe(grandchild2);
        });
    });
});
