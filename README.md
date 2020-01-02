# api-cache-proxy

product for providing proxy and offer to back post api

## configration
```
resources:
- prefix: ${proxy prefix}
  upstream: http://${back post api url}
  expireSec: 2
  timeoutMs: 3000
  circuitBreaker:
    activeSpanSec: 3
    threshold: 5
```
