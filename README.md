# api-cache-proxy

product for providing proxy and offer to back post api

## configration

### resources

```config/default.yml
resources:
- prefix: interface provided by the application
  upstream: back post api url
  expireSec: cache lifetime (sec)
  timeoutMs: timeout(ms)
  circuitBreaker: 
    activeSpanSec: circuit breaker valid time (sec)
    threshold: circuit breaker enable threshold
```

