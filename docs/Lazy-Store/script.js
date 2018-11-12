(function($) {
  var routes = {},
    defaultRoute = 'store';

  routes['store'] = {
    url: '#/',
    templateUrl: 'templates/store.html',
    viewModel: vm["storeVM"],
  };

  routes['categoryDetail'] = {
    url: '#/categories/:categoryId',
    templateUrl: 'templates/category.html',
    viewModel: vm["categoryVM"],
  };

  routes['subCategoryDetail'] = {
    url: '#/categories/:categoryId/sub-categories/:subCategoryId',
    templateUrl: 'templates/product.html',
    viewModel: vm["productVM"],
  };

  routes['productDetail'] = {
    url: '#/categories/:categoryId/sub-categories/:subCategoryId/products/:productId',
    templateUrl: 'templates/product-detail.html',
    viewModel: vm["productDetailVM"],
  };

  $.router
    .setData(routes)
    .setDefault(defaultRoute)
    .onRouteChanged(function(e, route, param) {
      route.viewModel(route, param);
    });

  $.when($.ready).then(function() {
    $.router.run('.my-view', 'store');
  });

})(jQuery);
