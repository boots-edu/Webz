import { describe, expect, test, beforeAll } from "@jest/globals";
import { HudComponent } from "./hud.component";
import { bootstrap } from "@boots-edu/webz";

describe("HudComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<HudComponent>(HudComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(HudComponent);
        });
    });
});
