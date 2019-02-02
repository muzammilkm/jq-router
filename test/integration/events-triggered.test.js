(function(chai, expect, sinon) {
  describe(__filename, function() {
    var routeMatchedSpy,
      routeNotMatchedSpy,
      routeBeforeChangeSpy,
      viewDestroyedSpy,
      viewChangeSpy,
      routeChangedSpy;

    before(function() {
      require("../setup.config.js");
    });

    before(function(done) {
      var ajaxStub = sinon.stub($, "ajax");
      ajaxStub.returns(Promise.resolve());

      routeMatchedSpy = sinon.spy();
      routeNotMatchedSpy = sinon.spy();
      routeBeforeChangeSpy = sinon.spy();
      viewDestroyedSpy = sinon.spy();
      viewChangeSpy = sinon.spy();
      routeChangedSpy = sinon.spy();

      var routes = {};
      routes["home"] = {
        url: "#/",
        templateUrl: "templates/index.html"
      };
      routes["resolve"] = {
        url: "#/resolving",
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
        .setDefault("home")
        .run(".my-view", "home");

      $.router.onRouteMatched(routeMatchedSpy);
      $.router.onRouteNotMatched(routeNotMatchedSpy);
      $.router.onRouteBeforeChange(routeBeforeChangeSpy);
      $.router.onViewDestroyed(viewDestroyedSpy);
      $.router.onViewChange(viewChangeSpy);
      $.router.onRouteChanged(routeChangedSpy);

      setTimeout(function() {
        done();
      }, 20);
    });

    after(function() {
      $.ajax.restore();
    });

    afterEach(function() {
      routeMatchedSpy.resetHistory();
      routeNotMatchedSpy.resetHistory();
      routeBeforeChangeSpy.resetHistory();
      viewDestroyedSpy.resetHistory();
      viewChangeSpy.resetHistory();
      routeChangedSpy.resetHistory();
      JSDOM.reconfigure({ url: URL });
    });

    it("should trigger events in order onRouteMatched -> onRouteBeforeChange -> onViewDestroyed -> onViewChange -> onRouteChanged", function(done) {
      var routeName = "home";
      $.router.go(routeName);
      setTimeout(function() {
        sinon.assert.calledOnce(routeMatchedSpy);
        sinon.assert.notCalled(routeNotMatchedSpy);
        sinon.assert.calledOnce(routeBeforeChangeSpy);
        // sinon.assert.calledOnce(viewDestroyedSpy);
        sinon.assert.calledOnce(viewChangeSpy);
        sinon.assert.calledOnce(routeChangedSpy);

        sinon.assert.callOrder(
          routeMatchedSpy,
          routeBeforeChangeSpy,
          viewChangeSpy,
          routeChangedSpy
        );
        done();
      }, 10);
    });

    it("should trigger onRouteNotMatched event and redirect to default route", function(done) {
      window.location.assign("/#/unknown");
      setTimeout(function() {
        sinon.assert.calledOnce(routeNotMatchedSpy);

        sinon.assert.calledOnce(routeMatchedSpy);
        sinon.assert.calledOnce(routeBeforeChangeSpy);
        // sinon.assert.calledOnce(viewDestroyedSpy);
        sinon.assert.calledOnce(viewChangeSpy);
        sinon.assert.calledOnce(routeChangedSpy);
        done();
      }, 10);
    });

    it("should trigger onRouteNotMatched event", function(done) {
      $.router.setDefault(undefined);
      window.location.assign("/#/unknown");
      setTimeout(function() {
        sinon.assert.calledOnce(routeNotMatchedSpy);

        sinon.assert.notCalled(routeMatchedSpy);
        sinon.assert.notCalled(routeBeforeChangeSpy);
        sinon.assert.notCalled(viewDestroyedSpy);
        sinon.assert.notCalled(viewChangeSpy);
        sinon.assert.notCalled(routeChangedSpy);
        done();
      }, 10);
    });
  });
})(require("chai"), require("chai").expect, require("sinon"));
