# Running the imported shop API

This is an educational Node.js/Express microservices API, not a web storefront.
Keep the existing gateway, product-service, and order-service structure.

## Run on Replit

- Click **Run** to start the `Shop API` workflow, or run `npm start`.
- `start-services.js` starts product-service on 3000, order-service on 3001,
  and the public gateway on 5000. It stops the other services if one exits.
- The preview root returns the gateway's JSON status and route list.
- Only the gateway (port 5000) should be exposed publicly.
- Root dependencies are installed with `npm ci`; Node resolves these for all
  three service directories. Their original package manifests remain usable
  for the standalone setup described in README.md.

## Check the API

- `npm test` runs the original smoke test against the gateway on port 5000.
  It creates an order and reduces stock; it is not a read-only test.
- Service routes require the `X-API-Key` header. The existing educational
  default is documented in README.md; no extra secrets or services are needed
  for this local lab.
- To use a custom key, set `API_KEY` through Replit Secrets and restart.
  Do not use the public lab default for a real deployment.
- `GET /product-service/products` lists products.
- `POST /order-service/orders` accepts `{"productId":1,"qty":2}`.
- `GET /order-service/orders` lists orders.

All data remains in memory as specified by the lab and resets on restart.
No database or third-party integration is required.
