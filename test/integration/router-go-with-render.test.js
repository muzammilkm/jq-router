(function(chai, expect, sinon) {
  describe(__filename, function() {
    // var requests = [],
    //   xhr;
    before(function() {
      require("../setup.config.js");
    });

    before(function() {
      // xhr = sinon.useFakeXMLHttpRequest();
      // xhr.onCreate = function(xhr) {
      //   this.requests.push(xhr);
      // }.bind(this);

      var ajaxStub = sinon.stub($, "ajax");
      ajaxStub.returns(Promise.resolve());
      // ajaxStub
      //   .withArgs(
      //     sinon.match({
      //       url: "https://http://jq-router.com/templates/index.html"
      //     })
      //   )
      //   .yieldsToAsync("then", "<h1></h1>");

      // getAjax.yieldsTo("success", "<h1></h1>");

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
      //xhr.restore();
      $.ajax.restore();
      // $(window).off("hashchange");
      // $.router.setData(null);
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
