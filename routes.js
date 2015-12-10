var Contributor = require('./models/contributor');
var Project = require('./models/project');
var Sprint = require('./models/sprint');

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
  app.get('/api/projects', function (req, res) {
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

  // Drupal.org issue tags
  app.get('/api/sprint/:machineName', function (req, res) {
    Sprint.findOne({'machine_name': req.params.machineName}, function (err, sprint) {
      return (err) ? res.send(err) : res.json(sprint);
    });
  });
  app.get('/api/sprint/exists/:tid', function (req, res) {
    Sprint.findOne({'tid': req.params.tid}, function (err, sprint) {
      return (err) ? res.send(err) : res.json(sprint);
    });
  });
  app.get('/api/sprints', function (req, res) {
    Sprint.find({}, function (err, sprints) {
      return (err) ? res.send(err) : res.json(sprints);
    });
  });
  app.post('/api/sprint', function (req, res) {
    var sprint = new Sprint(req.body);
    sprint.save(function (err) {
      return (err) ? res.send(err) : res.send({success: true});
    });
  });

  // Check for and return board configurations.
  app.get('/api/board/:type/:id', function (req, res) {
    var config;
    try {
      config = require('./config/boards/' + req.params.type + '/' + req.params.id + '.json');
    } catch (err) {
      config = require('./config/boards/project-default.json');
    }

    return res.send(config);
  });

  // Fallback
  app.get('*', function(req, res) {
    res.sendfile(app.locals.docroot + '/index.html');
  });
};
