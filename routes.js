var Contributor = require('./models/contributor');

module.exports = function(app) {
  app.get('/api/contributor/:uid?', function (req, res) {
    if (!req.params.uid) {
      Contributor.find(function (err, contributors) {
        return (err) ? res.send(err) : res.json(contributors);
      });
    } else {
      Contributor.findOne({'uid': req.params.uid}, function (err, contributor) {
        return (err) ? res.send(err) : res.json(contributor);
      });
    }
  });
  app.post('/api/contributor', function (req, res) {
    var contributor = new Contributor(req.body);
    contributor.save(function (err) {
      return (err) ? res.send(err) : res.send({success: true});
    });
  });

  // Fallback
  app.get('*', function(req, res) {
    res.sendfile(app.locals.docroot + '/index.html');
  });
};
