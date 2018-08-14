var Joi = require('joi');

var schemas = {
  'CREATE_COMPANY': Joi.object().keys({
    displayName: Joi.string().required()
  }),
  'UPDATE_COMPANY': Joi.object().keys({
    name: Joi.string().required(),
    displayName: Joi.string().required()
  }),
  'CREATE_WORKSPACE': Joi.object().keys({
    companyName: Joi.string().required(),
    displayName: Joi.string().required()
  }),
  'UPDATE_WORKSPACE': Joi.object().keys({
    companyName: Joi.string().required(),
    name: Joi.string().required(),
    displayName: Joi.string().required()
  }),
  'ASSOCIATE_USER': Joi.object().keys({
    companyName: Joi.string().required(),
    workspaceName: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    role: Joi.string().valid(['basic', 'admin']).required()
  }),
  'REMOVE_USER': Joi.object().keys({
    companyName: Joi.string().required(),
    workspaceName: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required()
  })
};

module.exports.isValidMessage = function(req) {
  if (!req || !schemas[req.type]) {
    console.error('Invalid request: ', req);
    return false;
  }

  var validation = Joi.validate(req, schemas[req.type], { stripUnknown: true });

  if (validation.error) {
    console.error('Invalid request: ', req, validation.error);
    return false;
  }

  return true;
};
