import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal"
}
export declare class Log extends BaseEntity {
    level: LogLevel;
    message: string;
    context?: string;
    logger?: string;
    metadata?: Record<string, any>;
    userId?: string;
    user?: User;
}
