import { describe, expect, test, beforeAll } from "@jest/globals";
import { $$$$$$$$Dialog } from "./########.dialog";
import { bootstrap } from "@gsilber/webez";

describe("$$$$$$$$Dialog", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<$$$$$$$$Dialog>($$$$$$$$Dialog, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf($$$$$$$$Dialog);
        });
    });
});
