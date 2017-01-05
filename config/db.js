var platformsh = require("platformsh").config();

var db = {scheme: 'mongodb', username: 'main', password: 'main', host: '127.0.0.1', port: '30000', path: 'main'};
if (platformsh !== null) {
  db = platformsh.relationships.database[0];
}

module.exports = {
  mongodb : db['scheme'] + '://' + db["username"] +':' + db['password'] + "@" + db['host'] + ":" + db['port']+ '/' + db['path'],
};
