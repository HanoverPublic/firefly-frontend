'use strict';

angular.module('firefly.services', ['ngResource'])

.factory('FireflyResource', ['$resource', function($resource) {
    return function(url, params, methods) {
        var defaults = {
            update: {
                method: 'put',
                isArray: false
            },
            create: {
                method: 'post'
            }
        };

        methods = angular.extend(defaults, methods);

        var resource = $resource(url, params, methods);
        console.log(resource.prototype);
        resource.prototype.$save = function() {
            console.log('save', this.id);
            if (0 == 1) {
                return this.$create();
            } else {
                return this.$update();
            }
        };

        return resource;
    };
}])

.factory('FireflyFactory', ['$http',
        function($http) {
            var doErrorCallback = function(data, status, headers, config) {
                if (status == 401) {
                    location.href = '/firefly/index.cfm';
                } else {
                    console.error("Request Failed", data);
                }

            };

            return {
                get: function(event, params, callback) {
                    $http.get('/firefly/index.cfm?event=' + event, {
                            params: params
                        })
                        .success(callback)
                        .error(doErrorCallback);

                },
                post: function(event, params, callback) {
                    $http.post('/firefly/index.cfm?event=' + event, params)
                        .success(callback)
                        .error(doErrorCallback);
                },
                user: function(callback) {
                    this.get('general.user', {}, function(data) {
                        if (data.username === undefined) {
                            location.href = '/firefly/index.cfm';
                        } else {
                            callback(data);
                        }
                    });
                },
                icons: function(callback) {
                    $http.get('/firefly/app/common/scripts/icons.js')
                        .success(callback)
                        .error(doErrorCallback);
                }
            };
        }
    ])
    .factory('Lookup', ['LookupFactory',
        function(LookupFactory) {
            return {
                fields: {},
                init: function() {
                    this.lookups = LookupFactory.get({
                        fields: 'PMITYPE,PMIMETRIC,PMIFREQUENCY,STANDARDSSUBJECT'
                    });
                }
            };
        }
    ])
    .factory('LookupFactory', ['$resource',
        function($resource) {
            return $resource('/firefly/api/index.cfm/lookups');
        }
    ]);
