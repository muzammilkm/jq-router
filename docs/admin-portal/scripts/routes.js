(function($) {
    var routes = {},
        defaultRoute = 'login';

    function isUserAuthenticated() {
        var defer = $.Deferred();
        var isAuthenticated = sessionStorage.getItem("authenticate");
        if (isAuthenticated=="true") {
            defer.resolve();
        } else {
            defer.reject();
            $.router.go("unauthorized");
        }
        return defer;
    }

    routes['login'] = {
        url: '#/',
        templateUrl: 'templates/login.html',
        viewModel: vm.loginVM
    };

    routes['admin'] = {
        url: '#/admin',
        abstract: true,
        resolve: [isUserAuthenticated],
        templateUrl: 'templates/admin.html',
    };

    routes['admin.dashboard'] = {
        url: '',
        templateUrl: 'templates/dashboard.html',
    };

    routes['admin.users'] = {
        url: '/users',
        templateUrl: 'templates/users.html',
    };

    routes['unauthorized'] = {
        url: '#/unauthorized',
        templateUrl: 'templates/unauthorized.html'
    };

    $.router.setData(routes).setDefault(defaultRoute)
        .onRouteChanged(function(e, route, param) {
            if(route.viewModel){
                route.viewModel(route, param);
            }
        });

    $.when($.ready).then(function() {
        $.router.run('.my-view', 'login');
    });

})(jQuery);