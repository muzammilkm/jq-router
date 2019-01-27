
(function(jsdom, jQuery) {
  global.URL = "http://jq-router.com/";
  global.JSDOM = new jsdom.JSDOM(
    "<!DOCTYPE html><html><head></head><body></body></html>",
    {
      url: URL
    }
  );

  global.window = JSDOM.window;
  global.document = JSDOM.window.document;
  global.$ = global.jQuery = jQuery(JSDOM.window);
  require("../src/jq-router.js");
  require("../src/services/jq-router-events.js");
  require("../src/services/jq-router-param-service.js");
  require("../src/services/jq-router-renderer.js");
})(require("jsdom"), require("jquery"));
