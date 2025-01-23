import { expect } from "chai";
import { handleRequest, replaceVariables } from "../src/handler";

describe("handler returns response with request method", () => {
  const methods = ["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE", "PATCH"];
  methods.forEach((method) => {
    it(method, async () => {
      const result = await handleRequest(new Request("/", { method }));
      const text = await result.text();
      expect(text).to.include(method);
    });
  });
});

// describe("handler returns response with variable path", () => {
//   it("replaces variable in path", async () => {
//     const result = replaceVariables("/test/$3/$2", "/test/123/hello");
//     expect(result).to.be.equal("/test/hello/123");
//   });
// });