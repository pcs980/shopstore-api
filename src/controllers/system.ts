import { Request, Response } from 'express';
import { prometheus } from '../utils/metrics';

const metrics = async (_: Request, res: Response) => {
  const result = await prometheus.register.metrics();

  res.set('Content-Type', prometheus.register.contentType);
  res.end(result);
};

export {
  metrics
};
