import { describe, expect, test, beforeAll } from "@jest/globals";
import { BallComponent } from "./ball.component";
import { bootstrap } from "@boots-edu/webz";

describe("BallComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<BallComponent>(BallComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(BallComponent);
        });
    });
});
