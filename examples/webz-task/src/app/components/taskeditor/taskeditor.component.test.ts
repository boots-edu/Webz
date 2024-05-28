import { describe, expect, test, beforeAll } from "@jest/globals";
import { TaskeditorComponent } from "./taskeditor.component";
import { bootstrap } from "@boots-edu/webz";

describe("TaskeditorComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<TaskeditorComponent>(TaskeditorComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TaskeditorComponent);
        });
    });
});
