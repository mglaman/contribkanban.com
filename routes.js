var Contributor = require('./models/contributor');
var Project = require('./models/project');

module.exports = function(app) {
  // Drupal.org User cached data.
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

  // Drupal.org Node project_* data
  app.get('/api/project/:machineName', function (req, res) {
    Project.findOne({'machine_name': req.params.machineName}, function (err, project) {
      return (err) ? res.send(err) : res.json(project);
    });
  });
  app.get('/api/project/type/:type', function (req, res) {
    Project.find({'projectType': req.params.type}, function (err, projects) {
      return (err) ? res.send(err) : res.json(projects);
    });
  });
  app.get('/api/project/all', function (req, res) {
    Project.find({}, function (err, projects) {
      return (err) ? res.send(err) : res.json(projects);
    });
  });
  app.post('/api/project', function (req, res) {
    var project = new Project(req.body);
    project.save(function (err) {
      return (err) ? res.send(err) : res.send({success: true});
    });
  });

  // Fallback
  app.get('*', function(req, res) {
    res.sendfile(app.locals.docroot + '/index.html');
  });
};
