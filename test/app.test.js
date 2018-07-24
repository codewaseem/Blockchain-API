import * as request from "supertest";
import app from "../src/app";
import { } from "jest";

describe("GET /block", () => {
  it("should return 200 OK", () => {
    const blockHeight = 0; //Change this 0 to other number to see if it gets the right result.
    return request(app).get("/block/" + blockHeight)
      .expect(200)
      .then(res => {
        if (res.body.data.height == blockHeight) {
          // API returned the right block
          console.log(res.body.data);
        } else {
          throw new Error("FAILED. Didn't returned the expected block");
        }
      });
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
  });
});