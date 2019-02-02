(function(chai, expect, sinon) {
  describe(__filename, function() {
    before(function() {
      require("../setup.config.js");
    });

    before(function(done) {
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

    it("should change route params", function(done) {
      expect($.router.getCurrentRoute().name).to.be.eq("users.detail");
      expect($.router.getCurrentParams().id).to.be.eq("1");

      $.router.go("users.detail", { id: 2 });
      setTimeout(function() {
        expect($.router.getCurrentRoute().name).to.be.eq("users.detail");
        expect($.router.getCurrentParams().id).to.be.eq("2");

        done();
      }, 10);
    });
  });
})(require("chai"), require("chai").expect, require("sinon"));
