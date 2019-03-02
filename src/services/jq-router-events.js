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