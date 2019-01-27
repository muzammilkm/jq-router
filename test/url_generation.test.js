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

    it("should generate #/ url for home route", function() {
      var url = $.router.href("home");
      expect(url).to.be.eq("#/");
    });

    it("should generate #/users url for users route", function() {
      var url = $.router.href("users");
      expect(url).to.be.eq("#/users");
    });

    it("should generate #/users url for users.list route", function() {
      var url = $.router.href("users.list");
      expect(url).to.be.eq("#/users");
    });

    it("should generate #/users/add url for users.add route", function() {
      var url = $.router.href("users.add");
      expect(url).to.be.eq("#/users/add");
    });

    it("should generate #/users/1 url for users.detail route", function() {
      var url = $.router.href("users.detail", { id: 1 });
      expect(url).to.be.eq("#/users/1");
    });

    it("should generate #/users/1/edit url for users.edit route", function() {
      var url = $.router.href("users.edit", { id: 1 });
      expect(url).to.be.eq("#/users/1/edit");
    });

    after(function() {
      $.router.setData(null);
    });
  });
})(require("chai"), require("chai").expect);
