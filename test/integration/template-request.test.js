(function(chai, expect, sinon) {
  describe(__filename, function() {
    var requests = [];
    before(function() {
      require("../setup.config.js");
    });

    before(function(done) {
      var ajaxStub = sinon.stub($, "ajax").callsFake(function(xhr) {
        requests.push(xhr);
        return Promise.resolve("<h1></h1>");
      });

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
        templateUrl: "users.php?userId=:id"
      };
      routes["users.edit"] = {
        url: "/:id/edit",
        templateUrl: "templates/users/edit.html"
      };
      $.router
        .setData(routes, false)
        .setDefault("home")
        .run(".my-view", "home");

      setTimeout(function() {
        done();
      }, 20);
    });

    after(function() {
      $.ajax.restore();
    });

    afterEach(function() {
      requests = [];
      JSDOM.reconfigure({ url: URL });
    });

    it("should load home route template", function() {
      expect(requests[0].url).to.be.eq("templates/index.html");
    });

    it("should load users.add route template", function(done) {
      var routeName = "users.add";
      $.router.go(routeName);
      setTimeout(function() {
        expect(requests[0].url).to.be.eq("templates/users/index.html");
        expect(requests[1].url).to.be.eq("templates/users/add.html");
        done();
      }, 20);
    });

    it("should load dynamic/server template for users.details route", function(done) {
      var routeName = "users.detail";
      $.router.go(routeName, { id: 101 });
      setTimeout(function() {
        expect(requests[0].url).to.be.eq("users.php?userId=101");
        done();
      }, 20);
    });
  });
})(require("chai"), require("chai").expect, require("sinon"));
