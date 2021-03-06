module.exports = function(app) {
  app.factory('mixAuth', ['$http', '$window', function($http, $window) {
    var token;
    var user;
    var auth = {
      createUser: function(userNew, cb) {
        cb = cb || function(){};
        $http({
          method: 'POST',
          url: 'http://localhost:3050/api/signup',
          data: userNew
        }).then(function(res) {
            token = $window.localStorage.token = res.data.token;
            cb(null);
          }, function(res) {
            cb(res.err);
          });
      },
      signIn: function(user, cb) {
        cb = cb || function(){};
        $http({
          method: 'POST',
          url: 'http://localhost:3050/api/signin',
          headers: {
            'Authorization': 'Basic ' + btoa((user.email + ':' + user.password))
          }
        })
          .then(function(res) {
            token = $window.localStorage.token = res.data.token;
            cb(null);
          }, function(res) {
            cb(res);
          });
      },
      getToken: function() {
        token = token || $window.localStorage.token;
        return token;
      },
      signOut: function(cb) {
        $window.localStorage.token = null;
        token = null;
        user = null;
        if (cb) cb();
      },
      getUsername: function(cb) {
        cb = cb || function(){};
        $http({
          method: 'GET',
          url: 'http://localhost:3050/api/currentuser',
          headers: {
            token: auth.getToken()
          }
        })
        .then(function(res) {
          user = res.data.user;
          cb(res);
        },function(res) {
          cb(res);
        });
      },
      username: function() {
        if (!user) auth.getUsername();
        return user;
      }
    };
    return auth;
  }]);
};
