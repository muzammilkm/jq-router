/*!
 * jQ-Router JQuery Plugin v1.0.0
 * https://github.com/muzammilkm/jq-router
 *
 * Copyright 2017, Muzammil Khaja Mohammed
 * Licensed under the MIT license.
 * https://github.com/muzammilkm/jq-router/blob/master/LICENSE
 *
 * Date: Tue Sept 26 7:14:25 2017 +0530
 */

 (function($, window) {
    var router,
        isFirstTime = true,
        defaultRoute,
        events = {
            routeChangeStart: 'router.routeChangeStart',
            routeChangeSucess: 'router.routeChangeSucess',
            renderViewSucess: 'render.renderViewSucess'
        },
        render;

    router = (function() {
        var s = {},
            current;

        function onhashchange() {
            var hash = window.location.hash,
                matchedRoute = router.match(hash);

            if (matchedRoute) {
                $(window).trigger(events.routeChangeStart, [matchedRoute]);
                render.processRoute(matchedRoute, s.routes)
                    .then(function() {
                        render.render(current, matchedRoute, s.routes);
                        $(window).trigger(events.routeChangeSucess, [matchedRoute]);
                        current = matchedRoute;
                    });
            }
        }

        s.match = function(url) {
            var s = this,
                route;
            for (var routeName in s.routes) {
                if (!s.routes[routeName].abstract && s.routes[routeName].url === url) {
                    route = s.routes[routeName];
                }
            }
            return route;
        };

        s.setData = function(data) {
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
                route.name = routeName;
                route.url = url;
                route.templateUrl = data[routeName].templateUrl;
                route.controller = data[routeName].controller;
            }
            return s;
        };

        s.setDefault = function(name) {
            defaultRoute = name;
            return this;
        };

        s.getCurrentRoute = function() {
            return current;
        };

        s.go = function(routeName, params) {
            var s = this;
            routeName = routeName || defaultRoute;
            window.location = s.routes[routeName].url;
            return s;
        };

        s.run = function(viewSelector, routeName, params) {
            var s = this;
            if (isFirstTime) {
                render.setViewSelector(viewSelector);
                $(window).on("hashchange", onhashchange);
                var route = s.match(window.location.hash);
                if (!route) {
                    s.go(routeName, params);
                } else {
                    onhashchange();
                }
                isFirstTime = false;
            }
            return s;
        };

        s.onViewChange = function(handler) {
            var s = this;
            $(window).on(events.renderViewSucess, handler);
            return s;
        };

        return s;
    }());


    render = (function() {
        var s = {},
            templateCache = {},
            viewSelector;

        s.setViewSelector = function(selector) {
            viewSelector = selector;
            return this;
        };

        s.getViewTemplate = function(url) {
            return $.get(url, "html")
                .then(function(content) {
                    templateCache[url] = content;
                });
        };

        s.processRoute = function(route, routes) {
            var s = this,
                requests = [];

            for (var i in route.segments) {
                var segment = route.segments[i],
                    _route = routes[segment];

                if (!templateCache[_route.templateUrl]) {
                    requests.push(s.getViewTemplate(_route.templateUrl));
                }
            }

            return $.when.apply($, requests);
        };

        s.render = function(current, route, routes) {
            for (var i in route.segments) {
                var segment = route.segments[i],
                    _route = routes[segment],
                    $page = $(viewSelector + ':eq(' + i + ')');
                if (!current || route.segments[i] !== current.segments[i]) {
                    $page.html(templateCache[_route.templateUrl]);
                    $(window).trigger(events.renderViewSucess, [_route]);
                }
            }
        };

        return s;
    }());

    $.router = router;
}(jQuery, this));