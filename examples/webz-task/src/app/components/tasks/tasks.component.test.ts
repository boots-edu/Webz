import { describe, expect, test, beforeAll } from "@jest/globals";
import { TasksComponent } from "./tasks.component";
import { WebzDialog, bootstrap } from "@boots-edu/webz";
import { TasklineComponent } from "../taskline/taskline.component";
import { TaskData } from "../taskeditor/taskeditor.component";

describe("TasksComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<TasksComponent>(TasksComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TasksComponent);
        });
        test("Create Instance with Data", () => {
            const data = [{ taskText: "test" }];
            let component2 = new TasksComponent(data);
            expect(component2).toBeInstanceOf(TasksComponent);
        });
    });
    describe("accessors", () => {
        test("taskData", () => {
            expect(component).toBeInstanceOf(TasksComponent);
            expect(component.taskData).toEqual([]);
            const data = [{ taskText: "test" }];
            component.taskData = data;
            expect(component.taskData).toEqual(data);
        });
    });
    describe("Click Events", () => {
        test("Add Task", () => {
            expect(component).toBeInstanceOf(TasksComponent);
            component.taskLines.forEach((task: TasklineComponent) => {
                component.removeComponent(task);
            });
            component.taskLines = [];
            component.click("add-task");
            expect(component.taskLines.length).toBe(1);
            component["onAddTask"]();
            expect(component.taskLines.length).toBe(2);
        });
        test("Clear Tasks", () => {
            expect(component).toBeInstanceOf(TasksComponent);
            component.taskData = [{ taskText: "test" }];
            expect(component.taskLines.length).toBe(1);
            component.taskData = [{ taskText: "test" }, { taskText: "test2" }];
            expect(component.taskLines.length).toBe(2);
            component.click("clear-tasks");
            WebzDialog.clickPopupButton(0);
            //need to deal with dialog.
            expect(component.taskLines.length).toBe(0);
        });
    });
    describe("EventSubject tests", () => {
        test("lineDelete", async () => {
            expect(component).toBeInstanceOf(TasksComponent);
            component.taskData = [{ taskText: "test" }];
            expect(component.taskLines.length).toBe(1);
            const line = component.taskLines[0] as TasklineComponent;
            line.lineDelete.next(line.data);
            expect(component.taskLines.length).toBe(0);
        });
        test("lineEditClose", async () => {
            expect(component).toBeInstanceOf(TasksComponent);
            component.taskData = [{ taskText: "test" }];
            expect(component.taskLines.length).toBe(1);
            const line = component.taskLines[0] as TasklineComponent;
            line.lineEditClose.next(true);
            expect(line.data.uniqueID).toBeDefined();
            component.saveData.subscribe(
                (data: TaskData[]) => {
                    expect(data.length).toBe(1);
                    expect(data[0].uniqueID).toBeDefined();
                },
                () => {
                    expect(true).toBe(false);
                },
            );
            component.taskLines[0].data.uniqueID = undefined;
            line.lineEditClose.next(false);
            expect(component.taskLines.length).toBe(0);
        });
    });
});
