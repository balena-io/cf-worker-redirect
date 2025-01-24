import { expect } from "chai";
import { handleRequest } from "../src/handler";

const routeTest = {
  "https://source.com/": "https://destination.com/",
  "http://source.com": "https://destination.com/",
  "https://sourcetopathtrailing.com/": "https://destination.com/path/",
  "https://source.com/path": "https://destination.com/path",
  "https://source.com/pathtrailing/": "https://destination.com/pathtrailing/",
}

const test404 = [
  "https://missingtrailing.com",
  "https://noredirect.com",
]

describe("handler returns target when asked for source", () => {
  for(let source in routeTest) {
    if (Object.prototype.hasOwnProperty.call(routeTest, source)) {
      const destination = routeTest[source];
      it(`route from ${source} to ${destination}`, async () => {
        const request = new Request(`${source}`, { method: "GET" });
        const result = await handleRequest(request);
        expect (result.status).to.equal(301);
        expect (result.headers.get("location")).to.equal(destination);
      });
    }
  }
});

describe("handler returns 404 for malformed or unknown source", () => {
  test404.forEach(source => {
    it(`404 from ${source}`, async () => {
      const request = new Request(`${source}`, { method: "GET" });
      const result = await handleRequest(request);
      expect (result.status).to.equal(404);
    });
  })
});