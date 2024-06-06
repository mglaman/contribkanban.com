export function getApiBaseUrl() {
  console.log(process.env)
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  if (process.env.REACT_APP_LAGOON_BRANCH === "master") {
    return "https://api.contribkanban.com";
  }
  if (process.env.REACT_APP_LAGOON_ENVIRONMENT) {
    return `https://nginx.${process.env.REACT_APP_LAGOON_ENVIRONMENT}.${process.env.REACT_APP_LAGOON_PROJECT}.us2.amazee.io`;
  }
  if (
    !process.env.REACT_APP_LAGOON_BRANCH ||
    process.env.REACT_APP_LAGOON_BRANCH === ""
  ) {
    return "https://contribkanban.com.ddev.sit1111e";
  }
}

/**
 *
 * @param {RequestInfo} resource
 * @param {RequestInit} opts
 *
 * @returns {Promise<Response>}
 */
export async function apiFetch(resource, opts) {
  if (resource.substr(0, 1) === "/") {
    resource = `${getApiBaseUrl()}/jsonapi${resource}`;
  }
  const request = new Request(resource, opts);
  request.headers.set("Accept", "application/vnd.api+json");
  if (opts && (opts.method === "POST" || opts.method === "PATCH")) {
    request.headers.set("Content-Type", "application/vnd.api+json");
  }
  const res = await fetch(request);

  return res;
}

/**
 *
 * @param {RequestInfo} resource
 * @param {RequestInit} opts
 *
 * @returns {Promise<Response>}
 */
export async function legacyApiFetch(resource, opts) {
  const request = new Request(`${getApiBaseUrl()}${resource}`, opts);
  request.headers.set("Accept", "application/json");
  const res = await fetch(request);

  return res;
}

/**
 *
 * @param {RequestInfo} resource
 *
 * @returns {Promise<Response>}
 */
export async function drupalApiFetch(resource) {
  const request = new Request(`https://www.drupal.org/api-d7${resource}`);
  request.headers.set("Accept", "application/json");
  const res = await fetch(request);
  return res;
}

export const getMappedIncludes = (document) =>
  document.included
    ? document.included.reduce((accumulator, include) => {
        accumulator[include.type] = accumulator[include.type] || {};
        accumulator[include.type][include.id] = include;
        return accumulator;
      }, {})
    : {};

export const getRelationshipFromMappedIncludes = (
  document,
  field,
  mappedIncludes
) =>
  document.relationships[field].data.map((relationship) => {
    return mappedIncludes[relationship.type][relationship.id];
  });
