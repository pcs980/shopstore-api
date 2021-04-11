import prometheus from 'prom-client';

prometheus.collectDefaultMetrics();

const jobFailCounter = new prometheus.Counter({
  name: 'job_fail_counter',
  help: 'Count job failures',
  labelNames: ['job_name'],
});

const requestHistogram = new prometheus.Histogram({
  name: 'service_request_duration_seconds',
  help: 'Service request latency',
  labelNames: ['service', 'action', 'error'],
  buckets: [0.05, 0.1, 0.5, 1, 2.5, 5],
});

const incrementJobFail = (jobName: string) => {
  return jobFailCounter.labels({ job_name: jobName }).inc();
};

const observeProductRequest = (action: string, error: string, time: number) => {
  requestHistogram.labels('product', action, error).observe(time);
};

const startUserRequestTimer = (action: string) => {
  return requestHistogram.labels('user', action, '').startTimer();
};

export {
  prometheus,
  incrementJobFail,
  observeProductRequest,
  startUserRequestTimer,
};
