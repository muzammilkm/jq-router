(function($) {

    function wait() {
        var defer = $.Deferred();
        setTimeout(function() {
            defer.resolve();
        }, 2000);
        return defer;
    };

    var routes = {},
        defaultRoute = 'home';

    routes['home'] = {
        url: '#/',
        templateUrl: 'templates/home.html'
    };

    routes['about'] = {
        url: '#/about',
        templateUrl: 'templates/about.html'
    };

    routes['gallery'] = {
        abstract: true,
        url: '#/gallery',
        templateUrl: 'templates/gallery.html'
    };

    routes['gallery.dashboard'] = {
        url: '',
        templateUrl: 'templates/gallery_dashboard.html'
    };

    routes['gallery.portfolio'] = {
        url: '/portfolio/:portfolioId',
        templateUrl: 'templates/portfolio.html'
    };

    routes['contact'] = {
        url: '#/contact',
        resolve: wait,
        templateUrl: 'templates/contact.html'
    };

    $.router
        .setData(routes)
        .setDefault(defaultRoute);

    $.when($.ready)
        .then(function() {
            $.router.run('.my-view', 'home');
        });

}(jQuery));