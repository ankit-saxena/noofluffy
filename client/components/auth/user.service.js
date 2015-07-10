'use strict';

angular.module('workspaceApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });


angular.module('workspaceApp')
  .factory('Thing', function ($resource) {
    return $resource('/api/things/:id/:controller', {
      id: '@_id',
      controller :'@_controller'
    },
    {
      
      get: {
        method: 'GET'
      
      }
	  });
  });