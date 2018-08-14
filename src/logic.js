var Company = require('./models/Company');

module.exports.processMessage = function(message, callback) {
  switch (message.type) {
  case 'CREATE_COMPANY':
    createCompany(message, callback);
    return;
  case 'UPDATE_COMPANY':
    updateCompany(message, callback);
    return;
  case 'CREATE_WORKSPACE':
    createWorkspace(message, callback);
    return;
  case 'UPDATE_WORKSPACE':
    updateWorkspace(message, callback);
    return;
  case 'ASSOCIATE_USER':
    associateUser(message, callback);
    return;
  case 'REMOVE_USER':
    removeUser(message, callback);
    return;
  }
};

function createCompany(message, callback) {
  message.name = message.displayName.toLowerCase();
  var company = new Company(message);

  company.save(function(err) {
    if (err) {
      console.error('Failed creating company: ', err);
      callback && callback(err);
      return;
    }

    console.log('Company created successfully');
    callback && callback();
  });
}

function updateCompany(message, callback) {
  Company.findOneAndUpdate({
    name: message.name
  }, {
    displayName: message.displayName
  }, function(err) {
    if (err) {
      console.error('Failed updating company: ', err);
      callback && callback(err);
      return;
    }

    console.log('Company updated successfully');
    callback && callback();
  });
}

function createWorkspace(message, callback) {
  message.name = message.displayName.toLowerCase();

  Company.update({
    name: message.companyName,
    'workspaces.name': {
      $ne: message.name
    }
  }, {
    $push: {
      workspaces: message
    }
  }, function(err, company) {
    if (err) {
      console.error('Failed creating workspace: ', err);
      callback && callback(err);
      return;
    }

    if (!company.nModified) {
      console.log('Company not found or workspace already exists');
      callback && callback();
      return;
    }

    console.log('Workspace created successfully');
    callback && callback();
  });
}

function updateWorkspace(message, callback) {
  Company.update({
    name: message.companyName,
    'workspaces.name': message.name
  }, {
    'workspaces.$.displayName': message.displayName
  }, function(err, company) {
    if (err) {
      console.error('Failed updating workspace: ', err);
      callback && callback(err);
      return;
    }

    if (!company.n) {
      console.log('Company workspace not found');
      callback && callback();
      return;
    }

    console.log('Workspace updated successfully');
    callback && callback();
  });
}

function associateUser(message, callback) {
  Company.update({
    name: message.companyName,
    workspaces: {
      $elemMatch: {
        name: message.workspaceName,
        'users.email': { $ne: message.email }
      } 
    }
  }, {
    $push: {
      'workspaces.$[w].users': message
    }
  }, {
    arrayFilters: [{
      'w.name': message.workspaceName
    }]
  }, function(err, company) {
    if (err) {
      console.error('Failed associating user to workspace: ', err);
      callback && callback(err);
      return;
    }

    if (!company.n || !company.nModified) {
      console.log('Workspace not found or email already exists');
      callback && callback();
      return;
    }

    console.log('User associated to workspace successfully');
    callback && callback();
  });
}

function removeUser(message, callback) {
  Company.update({
    name: message.companyName,
    'workspaces.name': message.workspaceName
  }, {
    $pull: {
      'workspaces.$.users': {
        email: message.email
      }
    }
  }, function(err, company) {
    if (err) {
      console.error('Failed removing user from workspace: ', err);
      callback && callback(err);
      return;
    }

    if (!company.n || !company.nModified) {
      console.log('User not found in workspace');
      callback && callback();
      return;
    }

    console.log('User removed from workspace successfully');
    callback && callback();
  });
}