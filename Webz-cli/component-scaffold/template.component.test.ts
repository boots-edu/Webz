import { describe, expect, test, beforeAll } from "@jest/globals";
import { $$$$$$$$Component } from "./########.component";
import { bootstrap } from "@boots/webz";

describe("$$$$$$$$Component", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<$$$$$$$$Component>($$$$$$$$Component, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf($$$$$$$$Component);
        });
    });
});
