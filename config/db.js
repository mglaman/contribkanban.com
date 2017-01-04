var platformsh = require("platformsh").config();

var db = {scheme: 'mongodb', username: 'main', password: 'main', host: 'localhost', port: '30000', path: 'main'};
if (platformsh !== null) {
  db = platformsh.relationships.database[0];
}

module.exports = {
  prod : db['scheme'] + '://' + db["username"] +':' + db['password'] + "@" + db['host'] + ":" + db['port']+ '/' + db['path'],
  local : db['scheme'] + '://' + db['host']+ ":" + db['port']+ '/' + db['path']
};
