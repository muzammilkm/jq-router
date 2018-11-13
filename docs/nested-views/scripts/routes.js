// Code goes here
(function($) {
  var routes = {},
    defaultRoute = 'pages';

  routes['pages'] = {
    url: '#/',
    templateUrl: 'templates/pages.html',
  };

  routes['pages.page1'] = {
    url: 'page-1',
    templateUrl: 'templates/page1.html',
  };

  routes['pages.page1.subpage1'] = {
    url: '/sub-page-1',
    templateUrl: 'templates/page1.sub-page1.html',
  };

  routes['pages.page1.subpage2'] = {
    url: '/sub-page-2',
    templateUrl: 'templates/page1.sub-page2.html'
  };

  routes['pages.page2'] = {
    url: 'page-2',
    templateUrl: 'templates/page2.html',
  };

  routes['pages.page2.subpage1'] = {
    url: '/sub-page-1',
    templateUrl: 'templates/page2.sub-page1.html',
  };
  

  $.router.setData(routes).setDefault(defaultRoute);

  $.when($.ready).then(function() {
    $.router.run('.my-view', 'pages');
  });
  
})(jQuery);
