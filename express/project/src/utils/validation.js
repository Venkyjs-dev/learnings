const validator = require("validator");
function validation(req) {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Please give valid names");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Enter valid Email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter strong password");
  }
}
module.exports = {
  validation,
};
