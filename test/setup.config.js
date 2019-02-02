(function(jsdom) {
  require("flush-cache")();

  global.URL = "http://jq-router.com/";
  global.JSDOM = new jsdom.JSDOM(
    "<!DOCTYPE html><html><head></head><body><div class='my-view'></div></body></html>",
    {
      url: URL
    }
  );

  global.document = JSDOM.window.document;
  global.window = global.document.defaultView;
  global.$ = global.jQuery = require("jquery");

  require("../src/jq-router.js");
  require("../src/services/jq-router-events.js");
  require("../src/services/jq-router-param-service.js");
  require("../src/services/jq-router-renderer.js");
})(require("jsdom"));
