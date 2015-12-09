var platformsh = require("platformsh").config();

var db = {scheme: 'mongodb', username: '', password: '', host: '192.168.99.100', port: '27017', path: 'contribkanban'};
if (platformsh !== null) {
  db = platformsh.relationships.database[0];
}

module.exports = {
  prod : db['scheme'] + '://' + db["username"] +':' + db['password'] + "@" + db['host'] + ":" + db['port']+ '/' + db['path'],
  local : db['scheme'] + '://' + db['host']+ ":" + db['port']+ '/' + db['path']
};
