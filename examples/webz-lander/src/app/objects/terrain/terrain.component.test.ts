import { describe, expect, test, beforeAll } from "@jest/globals";
import { TerrainComponent } from "./terrain.component";
import { bootstrap } from "@boots-edu/webz";

describe("TerrainComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<TerrainComponent>(TerrainComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TerrainComponent);
        });
    });
});
