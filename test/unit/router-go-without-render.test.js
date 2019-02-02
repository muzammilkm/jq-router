(function(chai, expect, sinon) {
  describe(__filename, function() {
    before(function() {
      require("../setup.config.js");
    });

    before(function() {
      var routes = {};
      routes["home"] = {
        url: "#/"
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
      $.router.setData(routes).setDefault("home");
    });

    afterEach(function() {
      JSDOM.reconfigure({ url: URL });
    });

    it("should navigate to #/ url for home route", function() {
      $.router.go("home");
      expect(window.location.hash).to.be.eq("#/");
    });

    it("should navigate #/users url for users route", function() {
      $.router.go("users");
      expect(window.location.hash).to.be.eq("#/users");
    });

    it("should navigate #/users url for users.list route", function() {
      $.router.go("users.list");
      expect(window.location.hash).to.be.eq("#/users");
    });

    it("should navigate #/users/1 url for users.detail route", function() {
      $.router.go("users.detail", { id: 1 });
      expect(window.location.hash).to.be.eq("#/users/1");
    });

    after(function() {
      $.router.setData(null);
    });
  });
})(require("chai"), require("chai").expect, require("sinon"));
