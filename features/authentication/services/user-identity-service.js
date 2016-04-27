kentonchunApp.factory('UserIdentityService', [function () {
  'use strict';
  return {
    //set currentUser as undefined until known
    currentUser: undefined,
    isAuthenticated: function () {
      return !!this.currentUser;
    },
    isAuthorized: function (role) {
      if(this.isAuthenticated()){
        return this.currentUser.role === role;
      }else{
        return false;
      }
    }
  };
}]);
