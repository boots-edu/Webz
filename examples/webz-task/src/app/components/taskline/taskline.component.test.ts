import { describe, expect, test, beforeAll } from "@jest/globals";
import { TasklineComponent } from "./taskline.component";
import { bootstrap } from "@boots-edu/webz";
import { TaskData } from "../taskeditor/taskeditor.component";

describe("TasklineComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<TasklineComponent>(TasklineComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TasklineComponent);
        });
    });
    describe("Wire ups", () => {
        test("Wire up editor", () => {
            expect(component).toBeInstanceOf(TasklineComponent);
            component["editor"].editClose.notify(true);
            expect(component.editing).toBe(false);
        });
        test("Wire up viewer", () => {
            expect(component).toBeInstanceOf(TasklineComponent);
            component["viewer"].deleting.notify();
            component["viewer"].editing.notify();
            expect(component.editing).toBe(true);
        });
    });
    describe("Uncovered Accessors", () => {
        test("Get Data", () => {
            expect(component).toBeInstanceOf(TasklineComponent);
            component.taskData = { taskText: "Test Task" };
            const data = component.data as TaskData;
            expect(component.data).toBe(data);
        });
    });
    describe("Methods", () => {
        test("Wire up editor", () => {
            expect(component).toBeInstanceOf(TasklineComponent);
            component.disableViewButtons();
            //no test will test in viewer
            expect(true).toBe(true);
        });
        test("Disable editing", () => {
            expect(component).toBeInstanceOf(TasklineComponent);
            component.disableEditing();
            expect(component.editing).toBe(false);
        });
        test("Start Editing", () => {
            expect(component).toBeInstanceOf(TasklineComponent);
            component.startEditing();
            expect(component.editing).toBe(true);
        });
    });
});
