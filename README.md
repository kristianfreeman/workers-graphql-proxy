# workers-graphql-proxy

[![Deploy to Cloudflare Workers](https://deploy-to-cf-workers.signalnerve.workers.dev/button)](https://deploy-to-cf-workers.signalnerve.workers.dev/button?url=https://github.com/signalnerve/workers-graphql-proxy)

A Cloudflare Workers application for proxying GraphQL requests to a known origin, along with some goodies:

- Simple URL-based routing to your GraphQL server
- Schema caching at the edge
- Schema validation for incoming queries
- Query/response caching at the edge using Workers KV (this is super experimental and not recommended for production data)

workers-graphql-proxy has been designed for usage with Hasura GraphQL Engine - check out my upcoming talk at HasuraCon 2020 to learn more about the project!

## Deployment

_Coming soon_

## License

MIT
