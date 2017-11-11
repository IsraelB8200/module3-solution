(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItems);

  function FoundItems() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
      controller: NarrowItDownDirectiveController,
      controllerAs: 'dirCtrl',
      bindToController: true,
      transclude: true
    };
    return ddo;
  }

  function NarrowItDownDirectiveController() {
    var dirCtrl = this;
  }
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var ctrl = this;
    ctrl.searchTerm ="";
    ctrl.foundItems = [];

    ctrl.MessageForUser = "";

    ctrl.narrowItDownForMe = function () {
      ctrl.foundItems = [];

      if (ctrl.searchTerm != undefined && ctrl.searchTerm != "") {
        MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
        .then(function (result) {
          if (result.length == 0) {
            ctrl.MessageForUser = "Nothing found";
          }
          else  {
            ctrl.MessageForUser = "";
            ctrl.foundItems = result;
          }
        });
      }
      else {
        ctrl.MessageForUser = "Nothing found";
      }
    };

    ctrl.removeItem = function (itemIndex) {
      ctrl.foundItems.splice(itemIndex, 1);
    };
  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function(searchTerm) {
      var foundItems = [];

      return $http({
        method: "GET",
        url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
      }).then(function (result) {

        for (var i = 0; i < result.data.menu_items.length; i++) {
          if (result.data.menu_items[i].description.indexOf(searchTerm) !== -1) {
            foundItems.push(result.data.menu_items[i]);
          }
        }

        return foundItems;
      });
    };
  }

})();
