const rescuerSchema = {
  firstName: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    exists: true
  },
  lastName: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    exists: true
  },
  unit: {
    in: ['body'],
    isString: true,
    exists: false
  },
  commanderFirstName: {
    in: ['body'],
    isString: true,
    exists: false
  },
  commanderLastName: {
    in: ['body'],
    isString: true,
    exists: false
  },
  location: {
    in: ['body'],
    isString: true,
    exists: false
  },
  IN: {
    in: ['body'],
    isInt: { options: { min: 0, max: 1000 } },
    exists: true
  }
};

module.exports = rescuerSchema