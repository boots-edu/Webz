import { describe, expect, test, beforeAll } from "@jest/globals";
import { Notifier } from "../../notifier";

describe("Webz-Notifier", () => {
    beforeAll(() => {});
    describe("Constructor", () => {
        test("Create Instance", async () => {
            expect(true).toBeTruthy();
            let evt: Notifier<boolean> = new Notifier<boolean>();
            expect(evt).toBeInstanceOf(Notifier);
            let id = evt.subscribe(
                (data: boolean) => {
                    expect(data).toBeTruthy();
                },
                (e: Error) => {
                    expect(e).toBeInstanceOf(Error);
                    expect(e.message).toBe("test");
                },
            );
            evt.notify(true);
            evt.error(new Error("test"));
            evt.unsubscribe(id);
            id = evt.subscribe((data: boolean) => {
                expect(data).not.toBeTruthy();
            });
            evt.notify(false);
            evt.unsubscribe(id);
        });
    });
});
