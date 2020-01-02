# api-cache-proxy

Ensuring system performance and SLAs is very important for developers.
Common means of realization are cache, Circuit Breaker, etc.
But implementing them for all APIs is difficult.

This application provides cache and circuit breaker as proxy service for existing API.


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

