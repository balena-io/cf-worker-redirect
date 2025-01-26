import { expect } from "chai";
import { handleRequest } from "../src/handler";

const routeTest = {
  "https://source.com/": "https://destination.com/",
  "http://source.com": "https://destination.com/",
  "https://sourcetopathtrailing.com/": "https://destination.com/path/",
  "https://source.com/path": "https://destination.com/path",
  "https://source.com/pathtrailing/": "https://destination.com/pathtrailing/",
  "https://notrailing.com": "https://destination.com/",
  "https://replace.com/replace/hello/world":
    "https://destination.com/replace/world/hello",
  "https://source.com/index?0[0][n]=any&0[0][o]=full_text_search&0[0][v]=rosetta":
    "https://destination.com/index?0[0][n]=any&0[0][o]=full_text_search&0[0][v]=rosetta",
  "https://searchparameters.com/":
    "https://destination.com/index?0[0][n]=any&0[0][o]=full_text_search&0[0][v]=rosetta",
};

const test404 = [
  "https://noredirect.com",
  "https://replace.com/replace/notenough",
];

describe("handler returns target when asked for source", () => {
  for (let source in routeTest) {
    if (Object.prototype.hasOwnProperty.call(routeTest, source)) {
      const destination = routeTest[source];
      if (!source.startsWith("http")) {
        source = `https://${source}`;
      }
      it(`route from ${source} to ${destination}`, async () => {
        const request = new Request(`${source}`, { method: "GET" });
        const result = await handleRequest(request);
        expect(result.status).to.equal(301);
        expect(decodeURIComponent(result.headers.get("location"))).to.equal(
          decodeURIComponent(destination),
        );
      });
    }
  }
});

describe("handler returns 404 for malformed or unknown source", () => {
  test404.forEach((source) => {
    it(`404 from ${source}`, async () => {
      const request = new Request(`${source}`, { method: "GET" });
      const result = await handleRequest(request);
      expect(result.status).to.equal(404);
    });
  });
});
