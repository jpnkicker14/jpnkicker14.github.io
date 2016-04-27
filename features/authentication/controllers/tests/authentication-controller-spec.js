describe('AuthenticationController', function () {
  'use strict';
  var scope, controller, location, toastrNotifierService, userIdentityService, authenticationNodeService;

  beforeEach(module('archdb'));

  beforeEach(inject(function ($httpBackend) {
    $httpBackend.when('GET', SERVER + '/api/loggedInUser').respond({"status": "warning", "data": null, "message": "No Logged in User", "error": null, "reqParams": null});
  }));

  beforeEach(inject(function ($controller, $rootScope, $location, UserIdentityService, ToastrNotifierService, AuthenticationNodeService) {
    scope = $rootScope.$new();
    controller = $controller;
    location = $location;
    toastrNotifierService = ToastrNotifierService;
    userIdentityService = UserIdentityService;
    authenticationNodeService = AuthenticationNodeService
  }));

  describe('login', function () {
    describe('checks', function () {
      it("should put up a notification if user scope is not set", inject(function () {
        spyOn(toastrNotifierService, 'notify');

        var localController = controller('AuthenticationController', {
          $scope: scope
        });
        scope.user = undefined;
        scope.login();
        scope.$apply();
        expect(toastrNotifierService.notify).toHaveBeenCalled();
      }));

      it("should put up a notification if username field is not set", inject(function () {
        spyOn(toastrNotifierService, 'notify');

        var localController = controller('AuthenticationController', {
          $scope: scope
        });
        scope.user = {username: null};
        scope.login();
        scope.$apply();
        expect(toastrNotifierService.notify).toHaveBeenCalled();
      }));

      it("should put up a notification if password field is not set", inject(function () {
        spyOn(toastrNotifierService, 'notify');

        var localController = controller('AuthenticationController', {
          $scope: scope
        });
        scope.user = {username: 'test', password: null};
        scope.login();
        scope.$apply();
        expect(toastrNotifierService.notify).toHaveBeenCalled();
      }));
    });

    it("should put up a notification login fails", inject(function ($q) {
      spyOn(toastrNotifierService, 'notify');
      spyOn(authenticationNodeService, 'login').and.callFake(function () {
        var deferred = $q.defer();
        deferred.reject({status: 'error', message: 'error'});
        return deferred.promise;
      });
      var localController = controller('AuthenticationController', {
        $scope: scope,
        AuthenticationNodeService: authenticationNodeService
      });

      scope.user = {username: 'test', password: 'password'};
      scope.login();
      scope.$apply();
      expect(scope.user.password).toBe('');
      expect(toastrNotifierService.notify).toHaveBeenCalledWith({ status: 'error', message: 'error' });
    }));

    it("should set the current user, notify of success and go to the home page if the login is successful", inject(function ($q) {
      var successResponse = {"status": "success",
        "data": {
          "authorizedRoles": [
            {"value": 6, "code": "admin", "name": "Admin", "_id": "53c48d76756cc190c8e30cf7", "__v": 0, "id": "53c48d76756cc190c8e30cf7"}
          ],
          "__v": 0,
          "_id": "53c48d76756cc190c8e30e5d",
          "adcAuth": true,
          "archDbAuth": true,
          "deIdentified": false,
          "email": "admin@template.com",
          "first_name": "Admin",
          "last_name": "User",
          "provider": "local",
          "role": {"__v": 0, "_id": "53c48d76756cc190c8e30cf7", "name": "Admin", "code": "admin", "value": 6},
          "tempPassword": false,
          "username": "admin",
          "lockoutCount": 0,
          "hasDomain": false,
          "lockedOut": false,
          "full_name": "Admin User",
          "id": "53c48d76756cc190c8e30e5d"},
        "message": "Welcome Admin User",
        "error": null,
        "reqParams": null};
      spyOn(toastrNotifierService, 'notify');
      spyOn(authenticationNodeService, 'login').and.callFake(function () {
        var deferred = $q.defer();
        deferred.resolve(successResponse);
        return deferred.promise;
      });
      var localController = controller('AuthenticationController', {
        $scope: scope,
        AuthenticationNodeService: authenticationNodeService,
        UserIdentityService: userIdentityService
      });

      scope.user = {username: 'test', password: 'password'};
      scope.login();
      scope.$apply();
      expect(toastrNotifierService.notify).toHaveBeenCalledWith(successResponse);
      expect(location.path()).toBe('/home');
    }));
  });

  describe("logout", function(){
    it("should put up a notification if logout fails", inject(function ($q) {
      spyOn(toastrNotifierService, 'notify');
      spyOn(authenticationNodeService, 'logout').and.callFake(function () {
        var deferred = $q.defer();
        deferred.reject({status: 'error', message: 'error'});
        return deferred.promise;
      });
      var localController = controller('AuthenticationController', {
        $scope: scope,
        AuthenticationNodeService: authenticationNodeService
      });

      scope.logout();
      scope.$apply();
      expect(toastrNotifierService.notify).toHaveBeenCalledWith({ status: 'error', message: 'error' });
    }));

    it("should remove current user, show notification, and reroute to / on success", inject(function ($q) {
      var successResponse ={"status":"success","data":"logout","message":"Goodbye","error":null,"reqParams":null};
      spyOn(toastrNotifierService, 'notify');
      spyOn(authenticationNodeService, 'logout').and.callFake(function () {
        var deferred = $q.defer();
        deferred.resolve(successResponse);
        return deferred.promise;
      });
      var localController = controller('AuthenticationController', {
        $scope: scope,
        AuthenticationNodeService: authenticationNodeService,
        UserIdentityService: userIdentityService
      });

      scope.logout();
      scope.$apply();
      expect(toastrNotifierService.notify).toHaveBeenCalledWith(successResponse);
      expect(location.path()).toBe('/');
    }));
  });

  describe('resetPassword', function(){
    it("should put up a notification if passwordReset fails", inject(function ($q) {
      spyOn(toastrNotifierService, 'notify');
      spyOn(authenticationNodeService, 'resetPassword').and.callFake(function () {
        var deferred = $q.defer();
        deferred.reject({status: 'error', message: 'error'});
        return deferred.promise;
      });
      var localController = controller('AuthenticationController', {
        $scope: scope,
        AuthenticationNodeService: authenticationNodeService
      });

      scope.resetPassword();
      scope.$apply();
      expect(toastrNotifierService.notify).toHaveBeenCalledWith({ status: 'error', message: 'error' });
    }));

    it("should show notification on success", inject(function ($q) {
      var successResponse = {"status":"success","data":{"message":"Password has benn reset"},"message":"Password has been reset","error":null,"reqParams":null};
      spyOn(toastrNotifierService, 'notify');
      spyOn(authenticationNodeService, 'resetPassword').and.callFake(function () {
        var deferred = $q.defer();
        deferred.resolve(successResponse);
        return deferred.promise;
      });
      var localController = controller('AuthenticationController', {
        $scope: scope,
        AuthenticationNodeService: authenticationNodeService,
        UserIdentityService: userIdentityService
      });

      scope.resetPassword();
      scope.$apply();
      expect(toastrNotifierService.notify).toHaveBeenCalledWith(successResponse);
    }));
  });
});