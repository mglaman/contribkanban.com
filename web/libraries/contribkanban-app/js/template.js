function Template() {}
Template.prototype.inject = function(string, context) {
  var _values = context || {};
  return string.replace(/{{\s*([^}]*)\s*}}/g, function(k, v) {
    return _values[v.trim()];
  });
};
Template.prototype.format = function(template, context) {
  template = this.inject(template, context);
  return template;
};
