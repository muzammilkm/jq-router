(function(chai, expect, sinon) {
  describe(__filename, function() {
    var resolve1Spy, resolveSpy;

    before(function() {
      require("../setup.config.js");
    });

    before(function(done) {
      var ajaxStub = sinon.stub($, "ajax");
      ajaxStub.returns(Promise.resolve());

      // routeMatchedSpy = sinon.spy();
      // routeNotMatchedSpy = sinon.spy();
      // routeBeforeChangeSpy = sinon.spy();
      // viewDestroyedSpy = sinon.spy();
      // viewChangeSpy = sinon.spy();
      // routeChangedSpy = sinon.spy();
      resolveSpy = sinon.spy();
      resolve1Spy = sinon.spy();
      resolve2Spy = sinon.spy();

      var routes = {};
      routes["home"] = {
        url: "#/",
        templateUrl: "templates/index.html"
      };
      routes["resolveFunc"] = {
        url: "#/resolving-func",
        resolve: function() {
          resolveSpy();
        },
        templateUrl: "templates/index.html"
      };
      routes["resolveArrayOfFunc"] = {
        url: "#/resolving-array-funcs",
        resolve: [
          function() {
            return resolveSpy();
          },
          function() {
            return resolve1Spy();
          }
        ],
        templateUrl: "templates/index.html"
      };
      routes["resolveArrayOfFuncAndValues"] = {
        url: "#/resolving-array-funcs-values",
        resolve: [
          function() {
            return resolveSpy();
          },
          function() {
            return resolve1Spy();
          },
          "Some values"
        ],
        templateUrl: "templates/index.html"
      };
      $.router
        .setData(routes)
        .setDefault("home")
        .run(".my-view", "home");

      // $.router.onRouteMatched(routeMatchedSpy);
      // $.router.onRouteNotMatched(routeNotMatchedSpy);
      // $.router.onRouteBeforeChange(routeBeforeChangeSpy);
      // $.router.onViewDestroyed(viewDestroyedSpy);
      // $.router.onViewChange(viewChangeSpy);
      // $.router.onRouteChanged(routeChangedSpy);
      setTimeout(function() {
        done();
      }, 20);
    });

    after(function() {
      $.ajax.restore();
    });

    afterEach(function() {
      // routeMatchedSpy.resetHistory();
      // routeNotMatchedSpy.resetHistory();
      // routeBeforeChangeSpy.resetHistory();
      // viewDestroyedSpy.resetHistory();
      // viewChangeSpy.resetHistory();
      // routeChangedSpy.resetHistory();
      resolveSpy.resetHistory();
      resolve1Spy.resetHistory();
      resolve2Spy.resetHistory();
      JSDOM.reconfigure({ url: URL });
    });

    it("should be function resolved", function(done) {
      var routeName = "resolveFunc";
      $.router.go(routeName);
      setTimeout(function() {
        sinon.assert.calledOnce(resolveSpy);
        done();
      }, 10);
    });

    it("should be resolved function with in array", function(done) {
      var routeName = "resolveArrayOfFunc";
      $.router.go(routeName);
      setTimeout(function() {
        sinon.assert.calledOnce(resolveSpy);
        sinon.assert.calledOnce(resolve1Spy);
        done();
      }, 10);
    });

    it("should be resolved function and non function with in array", function(done) {
      var routeName = "resolveArrayOfFuncAndValues";
      $.router.go(routeName);
      setTimeout(function() {
        sinon.assert.calledOnce(resolveSpy);
        sinon.assert.calledOnce(resolve1Spy);

        done();
      }, 10);
    });
  });
})(require("chai"), require("chai").expect, require("sinon"));
