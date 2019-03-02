/*!
 * jQ-Router JQuery Plugin v4.6.1
 * https://github.com/muzammilkm/jq-router
 *
 * Copyright 2017, Muzammil Khaja Mohammed
 * Licensed under the MIT license.
 * https://github.com/muzammilkm/jq-router/blob/master/LICENSE
 *
 * Date: Sat Mar 2 9:25:00 2019 +0530
 */

(function($, window) {
    var router,
        current = {
            route: {},
            params: {}
        };

    router = (function() {
        var s = {
                routes: {}
            },
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
         * @param {string} routeName
         * @return {object} route
         */
        s.getRouteName = function(routeName) {
            var s = this;
            return s.routes[routeName];
        };

        /**
         * Get route params
         * @param {object} route
         * @return {object} params
         */
        s.getRouteParams = function(route) {
            var s = this,
                params = {},
                match = route.urlExpr.exec(route.url);

            for (var i = 0; i < route.params.length; i++) {
                params[route.params[i]] = match[i + 1];
            }

            return $.extend({}, s.paramService.getParams(), params);
        };

        /**
         * Navigates to given route name & params
         * @param {string} routeName
         * @param {object} params
         * @return {object} this
         */
        s.go = function(routeName, params) {
            var s = this,
                url = s.href(routeName, params);
            if (url) {
                s.paramService.setParams(params);
                window.location.assign(url);
            }
            return s;
        };

        /**
         * Get url for given route name & params
         * @param {string} routeName
         * @param {object} params
         * @return {string} 
         */
        s.href = function(routeName, params) {
            routeName = routeName || defaultRoute;
            var s = this,
                route = s.routes[routeName];
            if (!route) {
                return;
            }
            return s.paramReplacer(route.relativeUrl, route, params);
        };

        /**
         * Check route params are modified or not
         * @param {string} routeName
         * @param {object} params
         * @return {bool} 
         */
        s.isRouteParamChanged = function(routeName, params) {
            var s = this;
            return s.href(routeName, params) !== s.href(routeName, s.getCurrentParams());
        };

        /**
         * Return matched route based on url
         * @param {string} url
         * @return {object} route
         */
        s.match = function(url) {
            var s = this,
                route;
            for (var routeName in s.routes) {
                if (!s.routes[routeName].abstract && s.routes[routeName].urlExpr.exec(url) !== null) {
                    route = s.routes[routeName];
                    break;
                }
            }
            return route;
        };

        /**
         * Listen to url change events & should not be called outside of router.
         * @param {string} hash
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

                $(window).trigger(s.events.routeMatched, [matchedRoute, matchedParams]);

                s.renderEngine
                    .processRoute(matchedRoute, matchedParams)
                    .then(function() {
                        $(window).trigger(s.events.routeChangeStart, [matchedRoute, matchedParams]);
                        s.renderEngine.render(matchedRoute, matchedParams);
                        current.route = matchedRoute;
                        current.params = matchedParams;
                        $(window).trigger(s.events.routeChangeSuccess, [matchedRoute, matchedParams]);
                    });
            } else {
                $(window).trigger(s.events.routeNotMatched, [matchedRoute, matchedParams]);
                if (defaultRoute) {
                    s.go(defaultRoute);
                }
            }
            return s;
        };

        /**
         * Replace Params for given string with route & params
         * @param {string} 
         * @param {object} route
         * @param {object} params
         * @returns {string} 
         */
        s.paramReplacer = function(str, route, params) {
            if(!str){
                return;
            }
            for (var i = 0; i < route.params.length; i++) {
                str = str.replace(':' + route.params[i], params[route.params[i]]);
            }
            
            return str;
        };

        /**
         * Initialize the router & this should be invoked on document ready.
         * @param {string} viewSelector
         * @param {string} routeName
         * @param {object} params
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
                s.renderEngine.setViewSelector(viewSelector);
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
         * @param {object} data
         * @param {bool} isCacheTempalte default to true
         * @return {object} this
         */
        s.setData = function(data, isCacheTempalte) {
            var s = this;

            isCacheTempalte = isCacheTempalte === undefined ? true : isCacheTempalte;
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
                urlExpr = new RegExp("^" + relativeUrl.replace(expr.Param_Matcher, expr.Param_Replacer) + "$");
                route.relativeUrl = relativeUrl;
                route.urlExpr = urlExpr;
                route.cache = route.hasOwnProperty("cache") ? route.cache : isCacheTempalte;
            }
            return s;
        };

        /**
         * Set default route name, if route is not found will resort to this.
         * @param {string} name
         * @return {object} this
         */
        s.setDefault = function(name) {
            var s = this;
            defaultRoute = name;
            return s;
        };

        return s;
    }());

    $.router = router;
}(jQuery, window));
/*!
 * jQ-Router JQuery Plugin v4.6.1
 * https://github.com/muzammilkm/jq-router
 *
 * Copyright 2017, Muzammil Khaja Mohammed
 * Licensed under the MIT license.
 * https://github.com/muzammilkm/jq-router/blob/master/LICENSE
 *
 * Date: Sat Mar 2 9:25:00 2019 +0530
 */

(function($, window, router) {

    router.events = Object.freeze({
        renderViewSuccess: 'jqRouter.renderViewSuccess',
        routeChangeStart: 'jqRouter.routeChangeStart',
        routeChangeSuccess: 'jqRouter.routeChangeSuccess',
        routeMatched: 'jqRouter.routeMatched',
        routeNotMatched: 'jqRouter.routeNotsMatched',
        viewDestroyed: 'jqRouter.viewDestroyed',
    });


    /**
     * Subscribe route change started event.
     * @param {function} handler
     * @return {object} this
     */
    router.onRouteBeforeChange = function(handler) {
        var s = this;
        $(window).on(s.events.routeChangeStart, handler);
        return s;
    };

    /**
     * Subscribe route change sucess event.
     * @param {function} handler
     * @return {object} this
     */
    router.onRouteChanged = function(handler) {
        var s = this;
        $(window).on(s.events.routeChangeSuccess, handler);
        return s;
    };

    /**
     * Subscribe route matched event.
     * @param {function} handler
     * @return {object} this
     */
    router.onRouteMatched = function(handler) {
        var s = this;
        $(window).on(s.events.routeMatched, handler);
        return s;
    };

    /**
     * Subscribe route not matched event.
     * @param {function} handler
     * @return {object} this
     */
    router.onRouteNotMatched = function(handler) {
        var s = this;
        $(window).on(s.events.routeNotMatched, handler);
        return s;
    };

    /**
     * Subscribe view change event.
     * @param {function} handler
     * @return {object} this
     */
    router.onViewChange = function(handler) {
        var s = this;
        $(window).on(s.events.renderViewSuccess, handler);
        return s;
    };

    /**
     * Subscribe view destroy event.
     * @param {function} handler
     * @return {object} this
     */
    router.onViewDestroyed = function(handler) {
        var s = this;
        $(window).on(s.events.viewDestroyed, handler);
        return s;
    };

}(jQuery, window, $.router));
/*!
 * jQ-Router JQuery Plugin v4.6.1
 * https://github.com/muzammilkm/jq-router
 *
 * Copyright 2017, Muzammil Khaja Mohammed
 * Licensed under the MIT license.
 * https://github.com/muzammilkm/jq-router/blob/master/LICENSE
 *
 * Date: Sat Mar 2 9:25:00 2019 +0530
 */

(function($, router) {

    router.paramService = (function() {
        var s = {},
            params;

        s.setParams = function(p) {
            params = p;
        };

        s.getParams = function() {
            return params;
        };

        return s;
    }());

}(jQuery, $.router));

/*!
 * jQ-Router JQuery Plugin v4.6.1
 * https://github.com/muzammilkm/jq-router
 *
 * Copyright 2017, Muzammil Khaja Mohammed
 * Licensed under the MIT license.
 * https://github.com/muzammilkm/jq-router/blob/master/LICENSE
 *
 * Date: Sat Mar 2 9:25:00 2019 +0530
 */

(function($, router) {

    router.renderEngine = (function() {
        var s = {},
            templateCache = {},
            viewSelector;

        /**
         * Raise view destroy event before rendering the view.
         * @param {string} url
         * @return {object} renderEngine
         */
        s.clean = function(segments, till) {
            var s = this;
            for (var i = segments.length - 1; i >= till; i--) {
                var _route = router.getRouteName(segments[i]);
                $(window).trigger(router.events.viewDestroyed, [_route]);
            }
            return s;
        };

        /**
         * Download the template from server via ajax call.
         * @param {string} url
         * @param {bool} cache
         * @return {object} deferred
         */
        s.getViewTemplate = function(url, templateUrl, cache) {
            return $.get({
                    url: url,
                    cache: cache,
                    dataType: 'html'
                })
                .then(function(content) {
                    templateCache[templateUrl] = content;
                });
        };

        /**
         * Check route template available in template cache or download the template.
         * @param {object} route
         * @return {object} deferred
         */
        s.processRoute = function(route, params) {
            var s = this,
                requests = [];

            for (var i = 0; i < route.segments.length; i++) {
                var _route = router.getRouteName(route.segments[i]);
                if (Array.isArray(_route.resolve)) {
                    for (var j = 0; j < _route.resolve.length; j++) {
                        var cb = _route.resolve[j];
                        if (typeof(cb) === "function") {
                            requests.push(cb(route, params));
                        }
                    }
                } else if (typeof(_route.resolve) === "function") {
                    requests.push(_route.resolve(route, params));
                }

                if (!templateCache[_route.templateUrl] || !_route.cache) {
                    var templateUrl = router.paramReplacer(_route.templateUrl, _route, params);
                    requests.push(s.getViewTemplate(templateUrl, _route.templateUrl, _route.cache));
                }
            }

            return $.when.apply($, requests);
        };

        /**
         * Render changed route from template cache & notify successfully rendered view.
         * @param {object} route
         * @param {object} params
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
                        (i + 1 === route.segments.length) ||
                        (router.isRouteParamChanged(route.segments[i], params));
                    if (reload) {
                        s.clean(currentRoute.segments, i);
                    }
                }

                if (reload) {
                    $page.html(templateCache[_route.templateUrl]);
                    $(window).trigger(router.events.renderViewSuccess, [_route, route, params]);
                }
            }
            return this;
        };

        /**
         * Set view selector for render engine to be used.
         * @param {string} selector
         * @return {object} this
         */
        s.setViewSelector = function(selector) {
            viewSelector = selector;
            return this;
        };

        return s;
    }());

}(jQuery, $.router));