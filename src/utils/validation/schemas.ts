import Joi from "@hapi/joi";

const registrationSchema = Joi.object({
  firstName: Joi.string().pattern(new RegExp("^[a-zA-z]{2,30}$")).required(),
  lastName: Joi.string().pattern(new RegExp("^[a-zA-Z]{2,30}$")).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "org", "edu"] }
    })
    .required(),
  password: Joi.string().min(5).required(),
  confirmedPassword: Joi.ref("password")
});

export default registrationSchema;
