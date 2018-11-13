var vm = {};
(function() {
  var categories = ['Electronics', 'Appliances', 'Furniture', 'Sports'];

  var subCategories = [
    ['Mobile', 'Laptop', 'Tablets'],
    ['TV', 'Washing Machine', 'AC'],
    ['Kitchen', 'Lighting'],
    ['Games', 'Toys'],
  ];
  var products = [
    [
      [{
          name: 'Honor 10',
          price: '$1000',
          rating: 3.5
        },
        {
          name: 'Samsung Note 10',
          price: '$2000',
          rating: 3.8
        },
      ],
      [{
          name: 'HP i5 Core',
          price: '$3500',
          rating: 2.5
        },
        {
          name: 'Microsoft Surface',
          price: '$6000',
          rating: 4.5
        },
      ],
      [{
        name: 'Asus 10x',
        price: '$1000',
        rating: 4.0
      }],
    ],
    [
      [{
          name: 'Philps 48',
          price: '$6000',
          rating: 3.5
        },
        {
          name: 'LG Smart',
          price: '$6500',
          rating: 3.5
        },
      ],
      [{
        name: 'LG',
        price: '$8500',
        rating: 4.0
      }],
      [{
        name: 'Samsung',
        price: '$2500',
        rating: 4.0
      }],
    ],
    [
      [{
          name: 'Milton Lunch Box',
          price: '$200',
          rating: 4.6
        },
        {
          name: 'Pegion Mop Set',
          price: '$500',
          rating: 4.8
        },
      ],
      [{
        name: 'Philis LED',
        price: '$85',
        rating: 3.4
      }],
    ],
    [
      [{
        name: 'Game 1',
        price: '$2000',
        rating: 2.3
      }],
      [{
        name: 'Toy Train D',
        price: '$50',
        rating: 4.0
      }],
    ],
  ];

  vm.storeVM = function(route, param) {
    $('#categories').empty();
    categories.forEach(function(item, index) {
      var href = $.router.href("categoryDetail", {
        categoryId: index
      });
      $('#categories').append(
        "<li><a href='" + href + "'>" + item + '</a></li>'
      );
    });
  };

  vm.categoryVM = function(route, param) {
    console.log(param);
    $('#categoryName').text(categories[param.categoryId]);

    $('#sub-categories').empty();
    subCategories[param.categoryId].forEach(function(item, index) {
      var href = $.router.href("subCategoryDetail", {
        categoryId: param.categoryId,
        subCategoryId: index
      });
      $('#sub-categories').append(
        "<li><a href='" + href + "'>" + item + '</a></li>'
      );
    });
  };

  vm.productVM = function(route, param) {
    console.log(param);
    $('#categoryName').text(categories[param.categoryId]);
    $('#subCategoryName').text(
      subCategories[param.categoryId][param.subCategoryId]
    );
    $('#btnBack').attr('href', '#/categories/' + param.categoryId);

    $('#products').empty();
    products[param.categoryId][param.subCategoryId].forEach(function(
      item,
      index
    ) {
      var href = $.router.href("productDetail", {
        categoryId: param.categoryId,
        subCategoryId: param.subCategoryId,
        productId: index
      });

      $('#products').append(
        "<li><a href='" + href + "'>" + item.name + '</a></li>'
      );
    });
  };

  vm.productDetailVM = function(route, param) {
    console.log(param);
    $('#categoryName').text(categories[param.categoryId]);
    $('#subCategoryName').text(
      subCategories[param.categoryId][param.subCategoryId]
    );
    $('#btnBack').attr(
      'href',
      '#/categories/' +
      param.categoryId +
      '/sub-categories/' +
      param.subCategoryId
    );

    var product =
      products[param.categoryId][param.subCategoryId][param.productId];

    $('#productName').text(product.name);
    $('#price').text(product.price);
    $('#rating').text(product.rating);
  };
})();