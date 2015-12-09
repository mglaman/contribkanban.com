var platformsh = require("platformsh").config();

module.exports = {
  prod : 'mongodb://'+ db["username"]+':' + db['password']+ "@" + db['host']+ ":" + db['port']+ '/' + db['path'],
  local : 'mongodb://192.168.99.100/contribkanban',
};
