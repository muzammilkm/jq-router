(function(chai, expect) {

  describe("when routes are not set in jqRouter", function() {
    it("should be empty current route ", function() {
      var current = $.router.getCurrentRoute();
      expect(Object.keys(current)).to.have.lengthOf(0);
    });

    it("should be empty current params", function() {
      var params = $.router.getCurrentParams();
      expect(Object.keys(params)).to.have.lengthOf(0);
    });

    it("should be undefined route", function() {
      var route = $.router.getRouteName("home");
      expect(route).to.be.undefined;
    });

    it("should not change the windows location", function() {
      $.router.go("home");
      expect(window.location.href).to.be.eq("about:blank");
    });

    it("should be undefined url", function() {
      var url = $.router.href("home");
      expect(url).to.be.undefined;
    });
  });
})(
  require("chai"),
  require("chai").expect
);
