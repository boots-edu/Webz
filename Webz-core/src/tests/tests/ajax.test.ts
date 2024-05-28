import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { WebzComponent, HttpMethod } from "../../WebzComponent";
import mock from "xhr-mock";

describe("Ajax Testing", () => {
    beforeEach(() => {
        mock.setup();
    });

    // put the real XHR object back and clear the mocks after each test
    afterEach(() => {
        mock.teardown();
    });
    describe("Test bad target", () => {
        test("Create Instance", async () => {
            mock.get("/api/good", (req, res) => {
                return res.status(200).body('{"data":{"id":"abc-123"}}');
            });
            try {
                await WebzComponent.ajax<any>("/api/bad", HttpMethod.GET, [
                    { "content-type": "application/json" },
                ]).toPromise();
                //make sure this doesn't happen
                expect(true).toBe(false);
            } catch (e) {
                expect(e).toBeInstanceOf(Error);
            }
        });
    });
    describe("Test bad target no headers", () => {
        test("Create Instance", async () => {
            mock.get("/api/good", (req, res) => {
                return res.status(200).body('{"data":{"id":"abc-123"}}');
            });
            try {
                await WebzComponent.ajax<any>(
                    "/api/bad",
                    HttpMethod.GET,
                ).toPromise();
                //make sure this doesn't happen
                expect(true).toBe(false);
            } catch (e) {
                expect(e).toBeInstanceOf(Error);
            }
        });
    });
    describe("Test good target no error", () => {
        test("Create Instance", async () => {
            mock.get("/api/good", (req, res) => {
                return res.status(200).body('{"data":{"id":"abc-123"}}');
            });
            try {
                let result: { data: any } = await WebzComponent.ajax<{
                    data: any;
                }>("/api/good", HttpMethod.GET).toPromise();
                expect(result.data.id).toEqual("abc-123");
            } catch (e) {
                console.log(e);
                //make sure this doesn't happen
                expect(true).toBeFalsy();
            }
        });
        describe("Test good target bad request", () => {
            test("Create Instance", async () => {
                mock.get("/api/good", (req, res) => {
                    return res.status(400).body('{"data":{"id":"abc-123"}}');
                });
                try {
                    await WebzComponent.ajax<{
                        data: any;
                    }>("/api/good", HttpMethod.GET).toPromise();
                    //make sure this doesn't happen
                    expect(true).toBeFalsy();
                } catch (e) {
                    expect(e).toBeInstanceOf(Error);
                }
            });
        });
    });
});
