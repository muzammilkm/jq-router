jQ-Router($.router)
===================
Built on jQuery 1.3.0 & Inspried by (Angular ui-router & jQuery Single Page Application micro framework).

# Features
1. Tiny
2. Single Page Application (SPA)
3. Routing
4. Seperation Concerns
5. Nested Views


# Demo
1. [Basic](https://muzammilkm.github.io/jq-router/docs/basic.html)

# Introduction
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

# Documentation
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
