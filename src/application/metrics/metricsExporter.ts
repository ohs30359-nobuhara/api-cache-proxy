import {Registry, collectDefaultMetrics} from 'prom-client';
import {cacheMetrics} from "@application/metrics/cacheMetrics";

export const registry: Registry = new Registry();
registry.registerMetric(cacheMetrics.metrics);
collectDefaultMetrics();