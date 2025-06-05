const { v4: uuidv4 } = require('uuid');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = { uuidv4, sleep };
