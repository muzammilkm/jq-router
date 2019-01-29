(function(chai, expect, sinon) {
    describe(__filename, function() {
      before(function() {
        require("../setup.config.js");
      });
  
      before(function() {  
        var routes = {};
        routes["home"] = {
          url: "#/",
          templateUrl: "templates/index.html"
        };
        routes["users"] = {
          abstract: true,
          url: "#/users"
        };
        routes["users.list"] = {
          url: ""
        };
        routes["users.add"] = {
          url: "/add"
        };
        routes["users.detail"] = {
          url: "/:id"
        };
        routes["users.edit"] = {
          url: "/:id/edit"
        };
        $.router
          .setData(routes)
          .setDefault("home");
      });

      it("should register onRouteMatched event", function() {
        var event = sinon.stub($.router, "onRouteMatched");
        $.router.onRouteMatched(function(e, route, params) {});
        sinon.assert.calledOnce(event);
      });
    
      it("should register onRouteNotMatched event", function() {
        var event = sinon.stub($.router, "onRouteNotMatched");
        $.router.onRouteNotMatched(function(e, route, params) {});
        sinon.assert.calledOnce(event);
      });

      it("should register onRouteBeforeChange event", function() {
        var event = sinon.stub($.router, "onRouteBeforeChange");
        $.router.onRouteBeforeChange(function(e, route, params) {});
        sinon.assert.calledOnce(event);
      });

      it("should register onViewDestroyed event", function() {
        var event = sinon.stub($.router, "onViewDestroyed");
        $.router.onViewDestroyed(function(e, viewRoute) {});
        sinon.assert.calledOnce(event);
      });

      it("should register onViewChange event", function() {
        var event = sinon.stub($.router, "onViewChange");
        $.router.onViewChange(function(e, viewRoute, route, params) {});
        sinon.assert.calledOnce(event);
      });

      it("should register onRouteChanged event", function() {
        var event = sinon.stub($.router, "onRouteChanged");
        $.router.onRouteChanged(function(e, route, params) {});
        sinon.assert.calledOnce(event);
      });
  
    });
  })(require("chai"), require("chai").expect, require("sinon"));
  