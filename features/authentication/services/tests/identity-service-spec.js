describe('UserIdentityService', function () {
  'use strict';
  beforeEach(module('archdb'));
  var user = {
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
    "id": "53c48d76756cc190c8e30e5d"};

  describe('isAuthenticated', function(){
    it('should return false without any user', inject(function (UserIdentityService) {
      expect(UserIdentityService.isAuthenticated()).toBe(false);
    }));

    it('should return true when a user exist', inject(function (UserIdentityService) {
      UserIdentityService.currentUser = user;
      expect(UserIdentityService.isAuthenticated()).toBe(true);
    }));
  });

  describe('isAuthorized', function(){
    it('should return false without a user', inject(function (UserIdentityService) {
      expect(UserIdentityService.isAuthorized('admin')).toBe(false);
    }));

    it('should return false when the role does not exist', inject(function (UserIdentityService) {
      UserIdentityService.currentUser = user;
      //note that normally an admin will have all roles in user object
      expect(UserIdentityService.isAuthorized('school')).toBe(false);
    }));

    it('should return true when the role does exist', inject(function (UserIdentityService) {
      UserIdentityService.currentUser = user;
      expect(UserIdentityService.isAuthorized('admin')).toBe(true);
    }));
  });

  describe('requiresPasswordChange', function(){
    it('should return true user tempPassword is true', inject(function (UserIdentityService) {
      user.tempPassword = true;
      UserIdentityService.currentUser = user;
      expect(UserIdentityService.requiresPasswordChange()).toBe(true);
    }));

    it('should return false user tempPassword is false', inject(function (UserIdentityService) {
      user.tempPassword = false;
      UserIdentityService.currentUser = user;
      expect(UserIdentityService.requiresPasswordChange()).toBe(false);
    }));
  });

});
