const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateUrl = (value, helpers) => {
  console.log(value);
  if (validator.isURL(value)) {
    console.log('URL VALIDATION - success!!!');
    return value;
  }
  console.log('URL VALIDATION - fail!!!');
  return helpers.error('string.uri');
}
module.exports.validateCreateItemData = (req, res, next) => {
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30).messages({
        'string.min': "Name should be at least 2 characters long",
        'string.max': "Name should be no longer then 30 characters",
        'string.empty': "The 'Name' field is empty"
      }),
      imageUrl: Joi.string().required().custom(validateUrl).messages({
        'string.empty': "No imageUrl specified",
        'string.uri': "Invalid imageUrl specified"
      }),
      weather: Joi.string().required().messages({
        'string.required': "Weather field is required"
      })
    })
  })(req, res, next);
}

module.exports.validateCreateUserData = (req, res, next) => {
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30).messages({
        'string.min': "Name should be at least 2 characters long",
        'string.max': "Name should be no longer then 30 characters",
        'string.empty': "The 'Name' field is empty"
      }),
      avatar: Joi.string().required().custom(validateUrl).messages({
        'string.empty': "No avatar Url specified",
        'string.uri': "Invalid avatar Url specified"
      }),
      password: Joi.string().required().messages({
        'string.required': "Password field is required"
      }),
      email: Joi.string().required().email().messages({
        'string.email': "Email not valid"
      })
    })
  })(req, res, next);
}

module.exports.validateModifyUserData = (req, res, next) => {
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30).messages({
        'string.min': "Name should be at least 2 characters long",
        'string.max': "Name should be no longer then 30 characters",
        'string.empty': "The 'Name' field is empty"
      }),
      avatar: Joi.string().required().custom(validateUrl).messages({
        'string.empty': "No avatar Url specified",
        'string.uri': "Invalid avatar Url specified"
      })
    })
  })(req, res, next);
}



module.exports.validateLoginData = (req, res, next) => {
  celebrate({
    body: Joi.object().keys({
      password: Joi.string().required().messages({
        'string.required': "Password field is required"
      }),
      email: Joi.string().required().email().messages({
        'string.email': "Email not valid"
      })
    })
  })(req, res, next);
}

module.exports.validateId = (req, res, next) => {
  console.log(req.params);
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().hex().length(24).messages({
        'string.hex': "Wrong ID format",
        'string.length': "ID should be 24 characters long"
      })
    })
  })(req, res, next);
}