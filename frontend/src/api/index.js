

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
