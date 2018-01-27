export default class ApiUrl {
  baseURL = 'https://www.drupal.org/api-d7';
  constructor(entityType, parameters) {
    this.entityType = entityType || '';
    this.parameters = parameters || [];
  }
  getBaseUrl() {
    return this.baseURL
  }
  setEntityEndpoint(type) {
    this.entityType = type;
  }
  addParameter(parameter, value) {
    this.parameters.push(parameter + '=' + value);
    return this;
  }
  getEndpointUrl() {
    let builderUrl = this.baseURL;
    builderUrl += '/' + this.entityType + '.json?';
    builderUrl += this.parameters.join('&');
    return builderUrl;
  }
}
