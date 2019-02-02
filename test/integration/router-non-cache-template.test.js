(function(chai, expect, sinon) {
  describe(__filename, function() {
    before(function() {
      require("../setup.config.js");
    });

    before(function(done) {
      var ajaxStub = sinon.stub($, "ajax");
      ajaxStub.returns(Promise.resolve("<h1></h1>"));

      var routes = {};
      routes["home"] = {
        url: "#/",
        templateUrl: "templates/index.html"
      };
      routes["users"] = {
        abstract: true,
        url: "#/users",
        cache: true,
        templateUrl: "templates/users/index.html"
      };
      routes["users.list"] = {
        url: "",
        cache: true,
        templateUrl: "templates/users/list.html"
      };
      routes["users.add"] = {
        url: "/add",
        templateUrl: "templates/users/add.html"
      };
      routes["users.detail"] = {
        url: "/:id",
        cache: false,
        templateUrl: "templates/users/detail.html"
      };
      routes["users.edit"] = {
        url: "/:id/edit",
        templateUrl: "templates/users/edit.html"
      };
      $.router
        .setData(routes, false)
        .setDefault("home")
        .run(".my-view", "users.detail", { id: 1 });

      setTimeout(function() {
        done();
      }, 20);
    });

    after(function() {
      $.ajax.restore();
    });

    afterEach(function() {
      JSDOM.reconfigure({ url: URL });
    });

    it("should not cache user/detail.html template for users.detail route", function(done) {
      var routeName = "users.detail";
      $.router.go(routeName, { id: 2 });
      setTimeout(function() {
        var route = $.router.getCurrentRoute();
        var params = $.router.getCurrentParams();
        expect(route.name).to.be.eq("users.detail");
        expect(route.cache).to.be.eq(false);
        expect(params.id).to.be.eq("2");
        done();
      }, 10);
    });
  });
})(require("chai"), require("chai").expect, require("sinon"));
