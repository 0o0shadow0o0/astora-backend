import { Response } from 'express';
import { MetricsService } from '../services/metrics.service';
export declare class MetricsController {
    private readonly metricsService;
    constructor(metricsService: MetricsService);
    getMetrics(res: Response): Promise<void>;
}
