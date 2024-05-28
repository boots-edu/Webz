import { describe, expect, test, beforeAll } from "@jest/globals";
import { TaskviewerComponent } from "./taskviewer.component";
import { WebzDialog, bootstrap } from "@boots-edu/webz";

describe("TaskviewerComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<TaskviewerComponent>(TaskviewerComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TaskviewerComponent);
        });
    });
    describe("Click Events", () => {
        test("Edit click", () => {
            component.editing.subscribe(
                () => {
                    expect(true).toBe(true);
                },
                (error: Error) => {
                    expect(error).toBeUndefined();
                },
            );
            component.click("edit");
        });
    });
    describe("Delete Click", () => {
        test("Delete click", () => {
            component.deleting.subscribe(
                () => {
                    expect(true).toBe(true);
                },
                (error: Error) => {
                    expect(error).toBeUndefined();
                },
            );
            component.click("delete");
            WebzDialog.clickPopupButton(0);
        });
    });
    describe("methods", () => {
        test("setData", () => {
            const data = { taskText: "Testing" };
            component.setData(data);
            expect(component.taskview).toBe("Testing");
            expect(component.data).toBe(data);
        });
        test("disableButtons", () => {
            component.disableButtons();
            expect(component.editDisabled).toBe("disabled");
            expect(component.deleteDisabled).toBe("disabled");
        });
    });
});
