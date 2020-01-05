# api-cache-proxy

Ensuring system performance and SLAs is very important for developers.

Generally, they are secured by introducing cache, circuit breakers, etc.

However, implementing them in existing APIs is difficult.

This application provides a cache and circuit breaker as a proxy service for existing APIs.

![image](https://user-images.githubusercontent.com/16524047/71777942-8b0d9f80-2fea-11ea-97c5-361f8b39aa77.png)

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



