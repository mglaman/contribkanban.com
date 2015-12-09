var platformsh = require("platformsh").config();
var db = platformsh.relationships.database[0]

module.exports = {
  prod : db['scheme'] + '://'+ db["username"]+':' + db['password']+ "@" + db['host']+ ":" + db['port']+ '/' + db['path'],
  local : 'mongodb://192.168.99.100/contribkanban'
};
