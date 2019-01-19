jQ-Router($.router)
===================
[![npm](https://img.shields.io/npm/v/jq-router.svg)](https://www.npmjs.com/package/jq-router)

Built on jQuery 1.3.0 & Inspried by (Angular ui-router & jQuery Single Page Application micro framework).


## Features
1. Tiny
2. Pure jQuery based Single Page Application (SPA)
3. State based routing
4. Seperation Concerns
5. Nested Views
6. Events
7. Supports Navigation via both href & javascript

## Demo
* [Simple](https://muzammilkm.github.io/jq-router/docs/simple/index.html)
	* Easy & Simple
* [Simple-Non-Cache](https://muzammilkm.github.io/jq-router/docs/simple-non-cache/index.html)
	* Easy & Simple
	* Cachable Routes
* [Nested Views](https://muzammilkm.github.io/jq-router/docs/nested-views/index.html)
	* Nested View (Parent > Child > Grand Child)
* [Lazy Store](https://muzammilkm.github.io/jq-router/docs/lazy-store/index.html)
	* Nested View
	* View Model
	* Accessing Params
	* Generating Urls (via $.router.href)
* [Admin Portal](https://muzammilkm.github.io/jq-router/docs/admin-portal/index.html)
	* Deferred Execution of Route(via resolve)
	* Redirection (via $.router.go)
* [Gallery](https://muzammilkm.github.io/jq-router/docs/gallery/index.html)
	* Accessing Params
	* Nested Views
	* Abstract Views

## Installation

### Manual Installation

Download the **jq-router.js** file or **jq-router.min.js** (*recommended*) file from dist folder and include it in your page either in the `<head>` section or just before the closing tag of the `<body>` section after including jquery library.

### NPM
```
> npm install jq-router
```

### Bower
```
$ bower install jq-router
```

## Introduction
A tiny jQuery plugin for building single page application (SPA) with the possibility of nested views.

Basic Example
```javascript
(function () {
   var routes = {},
	defaultRoute = 'home';

    routes['home'] = {
	url: '#/',
	templateUrl: 'templates/home.html'
    };

    routes['contact'] = {
	url: '#/contact',
	templateUrl: 'templates/contact.html'
    };

    $.router
	.setData(routes)
	.setDefault(defaultRoute);

    $.when($.ready)
	.then(function() {
	    $.router.run('.my-view','home');
	});
}());
```

## Documentation
Routes is collection of route objects. Each route object consists of url, templateUrl & each route can be parent route of another route.

```javascript
    var routes = {};
    
    route["parent"] = {
	url: '', 
	abstract: true,
	templateUrl: ''
    }
    
    route["parent.child"] = {
	url: '', 
	templateUrl: ''
    }
    
    route["parent.child.grandchild"] = {
	url: '', 
	cache: bool,
	templateUrl: ''
    }
```

###### Details description of route properties
```javascript
abstract: true
```
> if route has child route & view
```javascript
url: ''
```
> Should be hashed('#') url that can contain accept optional parameters using (:name) 
```javascript
templateUrl: ''
```
> Allowing caching of route template or you can also set default to all routes in setData,  
```javascript
cahce: true || false
```
> Path to render the view in matched view selector.

```javascript
resolve: callback //function or [] of function
```
> A callback function or array of function's which is executed when a route is matched & route is rendered only when all deferred objects are resolved.s

```javascript
 $.router.setData(data, isCacheTempalte);
```
> setDate takes two parameters 
* data: A route object which contains route definition, like url, template url, route is parent & should it be cached.
* isCacheTempalte: If the templates are server side pages (like php, aspx, jsp, or server rendered). Then you set this to false & templates are not cached.

```javascript
 $.router.setDefault(name);
```
> setDefault 
* name: A route name, if the url does not match to any route, router will redirect to default secified route.

```javascript
$.when($.ready)
  .then(function() {
	$.router.run('.ui-view', 'home');
  });
```
> Run takes two parameters 
* View selector, This will be used to match element & replace the template.
* On Initial load, Navigate to a route.

### Events
There are about 6 events, you can listen to these events or subscribe to events via router. Events are triggered in the following order.

#### Event Trigger Order 
If Route Matched:
```javascript
	onRouteMatched -> onRouteBeforeChange -> onViewDestroyed -> onViewChange -> onRouteChanged
```

If Route Not Matched:
```javascript
	onRouteNotMatched
```

##### This event is trigged when view is loaded in to dom & either controller or viewmodel can be initiated.
* Window Event
* View Route
* Matched Route
* Matched Params

```javascript
$(window).trigger($.router.renderViewSuccess, function(e, viewRoute, route, params){
	// ...
});

//or

$(window).trigger('jqRouter.renderViewSuccess', function(e, viewRoute, route, params){
	// ...
});

//or

$.router.onViewChange( function(e, viewRoute, route, params){
	// ...
});
```
##### This event is trigged when before current route is changed.
* Window Event
* Matched Route
* Matched Params

```javascript
$(window).trigger($.router.routeChangeStart, function(e, route, params){
	// ...
});

//or

$(window).trigger('jqRouter.routeChangeStart', function(e, route, params){
	// ...
});

//or

$.router.onRouteBeforeChange( function(e, route, params){
	// ...
});

```

##### This event is trigged when current route is changed.
* Window Event
* Current Route
* Current Params

```javascript
$(window).trigger($.router.routeChangeSuccess, function(e, route, params){
	// ...
});

//or

$(window).trigger('jqRouter.routeChangeSuccess', function(e, route, params){
	// ...
});

//or

$.router.onRouteChanged( function(e, route, params){
	// ...
});
```

##### This event is trigged when a route is matched.
* Window Event
* Matched Route
* Matched Params

```javascript
$(window).trigger($.router.routeMatched, function(e, route, params){
	// ...
});

//or

$(window).trigger('jqRouter.routeMatched', function(e, route, params){
	// ...
});

//or

$.router.onRouteMatched( function(e, route, params){
	// ...
});
```

##### This event is trigged when a route is not matched.
* Window Event
* Matched Route
* Matched Params

```javascript
$(window).trigger($.router.routeNotMatched, function(e, route, params){
	// ...
});

//or

$(window).trigger('jqRouter.routeNotMatched', function(e, route, params){
	// ...
});

//or

$.router.onRouteNotMatched( function(e, route, params){
	// ...
});
```

##### This event is trigged when view unloaded from dom. In a nested view they will be trigged from bottom to top last route that is getting changed
* Window Event
* View Route

```javascript
$(window).trigger($.router.viewDestroyed, function(e, viewRoute){
	// ...
});

//or

$(window).trigger('jqRouter.viewDestroyed', function(e, viewRoute){
	// ...
});

//or

$.router.onViewDestroyed( function(e, viewRoute){
	// ...
});
```