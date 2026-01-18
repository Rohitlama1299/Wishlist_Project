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
exports.Photo = void 0;
const typeorm_1 = require("typeorm");
const destination_entity_1 = require("./destination.entity");
let Photo = class Photo {
    id;
    url;
    caption;
    fileName;
    mimeType;
    sortOrder;
    destination;
    destinationId;
    createdAt;
};
exports.Photo = Photo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Photo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Photo.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Photo.prototype, "caption", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Photo.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Photo.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Photo.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => destination_entity_1.Destination, (destination) => destination.photos, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'destinationId' }),
    __metadata("design:type", destination_entity_1.Destination)
], Photo.prototype, "destination", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Photo.prototype, "destinationId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Photo.prototype, "createdAt", void 0);
exports.Photo = Photo = __decorate([
    (0, typeorm_1.Entity)('photos')
], Photo);
//# sourceMappingURL=photo.entity.js.map