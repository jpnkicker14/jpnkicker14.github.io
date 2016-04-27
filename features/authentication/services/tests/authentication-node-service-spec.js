describe('AuthenticationNodeService', function () {
  'use strict';

  var successResponse = {"status":"success",
    "data":{
      "authorizedRoles":[{"value":6,"code":"admin","name":"Admin","_id":"53c48d76756cc190c8e30cf7","__v":0,"id":"53c48d76756cc190c8e30cf7"}],
      "__v":0,
      "_id":"53c48d76756cc190c8e30e5d",
      "adcAuth":true,
      "archDbAuth":true,
      "deIdentified":false,
      "email":"admin@template.com",
      "first_name":"Admin",
      "last_name":"User",
      "provider":"local",
      "role":{"__v":0,"_id":"53c48d76756cc190c8e30cf7","name":"Admin","code":"admin","value":6},
      "tempPassword":false,
      "username":"admin",
      "lockoutCount":0,
      "hasDomain":false,
      "lockedOut":false,
      "full_name":"Admin User",
      "id":"53c48d76756cc190c8e30e5d"},
    "message":"Welcome Admin User",
    "error":null,
    "reqParams":null};

  var rootScope, successCallback, errorCallback;
  beforeEach(module('archdb'));

  beforeEach(inject(function(){
    successCallback = sinon.spy();
    errorCallback = sinon.spy();
  }));
//  beforeEach(inject(function ($httpBackend) {
//    $httpBackend.when('GET', SERVER + '/api/loggedInUser').respond({"status": "warning", "data": null, "message": "No Logged in User", "error": null, "reqParams": null});
//  }));

  describe('login', function () {
   it('should reject the promise if the server errors', inject(function($httpBackend, AuthenticationNodeService){
      $httpBackend.when('POST', SERVER + '/api/login').respond(500);
      AuthenticationNodeService.login({username:'admin', password:'password'}).then(successCallback, function(error){
        expect(_.isEqual(error, {status: 'error', message: 'Error: An error occurred while establishing a connection to the server.'})).toBe(true);
      });
      $httpBackend.flush();
      expect(successCallback.called).toBe(false);
    }));

    it('should reject the promise if the status is an error', inject(function($httpBackend, AuthenticationNodeService){
      $httpBackend.when('POST', SERVER + '/api/login').respond({status: 'error', data: null, message: 'error', error: {}});
      AuthenticationNodeService.login({username:'admin', password:'password'}).then(successCallback, function(error){
        expect(_.isEqual(error,{status: 'error', data: null, message: 'error', error:{}})).toBe(true);
      });
      $httpBackend.flush();
      expect(successCallback.called).toBe(false);
    }));

    it('should resolve the promise if the status is a success', inject(function($httpBackend, AuthenticationNodeService, UserIdentityService){
      //spyOn(UserIdentityService, 'currentUser');
      $httpBackend.when('POST', SERVER + '/api/login').respond(successResponse);
      AuthenticationNodeService.login({username:'admin', password:'password'}).then(function(success){
        expect(_.isEqual(success, successResponse)).toBe(true);
      }, errorCallback);
      $httpBackend.flush();
      expect(errorCallback.called).toBe(false);
      expect(_.isEqual(UserIdentityService.currentUser, successResponse.data)).toBe(true);
    }));
  });

  describe('logout', function () {
    it('should reject the promise if the server errors', inject(function($httpBackend, AuthenticationNodeService){
      $httpBackend.when('POST', SERVER + '/api/logout').respond(500);
      AuthenticationNodeService.logout().then(successCallback, function(error){
        expect(_.isEqual(error, {status: 'error', message: 'Error: An error occurred while establishing a connection to the server.'})).toBe(true);
      });
      $httpBackend.flush();
      expect(successCallback.called).toBe(false);
    }));

    it('should reject the promise if the status is an error', inject(function($httpBackend, AuthenticationNodeService){
      $httpBackend.when('POST', SERVER + '/api/logout').respond({status: 'error', data: null, message: 'error', error: {}});
      AuthenticationNodeService.logout().then(successCallback, function(error){
        expect(_.isEqual(error,{status: 'error', data: null, message: 'error', error:{}})).toBe(true);
      });
      $httpBackend.flush();
      expect(successCallback.called).toBe(false);
    }));

    it('should resolve the promise if the status is a success', inject(function($httpBackend, AuthenticationNodeService, UserIdentityService){
      //spyOn(UserIdentityService, 'currentUser');
      $httpBackend.when('POST', SERVER + '/api/logout').respond({"status":"success","data":"logout","message":"Goodbye","error":null,"reqParams":null});
      AuthenticationNodeService.logout().then(function(success){
        expect(_.isEqual(success, {"status":"success","data":"logout","message":"Goodbye","error":null,"reqParams":null})).toBe(true);
      }, errorCallback);
      $httpBackend.flush();
      expect(errorCallback.called).toBe(false);
      expect(UserIdentityService.currentUser).toBe(undefined);
    }));
  });

  describe('getLoggedInUser', function () {
    it('should reject the promise if the server errors', inject(function($httpBackend, AuthenticationNodeService){
      $httpBackend.when('GET', SERVER + '/api/loggedInUser').respond(500);
      AuthenticationNodeService.getLoggedInUser().then(successCallback, function(error){
        expect(_.isEqual(error, {status: 'error', message: 'Error: An error occurred while establishing a connection to the server.'})).toBe(true);
      });
      $httpBackend.flush();
      expect(successCallback.called).toBe(false);
    }));

    it('should reject the promise if the status is an error', inject(function($httpBackend, AuthenticationNodeService){
      $httpBackend.when('GET', SERVER + '/api/loggedInUser').respond({status: 'error', data: null, message: 'error', error: {}});
      AuthenticationNodeService.getLoggedInUser().then(successCallback, function(error){
        expect(_.isEqual(error,{status: 'error', data: null, message: 'error', error:{}})).toBe(true);
      });
      $httpBackend.flush();
      expect(successCallback.called).toBe(false);
    }));

    it('should resolve the promise if the status is a success', inject(function($httpBackend, AuthenticationNodeService, UserIdentityService){
      //spyOn(UserIdentityService, 'currentUser');
      $httpBackend.when('GET', SERVER + '/api/loggedInUser').respond(successResponse);
      AuthenticationNodeService.getLoggedInUser().then(function(success){
        expect(_.isEqual(success, successResponse)).toBe(true);
      }, errorCallback);
      $httpBackend.flush();
      expect(errorCallback.called).toBe(false);
      expect(_.isEqual(UserIdentityService.currentUser, successResponse.data)).toBe(true);
    }));
  });

  describe('authorizeCurrentUserForRoute', function () {
    it('should be authorized with current user set', inject(function($rootScope, UserIdentityService, AuthenticationNodeService){
      UserIdentityService.currentUser = successResponse.data;
      AuthenticationNodeService.authorizeCurrentUserForRoute('admin').then(
        function(success){
          expect(_.isEqual(success, {status: 'success', message: 'Authorized'})).toBe(true);
        },errorCallback);
      $rootScope.$apply();
      expect(errorCallback.called).toBe(false);
    }));

    it('should not be authorized with current user set', inject(function($rootScope, UserIdentityService, AuthenticationNodeService){
      UserIdentityService.currentUser = successResponse.data;
      //note only admin role is used for this test, normally admin would have all roles
      AuthenticationNodeService.authorizeCurrentUserForRoute('school').then(successCallback,
        function(error){
          expect(_.isEqual(error, {status: 'error', message: 'Not Authorized'})).toBe(true);
        });
      $rootScope.$apply();
      expect(successCallback.called).toBe(false);
    }));

    it('should be authorized with current user not set', inject(function($rootScope, $q, UserIdentityService, AuthenticationNodeService){
      spyOn(AuthenticationNodeService, 'getLoggedInUser').and.callFake(function(){
        var deferred = $q.defer();
        deferred.resolve(successResponse);
        return deferred.promise;
      });
      UserIdentityService.currentUser = undefined;
      //note only admin role is used for this test, normally admin would have all roles
      AuthenticationNodeService.authorizeCurrentUserForRoute('admin').then(
        function(success){
          expect(_.isEqual(success, {status: 'success', message: 'Authorized'})).toBe(true);
        },errorCallback);
      $rootScope.$apply();
      expect(successCallback.called).toBe(false);
    }));

    it('should reject the promise if getLoggedInUser is rejected', inject(function($rootScope, $q, UserIdentityService, AuthenticationNodeService){
      spyOn(AuthenticationNodeService, 'getLoggedInUser').and.callFake(function(){
        var deferred = $q.defer();
        deferred.reject({status:'error', message:'error'});
        return deferred.promise;
      });
      UserIdentityService.currentUser = undefined;
      //note only admin role is used for this test, normally admin would have all roles
      AuthenticationNodeService.authorizeCurrentUserForRoute('admin').then(successCallback,
        function(error){
          expect(_.isEqual(error, {status: 'error', message: 'error'})).toBe(true);
        });
      $rootScope.$apply();
      expect(successCallback.called).toBe(false);
    }));
  });

  describe('resetPassword', function () {
    it('should reject the promise if the server errors', inject(function($httpBackend, AuthenticationNodeService){
      $httpBackend.when('POST', SERVER + '/api/resetPassword').respond(500);
      AuthenticationNodeService.resetPassword({username:'admin'}).then(successCallback, function(error){
        expect(_.isEqual(error, {status: 'error', message: 'Error: An error occurred while establishing a connection to the server.'})).toBe(true);
      });
      $httpBackend.flush();
      expect(successCallback.called).toBe(false);
    }));

    it('should reject the promise if the status is an error', inject(function($httpBackend, AuthenticationNodeService){
      $httpBackend.when('POST', SERVER + '/api/resetPassword').respond({status: 'error', data: null, message: 'error', error: {}});
      AuthenticationNodeService.resetPassword({username:'admin'}).then(successCallback, function(error){
        expect(_.isEqual(error,{status: 'error', data: null, message: 'error', error:{}})).toBe(true);
      });
      $httpBackend.flush();
      expect(successCallback.called).toBe(false);
    }));

    it('should resolve the promise if the status is a success', inject(function($httpBackend, AuthenticationNodeService, UserIdentityService){
      //spyOn(UserIdentityService, 'currentUser');
      $httpBackend.when('POST', SERVER + '/api/resetPassword').respond({"status":"success","data":{"message":"Password has benn reset"},"message":"Password has been reset","error":null,"reqParams":null});
      AuthenticationNodeService.resetPassword({username:'admin'}).then(function(success){
        expect(_.isEqual(success, {"status":"success","data":{"message":"Password has benn reset"},"message":"Password has been reset","error":null,"reqParams":null})).toBe(true);
      }, errorCallback);
      $httpBackend.flush();
      expect(errorCallback.called).toBe(false);
      expect(UserIdentityService.currentUser).toBe(undefined);
    }));
  });

});