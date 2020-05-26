import { parse, validate } from 'graphql'
import { rawRequest } from 'graphql-request'

import introspection from './introspection'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

const handleGraphQLRequest = async event => {
  const { request } = event
  try {
    const { query, variables } = await request.json()
    const schema = await introspection(event)

    const queryDocument = parse(query)

    const cacheKey = await digestMessage(JSON.stringify(queryDocument));
    const cachedQueryData = await GRAPHQL_STORE.get(cacheKey)
    if (cachedQueryData) {
      console.log('cached query')
      return new Response(cachedQueryData, {headers: { 'content-type': 'application/json' }})
    }

    const errors = validate(schema, queryDocument)

    if (errors.length) {
      return new Response(JSON.stringify({ errors }), { status: 500 })
    }

    const result = await rawRequest(ENDPOINT, query, variables)
    event.waitUntil(GRAPHQL_STORE.put(cacheKey, JSON.stringify(result), { expirationTtl: 60 }))
    return new Response(JSON.stringify(result), {headers: { 'content-type': 'application/json' }})
  } catch (err) {
    console.log(err.message)
    return new Response("Error", { status: 500 })
  }
}

async function handleRequest(event) {
  const url = new URL(event.request.url)

  if (url.pathname === "/graphql") {
    return handleGraphQLRequest(event)
  } else {
    return new Response(":)", { status: 200 })
  }
}
