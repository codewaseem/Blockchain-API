import * as request from "supertest";
import app from "../src/app";
import { } from "jest";

describe("GET /", () => {
  it("should return 200 OK", () => {
    return request(app).get("/")
      .expect(200);
  });
});

describe("POST /block", () => {
  it("should return newly added block", () => {
    return request(app).post("/block")
      .send({ data: "Test string" })
      .expect(200)
      .then(res => {
        if (res.body.data.hash) {
          console.log("PASSED");
        } else {
          throw new Error("FAILED TO ADD NEW BLOCK");
        }
      });
  })
});