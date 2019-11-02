function ApiUrl(entityType, parameters) {
  /**
   * Base API URL for retrieving projects
   * @type {string}
   */
  this.baseURL = 'https://www.drupal.org/api-d7';

  this.entityType = entityType || '';
  this.parameters = parameters || [];
}

/**
 *
 * @returns {string}
 */
ApiUrl.prototype.getBaseUrl = function () {
  return this.baseURL;
};

/**
 *
 * @param type
 * @returns {ApiUrl}
 */
ApiUrl.prototype.setEntityEndpoint = function (type) {
  this.entityType = type;
  return this;
};

/**
 *
 * @param parameter
 * @param value
 * @returns {ApiUrl}
 */
ApiUrl.prototype.addParameter = function (parameter, value) {
  this.parameters.push(parameter + '=' + value);
  return this;
};
/**
 *
 * @returns {string}
 */
ApiUrl.prototype.getEndpointUrl = function () {
  var builderUrl = this.baseURL;
  builderUrl += '/' + this.entityType + '.json?';
  builderUrl += this.parameters.join('&');
  return builderUrl;
};
