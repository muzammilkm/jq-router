(function(chai, expect, sinon) {
  describe(__filename, function() {
    before(function() {
      require("../setup.config.js");
    });

    before(function() {
      var ajaxStub = sinon.stub($, "ajax");
      ajaxStub.returns(Promise.resolve());

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
        .setDefault("home")
        .run(".my-view", "home");
    });

    after(function() {
      $.ajax.restore();
    });

    afterEach(function() {
      JSDOM.reconfigure({ url: URL });
    });

    it("should navigate to #/ url for home route", function(done) {
      var routeName = "home";
      $.router.go(routeName);
      setTimeout(function() {
        var route = $.router.getCurrentRoute();
        var params = $.router.getCurrentParams();
        expect(routeName).to.be.eq(route.name);
        expect(params).to.be.empty;
        done();
      }, 10);
    });

    it("should navigate to #/users/1 url for users.detail route", function(done) {
      var routeName = "users.detail";
      $.router.go(routeName, { id: 1 });
      setTimeout(function() {
        var route = $.router.getCurrentRoute();
        var params = $.router.getCurrentParams();
        expect(routeName).to.be.eq(route.name);
        expect(params).not.to.be.empty;
        expect(params.id).to.be.eq("1");
        done();
      }, 20);
    });

  });
})(require("chai"), require("chai").expect, require("sinon"));
