(function(window, rp) {
    var router = rp.router = {},
        env = rp.ENV,
        templateCache = {},
        isFirstTime = true,
        defaultRoute,
        viewSelector,
        current;

    function getViewTemplate(url) {
        return $.get(url + '?_=' + env.appVer, "html")
            .then(function(content) {
                templateCache[url] = content;
            });
    }

    function onhashchange() {
        var hash = window.location.hash,
            routes = router.routes,
            matchedRoute = router.match(hash);

        if (matchedRoute) {
            var requests = [];
            for (var i in matchedRoute.segments) {
                var segment = matchedRoute.segments[i],
                    route = routes[segment];

                if (!templateCache[route.templateUrl]) {
                    requests.push(getViewTemplate(route.templateUrl));
                }
            }

            $.when.apply($, requests)
                .then(function() {
                    for (var i in matchedRoute.segments) {
                        var segment = matchedRoute.segments[i],
                            route = routes[segment],
                            $page = $(viewSelector + ':eq(' + i + ')');
                        if (!current || matchedRoute.segments[i] !== current.segments[i]) {
                            $page.html(templateCache[route.templateUrl]);
                            if (rp.controller.is(route.controller)) {
                                rp.controller.get(route.controller).init();
                            }
                        }
                    }

                    current = matchedRoute;
                });
        }
    }

    router.match = function(url) {
        var s = this,
            route;
        for (var routeName in s.routes) {
            if (!s.routes[routeName].abstract && s.routes[routeName].url === url) {
                route = s.routes[routeName];
            }
        }
        return route;
    };

    router.setData = function(data) {
        var s = this;

        s.routes = {};
        for (var routeName in data) {
            var segments = routeName.split('.'),
                _routeName = [],
                url = '',
                route = s.routes[routeName] = {
                    segments: []
                };

            for (var i in segments) {
                _routeName.push(segments[i]);
                var segment = _routeName.join('.');

                url += data[segment].url;
                route.segments.push(segment);
            }
            route.url = url;
            route.templateUrl = data[routeName].templateUrl;
            route.controller = data[routeName].controller;
        }
        return this;
    };

    router.setDefault = function(name) {
        defaultRoute = name;
        return this;
    };

    router.go = function(routeName, params) {
        routeName = routeName || defaultRoute;
        window.location = router.routes[routeName].url;
    };

    router.run = function(vSelector, routeName, params) {
        if (isFirstTime) {
            viewSelector = vSelector;
            $(window).on("hashchange", onhashchange);
            var route = this.match(window.location.hash);
            if (!route) {
                this.go(routeName, params);
            } else {
                onhashchange();
            }
            isFirstTime = false;
        }
    };


}(this, RealPage));