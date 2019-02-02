(function(chai, expect, sinon) {
  describe(__filename, function() {
    before(function() {
      require("../setup.config.js");
    });

    before(function() {
      var ajaxStub = sinon.stub($, "ajax");
      ajaxStub.returns(Promise.resolve());
    });

    after(function() {
      $.ajax.restore();
    });

    afterEach(function() {
      JSDOM.reconfigure({ url: URL });
    });

    it("should render users.detail router when redirection from different site", function(done) {
      var routes = {};
      routes["home"] = {
        url: "#/",
        templateUrl: "templates/index.html"
      };
      routes["users"] = {
        abstract: true,
        url: "#/users"
      };
      routes["users.detail"] = {
        url: "/:id"
      };
      JSDOM.reconfigure({ url: URL + "#/users/101" });

      $.router
        .setData(routes)
        .setDefault("home")
        .run(".my-view", "home");

      setTimeout(function() {
        expect($.router.getCurrentRoute().name).to.be.eq("users.detail");
        expect($.router.getCurrentParams().id).to.be.eq("101");
        done();
      }, 20);
    });
    
  });
})(require("chai"), require("chai").expect, require("sinon"));
