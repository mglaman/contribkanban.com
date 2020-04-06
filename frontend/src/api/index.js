export function getApiHostname() {
  console.log(process.env)
  if (process.env.REACT_APP_API_HOSTNAME) {
    return process.env.REACT_APP_API_HOSTNAME
  }
  if (process.env.REACT_APP_LAGOON_BRANCH === "") {
    return 'nginx.contribkanban-app.docker.amazee.io'
  }
  if (process.env.REACT_APP_LAGOON_BRANCH === 'master') {
    // @todo api.contribkanban.com
    return 'contribkanban.com'
  }
  return `nginx-${process.env.REACT_APP_LAGOON_PROJECT}-${process.env.REACT_APP_LAGOON_BRANCH}.us.amazee.io`
}



export const getMappedIncludes = document =>
  document.included
    ? document.included.reduce((accumulator, include) => {
        accumulator[include.type] = accumulator[include.type] || {}
        accumulator[include.type][include.id] = include
        return accumulator
      }, {})
    : {}

export const getRelationshipFromMappedIncludes = (document, field, mappedIncludes) =>
  document.relationships[field].data.map(relationship => {
    return mappedIncludes[relationship.type][relationship.id]
  })
