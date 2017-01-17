var platformsh = require("platformsh").config();

var db = {scheme: 'mongodb', username: 'main', password: 'main', host: 'localhost', port: '27017', path: 'contribkanban'};
if (platformsh !== null) {
  db = platformsh.relationships.database[0];
}

module.exports = {
  mongodb : db['scheme'] + '://' + db["username"] +':' + db['password'] + "@" + db['host'] + ":" + db['port']+ '/' + db['path'],
};
