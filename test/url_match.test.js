(function(chai, expect) {
  describe("Generate proper href url in jqRouter", function() {
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
      $.router.setData(routes);
    });

    it("should match #/ url to home route", function() {
      var route = $.router.match("#/");
      expect(route.name).to.be.eq("home");
    });

    it("should not match #/users url to users route", function() {
      var route = $.router.match("#/users");
      expect(route.name).not.be.eq("users");
    });

    it("should match #/users url to users.list route", function() {
      var route = $.router.match("#/users");
      expect(route.name).to.be.eq("users.list");
    });

    it("should match #/users/add url to users.add route", function() {
      var route = $.router.match("#/users/add");
      expect(route.name).to.be.eq("users.add");
    });

    it("should match #/users/1 url to users.detail route", function() {
      var route = $.router.match("#/users/1");
      expect(route.name).to.be.eq("users.detail");
    });

    it("should match #/users/1/edit url to users.edit route", function() {
      var route = $.router.match("#/users/1/edit");
      expect(route.name).to.be.eq("users.edit");
    });

    after(function() {
      $.router.setData(null);
    });
  });
})(require("chai"), require("chai").expect);
