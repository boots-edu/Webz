import { describe, expect, test, beforeAll } from "@jest/globals";
import { PaddleComponent } from "./paddle.component";
import { bootstrap } from "@boots-edu/webz";

describe("PaddleComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<PaddleComponent>(PaddleComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(PaddleComponent);
        });
    });
});
