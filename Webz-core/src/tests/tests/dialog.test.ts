import { describe, expect, test, beforeAll } from "@jest/globals";
import { TestComponent } from "../testing_components/test.component";
import { bootstrap } from "../../bootstrap";
import { TestDialog } from "../testing_components/dialog/test.dialog";
import { WebzDialog, popupDialog } from "../../WebzDialog";

describe("Webz-Construction and DOM", () => {
    let toplevel: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        toplevel = bootstrap<TestComponent>(TestComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            let testDlg = new TestDialog();
            toplevel.addComponent(testDlg);
            let root = testDlg["shadow"].getElementById("background-root");
            expect(toplevel).toBeInstanceOf(TestComponent);
            expect(root).not.toBeNull();
            expect(root?.style.display).toBe("none");
            testDlg.show();
            expect(root?.style.display).toBe("inline-block");
            testDlg.show(false);
            expect(root?.style.display).toBe("none");
        });
    });
    describe("Popup", () => {
        test("Create Instance", () => {
            TestDialog.popup(toplevel, "This is a test").subscribe((result) => {
                expect(result).toBe("Ok");
            });
            if (popupDialog) {
                WebzDialog.clickPopupButton(9);
                WebzDialog.clickPopupButton(0);
            } else {
                //should not happen
                expect(true).toBe(false);
            }
        });
    });
});
