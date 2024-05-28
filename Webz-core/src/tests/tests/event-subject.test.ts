import { describe, expect, test, beforeAll } from "@jest/globals";
import { EventSubject } from "../../eventsubject";

describe("Webz-EventSubject", () => {
    beforeAll(() => {});
    describe("Constructor", () => {
        test("Create Instance", async () => {
            expect(true).toBeTruthy();
            let evt: EventSubject<boolean> = new EventSubject<boolean>();
            expect(evt).toBeInstanceOf(EventSubject);
            let id = evt.subscribe(
                (data: boolean) => {
                    expect(data).toBeTruthy();
                },
                (e: Error) => {
                    expect(e).toBeInstanceOf(Error);
                    expect(e.message).toBe("test");
                },
            );
            evt.next(true);
            evt.error(new Error("test"));
            evt.unsubscribe(id);
            id = evt.subscribe((data: boolean) => {
                expect(data).not.toBeTruthy();
            });
            evt.next(false);
            evt.unsubscribe(id);
        });
    });
});
