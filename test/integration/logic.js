var assert = require('assert');
var mongoose = require('mongoose');
var Company = require('../../src/models/Company');
var logic = require('../../src/logic');

describe.only('logic', function() {
  before(function(done) {
    mongoose.connect('mongodb://localhost/test_business');
    mongoose.connection.once('open', done);
  });

  after(function() {
    mongoose.connection.close();
  });

  describe('create company', function() {
    before(function(done) {
      Company.remove().exec(done);
    });

    it('should create a company', function(done) {
      logic.processMessage({ type: 'CREATE_COMPANY', displayName: 'Guy' }, function() {
        Company.count({ name: 'guy' }, function(err, count) {
          assert.equal(count, 1);
          done();
        });
      });
    });

    it('should not allow creating multiple companies with same name', function(done) {
      logic.processMessage({ type: 'CREATE_COMPANY', displayName: 'guy' }, function() {
        Company.count({}, function(err, count) {
          assert.equal(count, 1);
          done();
        });
      });
    });
  });

  describe('update company', function() {
    before(function(done) {
      Company.remove().exec(done);
    });

    it('should update a company', function(done) {
      logic.processMessage({ type: 'CREATE_COMPANY', displayName: 'Guy' }, function() {
        logic.processMessage({ type: 'UPDATE_COMPANY', name: 'guy', displayName: 'Another Name' }, function() {
          Company.findOne({ name: 'guy' }, function(err, company) {
            assert.equal(company.displayName, 'Another Name');
            done();
          });
        });
      });
    });
  });

  describe('create workspace', function() {
    before(function(done) {
      Company.remove().exec(done);
    });

    it('should create a workspace', function(done) {
      logic.processMessage({ type: 'CREATE_COMPANY', displayName: 'Test Company' }, function() {
        logic.processMessage({ type: 'CREATE_WORKSPACE', companyName: 'test company', displayName: 'Guy' }, function() {
          Company.findOne({ name: 'test company' }, function(err, company) {
            assert.equal(company.displayName, 'Test Company');
            assert.equal(company.workspaces.length, 1);
            assert.equal(company.workspaces[0].displayName, 'Guy');
            assert.equal(company.workspaces[0].name, 'guy');
            done();
          });
        });
      });
    });

    it('should create another workspace', function(done) {
      logic.processMessage({ type: 'CREATE_WORKSPACE', companyName: 'test company', displayName: 'Guy 2' }, function() {
        Company.findOne({ name: 'test company' }, function(err, company) {
          assert.equal(company.workspaces.length, 2);
          done();
        });
      });
    });

    it('should not allow creating multiple workspaces with the same name on the same company', function(done) {
      logic.processMessage({ type: 'CREATE_WORKSPACE', companyName: 'test company', displayName: 'guy' }, function() {
        Company.findOne({ name: 'test company' }, function(err, company) {
          assert.equal(company.workspaces.length, 2);
          done();
        });
      });
    });

    it('should allow creating multiple workspaces with the same name on different companies', function(done) {
      logic.processMessage({ type: 'CREATE_COMPANY', displayName: 'different' }, function() {
        logic.processMessage({ type: 'CREATE_WORKSPACE', companyName: 'different', displayName: 'guy' }, function() {
          Company.findOne({ name: 'different' }, function(err, company) {
            assert.equal(company.workspaces.length, 1);
            done();
          });
        });
      });
    });
  });

  describe('assign user to workspace', function() {
    before(function(done) {
      Company.remove().exec(done);
    });

    it('should associate a user to workspace', function(done) {
      logic.processMessage({ type: 'CREATE_COMPANY', displayName: 'Test Company' }, function() {
        logic.processMessage({ type: 'CREATE_WORKSPACE', companyName: 'test company', displayName: 'Guy' }, function() {
          logic.processMessage({
            type: 'ASSOCIATE_USER',
            companyName: 'test company',
            workspaceName: 'guy',
            role: 'admin',
            email: 'guy@test.com'
          }, function() {
            Company.findOne({ name: 'test company' }, function(err, company) {
              assert.equal(company.displayName, 'Test Company');
              assert.equal(company.workspaces[0].users.length, 1);
              assert.equal(company.workspaces[0].users[0].role, 'admin');
              assert.equal(company.workspaces[0].users[0].email, 'guy@test.com');
              done();
            });
          });
        });
      });
    });

    it('should associate another user', function(done) {
      logic.processMessage({
        type: 'ASSOCIATE_USER',
        companyName: 'test company',
        workspaceName: 'guy',
        role: 'basic',
        email: 'guy2@testing.org'
      }, function() {
        Company.findOne({ name: 'test company' }, function(err, company) {
          assert.equal(company.displayName, 'Test Company');
          assert.equal(company.workspaces[0].users.length, 2);
          done();
        });
      });
    });

    it('should not allow associating multiple users with the same email to the same workspace', function(done) {
      logic.processMessage({
        type: 'ASSOCIATE_USER',
        companyName: 'test company',
        workspaceName: 'guy',
        role: 'admin',
        email: 'guy2@testing.org'
      }, function() {
        Company.findOne({ name: 'test company' }, function(err, company) {
          assert.equal(company.displayName, 'Test Company');
          assert.equal(company.workspaces[0].users.length, 2);
          done();
        });
      });
    });

    it('should allow associating multiple users with the same email to the different workspaces', function(done) {
      logic.processMessage({ type: 'CREATE_WORKSPACE', companyName: 'test company', displayName: 'a workspace' }, function() {
        logic.processMessage({
          type: 'ASSOCIATE_USER',
          companyName: 'test company',
          workspaceName: 'a workspace',
          role: 'admin',
          email: 'guy2@testing.org'
        }, function() {
          Company.findOne({ name: 'test company' }, function(err, company) {
            assert.equal(company.displayName, 'Test Company');
            assert.equal(company.workspaces[1].users.length, 1);
            done();
          });
        });
      });
    });
  });
});
