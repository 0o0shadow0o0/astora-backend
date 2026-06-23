"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bullmq_1 = require("@nestjs/bullmq");
const whatsapp_account_entity_1 = require("./entities/whatsapp-account.entity");
const whatsapp_service_1 = require("./services/whatsapp.service");
const whatsapp_controller_1 = require("./controllers/whatsapp.controller");
let WhatsAppModule = class WhatsAppModule {
};
exports.WhatsAppModule = WhatsAppModule;
exports.WhatsAppModule = WhatsAppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([whatsapp_account_entity_1.WhatsAppAccount]),
            bullmq_1.BullModule.registerQueue({ name: 'whatsapp-messages' }),
        ],
        controllers: [whatsapp_controller_1.WhatsAppController],
        providers: [whatsapp_service_1.WhatsAppService],
        exports: [whatsapp_service_1.WhatsAppService],
    })
], WhatsAppModule);
//# sourceMappingURL=whatsapp.module.js.map