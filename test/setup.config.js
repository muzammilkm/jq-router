(function(jsdom, jQuery) {
  var window = new jsdom.JSDOM(
    "<!DOCTYPE html><html><head></head><body></body></html>"
  ).window;
  console.log("register");
  global.window = window;
  global.document = window.document;
  global.$ = global.jQuery = jQuery(window);
  require("../src/jq-router.js");
  require("../src/services/jq-router-events.js");
  require("../src/services/jq-router-param-service.js");
  require("../src/services/jq-router-renderer.js");
})(require("jsdom"), require("jquery"));
