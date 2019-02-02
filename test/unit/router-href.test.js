(function(chai, expect) {
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

    after(function() {
      $.router.setData(null);
    });

    describe("when no default route", function() {
      beforeEach(function() {
        $.router.setDefault(undefined);
      });

      it("should be undefined as default route without route name", function() {
        var url = $.router.href();
        expect(url).to.be.undefined;
      });

      it("should be undefine for unknown route", function() {
        var url = $.router.href("unknown");
        expect(url).to.be.undefined;
      });
    });

    describe("when default route", function() {
      beforeEach(function() {
        $.router.setDefault("home");
      });

      it("should generate #/ url as default route without route name", function() {
        var url = $.router.href();
        expect(url).to.be.eq("#/");
      });

      it("should be undefined for unknown route with default route", function() {
        var url = $.router.href("unknown");
        expect(url).to.be.undefined;
      });
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
  });
})(require("chai"), require("chai").expect);
