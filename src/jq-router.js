/*!
 * jQ-Router JQuery Plugin v2.1.0
 * https://github.com/muzammilkm/jq-router
 *
 * Copyright 2017, Muzammil Khaja Mohammed
 * Licensed under the MIT license.
 * https://github.com/muzammilkm/jq-router/blob/master/LICENSE
 *
 * Date: Tue Oct 1 10:36:25 2017 +0530
 */

(function($, window) {
    var router,
        events = {
            routeChangeStart: 'jqRouter.routeChangeStart',
            routeChangeSuccess: 'jqRouter.routeChangeSuccess',
            renderViewSuccess: 'jqRouter.renderViewSuccess',
            viewDestroyed: 'jqRouter.viewDestroyed'
        },
        current = {
            route: {},
            params: {}
        },
        paramSrv,
        renderEngine;

    router = (function() {
        var s = {},
            isFirstTime = true,
            defaultRoute,
            expr = {
                Param_Replacer: "([^\/]+)",
                Param_Matcher: /:([\w\d]+)/g,
            };

        /**
         * Get current route params
         * @return {object} params
         */
        s.getCurrentParams = function() {
            return current.params;
        };

        /**
         * Get current route
         * @return {object} route
         */
        s.getCurrentRoute = function() {
            return current.route;
        };

        /**
         * Get route by name
         * @params {string} routeName
         * @return {object} route
         */
        s.getRouteName = function(routeName) {
            var s = this;
            return s.routes[routeName];
        };

        /**
         * Get route params
         * @params {object} route
         * @return {object} params
         */
        s.getRouteParams = function(route) {
            var s = this,
                params = {},
                match = route.urlExpr.exec(route.url);

            for (var i = 0; i < route.params.length; i++) {
                params[route.params[i]] = match[i + 1];
            }

            return $.extend({}, paramSrv.getParams(), params);
        };

        /**
         * Navigates to given route name & params
         * @params {string} routeName
         * @params {object} params
         * @return {object} this
         */
        s.go = function(routeName, params) {
            var s = this;
            paramSrv.setParams(params);
            window.location = s.href(routeName, params);
            return s;
        };

        /**
         * Get url for given route name & params
         * @params {string} routeName
         * @params {object} params
         * @return {string} 
         */
        s.href = function(routeName, params) {
            routeName = routeName || defaultRoute;

            var s = this,
                route = s.routes[routeName],
                url = route.relativeUrl;

            for (var i = 0; i < route.params.length; i++) {
                url = url.replace(':' + route.params[i], params[route.params[i]]);
            }
            return url;
        };

        /**
         * Check route params are modified or not
         * @params {string} routeName
         * @params {object} params
         * @return {bool} 
         */
        s.isRouteParamChanged = function(routeName, params) {
            var s = this;
            return s.href(routeName, params) !== s.href(routeName, s.getCurrentParams());
        };

        /**
         * Return matched route based on url
         * @params {string} url
         * @return {object} route
         */
        s.match = function(url) {
            var s = this,
                route;
            for (var routeName in s.routes) {
                if (!s.routes[routeName].abstract && s.routes[routeName].urlExpr.exec(url) !== null) {
                    route = s.routes[routeName];
                }
            }
            return route;
        };

        /**
         * Listen to url change events & should not be called outside of router.
         * @params {string} hash
         * @return {object} this
         */
        s.onhashchange = function(hash) {
            var s = this,
                matchedRoute = s.match(hash),
                matchedParams;

            if (matchedRoute) {
                matchedRoute.previousUrl = current.route.url || hash;
                matchedRoute.url = hash;
                matchedParams = s.getRouteParams(matchedRoute);

                $(window).trigger(events.routeChangeStart, [matchedRoute, matchedParams]);
                renderEngine.processRoute(matchedRoute)
                    .then(function() {
                        renderEngine.render(matchedRoute, matchedParams);
                        current.route = matchedRoute;
                        current.params = matchedParams;
                        $(window).trigger(events.routeChangeSuccess, [matchedRoute, matchedParams]);
                    });
            } else {
                s.go(defaultRoute);
            }
            return s;
        };

        /**
         * Subscribe route change started event.
         * @params {function} handler
         * @return {object} this
         */
        s.onRouteBeforeChange = function(handler) {
            var s = this;
            $(window).on(events.routeChangeStart, handler);
            return s;
        };

        /**
         * Subscribe route change sucess event.
         * @params {function} handler
         * @return {object} this
         */
        s.onRouteChanged = function(handler) {
            var s = this;
            $(window).on(events.routeChangeSuccess, handler);
            return s;
        };

        /**
         * Subscribe view change event.
         * @params {function} handler
         * @return {object} this
         */
        s.onViewChange = function(handler) {
            var s = this;
            $(window).on(events.renderViewSuccess, handler);
            return s;
        };

        /**
         * Subscribe view destroy event.
         * @params {function} handler
         * @return {object} this
         */
        s.onViewDestroyed = function(handler) {
            var s = this;
            $(window).on(events.viewDestroyed, handler);
            return s;
        };

        /**
         * Initialize the router & this should be invoked on document ready.
         * @params {string} viewSelector
         * @params {string} routeName
         * @params {object} params
         * @return {object} this
         */
        s.run = function(viewSelector, routeName, params) {
            var s = this;
            if (isFirstTime) {
                if (window.location.pathname.lastIndexOf('.') === -1 &&
                    window.location.pathname.substr(-1) !== '/') {
                    window.location.pathname = window.location.pathname + '/';
                    return;
                }
                renderEngine.setViewSelector(viewSelector);
                $(window).on("hashchange", function() {
                    s.onhashchange(window.location.hash);
                });
                var route = s.match(window.location.hash);
                if (!route) {
                    s.go(routeName, params);
                } else {
                    s.onhashchange(window.location.hash);
                }
                isFirstTime = false;
            }
            return s;
        };

        /**
         * Set route data by preparing params & expression.
         * @params {object} data
         * @return {object} this
         */
        s.setData = function(data) {
            var s = this;

            s.routes = {};
            for (var routeName in data) {
                var segments = routeName.split('.'),
                    _routeName = [],
                    relativeUrl = '',
                    urlExpr = '',
                    route = s.routes[routeName] = jQuery.extend(true, {}, data[routeName]),
                    paramMatch;

                route.name = routeName;
                route.segments = [];
                route.params = [];
                for (var i = 0; i < segments.length; i++) {
                    _routeName.push(segments[i]);
                    var segment = _routeName.join('.');

                    relativeUrl += data[segment].url;
                    route.segments.push(segment);
                }

                while ((paramMatch = expr.Param_Matcher.exec(relativeUrl)) !== null) {
                    route.params.push(paramMatch[1]);
                }
                urlExpr = new RegExp(relativeUrl.replace(expr.Param_Matcher, expr.Param_Replacer) + "$");
                route.relativeUrl = relativeUrl;
                route.urlExpr = urlExpr;
            }
            return s;
        };

        /**
         * Set default route name, if route is not found will resort to this.
         * @params {string} name
         * @return {object} this
         */
        s.setDefault = function(name) {
            var s = this;
            defaultRoute = name;
            return s;
        };

        return s;
    }());


    renderEngine = (function() {
        var s = {},
            templateCache = {},
            viewSelector;

        /**
         * Raise view destroy event before it can render the view.
         * @params {string} url
         * @return {object} deferred
         */
        s.clean = function(segments, till) {
            for (var i = segments.length - 1; i >= till; i--) {
                var _route = router.getRouteName(segments[i]);
                $(window).trigger(events.viewDestroyed, [_route]);
            }
        };

        /**
         * Download the template from server via ajax call.
         * @params {string} url
         * @return {object} deferred
         */
        s.getViewTemplate = function(url) {
            return $.get({
                    url: url,
                    dataType: 'html'
                })
                .then(function(content) {
                    templateCache[url] = content;
                });
        };

        /**
         * Check route template available in template cache or download the template.
         * @params {object} route
         * @return {object} deferred
         */
        s.processRoute = function(route) {
            var s = this,
                requests = [];

            for (var i = 0; i < route.segments.length; i++) {
                var _route = router.getRouteName(route.segments[i]);
                if (!templateCache[_route.templateUrl]) {
                    requests.push(s.getViewTemplate(_route.templateUrl));
                }
            }

            return $.when.apply($, requests);
        };

        /**
         * Render changed route from template cache & notify successfully rendered view.
         * @params {object} route
         * @params {object} params
         * @return {object} this
         */
        s.render = function(route, params) {
            var currentRoute = router.getCurrentRoute(),
                reload = $.isEmptyObject(currentRoute);

            for (var i = 0; i < route.segments.length; i++) {
                var _route = router.getRouteName(route.segments[i]),
                    $page = $(viewSelector + ':eq(' + i + ')');

                if (!reload) {
                    reload = (route.segments[i] !== currentRoute.segments[i]) ||
                        (router.isRouteParamChanged(route.segments[i], params));
                    if (reload) {
                        s.clean(currentRoute.segments, i);
                    }
                }


                if (reload) {
                    $page.html(templateCache[_route.templateUrl]);
                    $(window).trigger(events.renderViewSuccess, [_route, route, params]);
                }
            }
            return this;
        };

        /**
         * Set view selector for render engine to be used.
         * @params {string} selector
         * @return {object} this
         */
        s.setViewSelector = function(selector) {
            viewSelector = selector;
            return this;
        };

        return s;
    }());

    paramSrv = function() {
        var s = {},
            params;

        s.setParams = function(p){
            params = p;
        };

        s.getParams = function(){
            return params;
        };

        return s;
    }();

    $.router = router;
}(jQuery, this));