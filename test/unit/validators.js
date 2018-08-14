var assert = require('assert');
var validators = require('../../src/validators');

describe('validators', function() {
  it('should fail for invalid message types', function() {
    assert.equal(validators.isValidMessage(), false);
    assert.equal(validators.isValidMessage({}), false);
    assert.equal(validators.isValidMessage({ type: 'FAKE_ACTION' }), false);
  });
  
  describe('create company', function() {
    it('should require displayName', function() {
      assert.equal(validators.isValidMessage({ type: 'CREATE_COMPANY' }), false);
      assert.equal(validators.isValidMessage({ type: 'CREATE_COMPANY', displayName: 'Guy P' }), true);
    });
  });

  describe('update company', function() {
    it('should require name, displayName', function() {
      assert.equal(validators.isValidMessage({ type: 'UPDATE_COMPANY' }), false);
      assert.equal(validators.isValidMessage({ type: 'UPDATE_COMPANY', displayName: 'Guy P' }), false);
      assert.equal(validators.isValidMessage({
        type: 'UPDATE_COMPANY',
        name: 'guy p',
        displayName: 'New name'
      }), true);
    });
  });

  describe('create workspace', function() {
    it('should require copmanyName, displayName', function() {
      assert.equal(validators.isValidMessage({ type: 'CREATE_WORKSPACE' }), false);
      assert.equal(validators.isValidMessage({
        type: 'CREATE_WORKSPACE',
        displayName: 'Workspace 1'
      }), false);
      assert.equal(validators.isValidMessage({
        type: 'CREATE_WORKSPACE',
        companyName: 'guy p',
        displayName: 'Workspace 1'
      }), true);
    });
  });

  describe('update workspace', function() {
    it('should require copmanyName, name, displayName', function() {
      assert.equal(validators.isValidMessage({ type: 'UPDATE_WORKSPACE' }), false);
      assert.equal(validators.isValidMessage({
        type: 'UPDATE_WORKSPACE',
        companyName: 'guy p',
        displayName: 'Workspace 1'
      }), false);
      assert.equal(validators.isValidMessage({
        type: 'UPDATE_WORKSPACE',
        companyName: 'guy p',
        name: 'workspace 1',
        displayName: 'Workspace 1'
      }), true);
    });
  });

  describe('associate user', function() {
    it('should require copmanyName, workspaceName, valid email and valid role', function() {
      assert.equal(validators.isValidMessage({ type: 'ASSOCIATE_USER' }), false);
      assert.equal(validators.isValidMessage({
        type: 'ASSOCIATE_USER',
        companyName: 'guy p',
        workspaceName: 'workspace'
      }), false);
      assert.equal(validators.isValidMessage({
        type: 'ASSOCIATE_USER',
        companyName: 'guy p',
        workspaceName: 'workspace',
        email: 'invalid',
        role: 'admin'
      }), false);
      assert.equal(validators.isValidMessage({
        type: 'ASSOCIATE_USER',
        companyName: 'guy p',
        workspaceName: 'workspace',
        email: 'test@test.com',
        role: 'nope'
      }), false);
      assert.equal(validators.isValidMessage({
        type: 'ASSOCIATE_USER',
        companyName: 'guy p',
        workspaceName: 'workspace',
        email: 'test@test.com',
        role: 'admin'
      }), true);
    });
  });

  describe('remove user', function() {
    it('should require copmanyName, workspaceName, valid email', function() {
      assert.equal(validators.isValidMessage({ type: 'REMOVE_USER' }), false);
      assert.equal(validators.isValidMessage({
        type: 'REMOVE_USER',
        companyName: 'guy p',
        workspaceName: 'workspace'
      }), false);
      assert.equal(validators.isValidMessage({
        type: 'REMOVE_USER',
        companyName: 'guy p',
        workspaceName: 'workspace',
        email: 'invalid.com'
      }), false);
      assert.equal(validators.isValidMessage({
        type: 'REMOVE_USER',
        companyName: 'guy p',
        workspaceName: 'workspace',
        email: 'test@test.org'
      }), true);
    });
  });
});
