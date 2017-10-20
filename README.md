jQ-Router($.router)
===================
Built on jQuery 1.3.0 & Inspried by (Angular ui-router & jQuery Single Page Application micro framework).

## Features
1. Tiny
2. Single Page Application (SPA)
3. Routing
4. Seperation Concerns
5. Nested Views
6. Events
7. Supports Navigation via both href & javascript

## Demo
1. [Basic](https://muzammilkm.github.io/jq-router/docs/basic.html)
2. [Advance](https://muzammilkm.github.io/jq-router/docs/advance.html)

## Installation

### Manual Installation

Download the **jq-router.js** file or **jq-router.min.js** (*recommended*) file from dist folder and include it in your page either in the `<head>` section or just before the closing tag of the `<body>` section after including jquery librar.

### NPM
```
> npm install jq-router
```

### Bower
```
$ bower install jq-router
```

## Introduction
A tiny jQuery plugin for building single page application (SPA) with the possiblily of nested views.

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
> Path to render the view in matched view selector.

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
There are about 4 events, you can listen to these events or subscribe to events via router.

##### This event is trigged when before current route is changed.
* Window Event
* Matched Route
* Matched Params

```javascript
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
$(window).trigger('jqRouter.routeChangeSuccess', function(e, route, params){
	// ...
});

//or

$.router.onRouteChanged( function(e, route, params){
	// ...
});
```

##### This event is trigged when view is loaded in to dom & either controller or viewmodel can be initiated.
* Window Event
* View Route
* Matched Route
* Matched Params

```javascript
$(window).trigger('jqRouter.renderViewSuccess', function(e, viewRoute, route, params){
	// ...
});

//or

$.router.onViewChange( function(e, viewRoute, route, params){
	// ...
});
```
##### This event is trigged when view unloaded from dom. In a nested view they will be trigged from bottom to top last route that is getting changed
* Window Event
* View Route

```javascript
$(window).trigger('jqRouter.viewDestroyed', function(e, viewRoute){
	// ...
});

//or

$.router.onViewChange( function(e, viewRoute){
	// ...
});
```