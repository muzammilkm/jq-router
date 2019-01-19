(function(chai, expect, window, jQuery) {
    global.window = window;
    global.jQuery = jQuery;
    global.$ = jQuery;
    require('../src/jq-router.js');
    require('../src/services/jq-router-events.js');
    require('../src/services/jq-router-param-service.js');
    require('../src/services/jq-router-renderer.js');

    describe('when routes are not set in jqRouter', function() {
        it('should be empty current route ', function() {
            var current = $.router.getCurrentRoute();
            expect(Object.keys(current)).to.have.lengthOf(0);
        });

        it('should be empty current params', function() {
            var params = $.router.getCurrentParams();
            expect(Object.keys(params)).to.have.lengthOf(0);
        });

        it('should be undefined route', function() {
            var route = $.router.getRouteName('home');
            expect(route).to.be.undefined;
        });

        it('should be undefined windows location', function() {
            $.router.go('home');
            expect(window.location).to.be.undefined;
        });

        it('should be undefined url', function() {
            var url = $.router.href('home');
            expect(url).to.be.undefined;
        });
        
    });
}(require('chai'), require('chai').expect, require('jsdom'), require('jquery')));