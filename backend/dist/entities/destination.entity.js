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
exports.Destination = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const city_entity_1 = require("./city.entity");
const photo_entity_1 = require("./photo.entity");
const activity_entity_1 = require("./activity.entity");
let Destination = class Destination {
    id;
    notes;
    visited;
    visitedDate;
    plannedDate;
    priority;
    user;
    userId;
    city;
    cityId;
    photos;
    activities;
    createdAt;
    updatedAt;
};
exports.Destination = Destination;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Destination.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Destination.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Destination.prototype, "visited", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Destination.prototype, "visitedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Destination.prototype, "plannedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Destination.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.destinations, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Destination.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Destination.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => city_entity_1.City, (city) => city.destinations),
    (0, typeorm_1.JoinColumn)({ name: 'cityId' }),
    __metadata("design:type", city_entity_1.City)
], Destination.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Destination.prototype, "cityId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => photo_entity_1.Photo, (photo) => photo.destination, { cascade: true }),
    __metadata("design:type", Array)
], Destination.prototype, "photos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activity_entity_1.Activity, (activity) => activity.destination, { cascade: true }),
    __metadata("design:type", Array)
], Destination.prototype, "activities", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Destination.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Destination.prototype, "updatedAt", void 0);
exports.Destination = Destination = __decorate([
    (0, typeorm_1.Entity)('destinations')
], Destination);
//# sourceMappingURL=destination.entity.js.map