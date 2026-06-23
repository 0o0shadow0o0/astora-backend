"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledTask = exports.TaskPriority = exports.TaskStatus = exports.TaskType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_entity_1 = require("../../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var TaskType;
(function (TaskType) {
    TaskType["ONE_TIME"] = "one_time";
    TaskType["DAILY"] = "daily";
    TaskType["WEEKLY"] = "weekly";
    TaskType["MONTHLY"] = "monthly";
    TaskType["YEARLY"] = "yearly";
    TaskType["CRON"] = "cron";
    TaskType["RECURRING"] = "recurring";
})(TaskType || (exports.TaskType = TaskType = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pending";
    TaskStatus["RUNNING"] = "running";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["FAILED"] = "failed";
    TaskStatus["CANCELLED"] = "cancelled";
    TaskStatus["PAUSED"] = "paused";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["NORMAL"] = "normal";
    TaskPriority["HIGH"] = "high";
    TaskPriority["CRITICAL"] = "critical";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
let ScheduledTask = class ScheduledTask extends base_entity_1.BaseEntity {
};
exports.ScheduledTask = ScheduledTask;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Send daily report' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ScheduledTask.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Task description', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ScheduledTask.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TaskType }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TaskType,
        default: TaskType.ONE_TIME,
    }),
    __metadata("design:type", String)
], ScheduledTask.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TaskStatus }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.PENDING,
    }),
    __metadata("design:type", String)
], ScheduledTask.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TaskPriority }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TaskPriority,
        default: TaskPriority.NORMAL,
    }),
    __metadata("design:type", String)
], ScheduledTask.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '* * * * *' }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ScheduledTask.prototype, "cronExpression", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], ScheduledTask.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], ScheduledTask.prototype, "startedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], ScheduledTask.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    (0, typeorm_1.Column)({ default: 3 }),
    __metadata("design:type", Number)
], ScheduledTask.prototype, "maxRetries", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ScheduledTask.prototype, "retryCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3600 }),
    (0, typeorm_1.Column)({ default: 3600 }),
    __metadata("design:type", Number)
], ScheduledTask.prototype, "timeoutSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], ScheduledTask.prototype, "payload", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Error message', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ScheduledTask.prototype, "errorMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ScheduledTask.prototype, "isRecurring", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ScheduledTask.prototype, "recurringEndDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ScheduledTask.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ScheduledTask.prototype, "userId", void 0);
exports.ScheduledTask = ScheduledTask = __decorate([
    (0, typeorm_1.Entity)('scheduled_tasks')
], ScheduledTask);
//# sourceMappingURL=scheduled-task.entity.js.map