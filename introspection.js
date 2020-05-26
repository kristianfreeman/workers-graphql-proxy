import { buildClientSchema, parse } from 'graphql'
import { rawRequest } from 'graphql-request'

const INTROSPECTION = `
query IntrospectionQuery {
  __schema {
    queryType {
      name
      __typename
    }
    mutationType {
      name
      __typename
    }
    subscriptionType {
      name
      __typename
    }
    types {
      ...FullType
      __typename
    }
    directives {
      name
      description
      locations
      args {
        ...InputValue
        __typename
      }
      __typename
    }
    __typename
  }
}
fragment FullType on __Type {
  kind
  name
  description
  fields(includeDeprecated: true) {
    name
    description
    args {
      ...InputValue
      __typename
    }
    type {
      ...TypeRef
      __typename
    }
    isDeprecated
    deprecationReason
    __typename
  }
  inputFields {
    ...InputValue
    __typename
  }
  interfaces {
    ...TypeRef
    __typename
  }
  enumValues(includeDeprecated: true) {
    name
    description
    isDeprecated
    deprecationReason
    __typename
  }
  possibleTypes {
    ...TypeRef
    __typename
  }
  __typename
}
fragment InputValue on __InputValue {
  name
  description
  type {
    ...TypeRef
    __typename
  }
  defaultValue
  __typename
}
fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
}
`

export default async evt => {
  const storedSchemaData = await GRAPHQL_STORE.get('schema')
  if (storedSchemaData) {
    const storedSchema = JSON.parse(storedSchemaData)
    console.log('cached schema hit')
    return buildClientSchema(storedSchema)
  } else {
    const { data } = await rawRequest(ENDPOINT, INTROSPECTION)
    evt.waitUntil(GRAPHQL_STORE.put('schema', JSON.stringify(data), { expirationTtl: 60 }))
    return buildClientSchema(data)
  }
}
