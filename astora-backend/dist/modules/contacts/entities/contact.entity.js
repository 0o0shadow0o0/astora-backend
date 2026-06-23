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
exports.Contact = exports.ContactType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_entity_1 = require("../../../common/entities/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const whatsapp_account_entity_1 = require("../../whatsapp/entities/whatsapp-account.entity");
var ContactType;
(function (ContactType) {
    ContactType["PERSONAL"] = "personal";
    ContactType["BUSINESS"] = "business";
    ContactType["UNKNOWN"] = "unknown";
})(ContactType || (exports.ContactType = ContactType = {}));
let Contact = class Contact extends base_entity_1.BaseEntity {
};
exports.Contact = Contact;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+1234567890' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contact.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contact.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john_profile.jpg', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contact.prototype, "profilePicture", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Business', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contact.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'business@example.com', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contact.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New York, USA', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contact.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Software Engineer', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contact.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Company Inc', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contact.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+1234567890', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contact.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ContactType }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ContactType,
        default: ContactType.UNKNOWN,
    }),
    __metadata("design:type", String)
], Contact.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Contact.prototype, "isBlocked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Contact.prototype, "isMuted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Contact.prototype, "isStarred", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Contact.prototype, "isArchived", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Contact.prototype, "isContact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NOTES', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contact.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Contact.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contact.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => whatsapp_account_entity_1.WhatsAppAccount, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'whatsapp_account_id' }),
    __metadata("design:type", whatsapp_account_entity_1.WhatsAppAccount)
], Contact.prototype, "whatsappAccount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contact.prototype, "whatsappAccountId", void 0);
exports.Contact = Contact = __decorate([
    (0, typeorm_1.Entity)('contacts')
], Contact);
//# sourceMappingURL=contact.entity.js.map