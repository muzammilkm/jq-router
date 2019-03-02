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
