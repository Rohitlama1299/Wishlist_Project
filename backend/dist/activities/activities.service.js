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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let ActivitiesService = class ActivitiesService {
    activityRepository;
    destinationRepository;
    constructor(activityRepository, destinationRepository) {
        this.activityRepository = activityRepository;
        this.destinationRepository = destinationRepository;
    }
    async create(userId, createActivityDto) {
        const { destinationId, ...activityData } = createActivityDto;
        const destination = await this.destinationRepository.findOne({
            where: { id: destinationId, userId },
        });
        if (!destination) {
            throw new common_1.NotFoundException('Destination not found');
        }
        const activity = this.activityRepository.create({
            ...activityData,
            destinationId,
        });
        return this.activityRepository.save(activity);
    }
    async findByDestination(userId, destinationId) {
        const destination = await this.destinationRepository.findOne({
            where: { id: destinationId, userId },
        });
        if (!destination) {
            throw new common_1.NotFoundException('Destination not found');
        }
        return this.activityRepository.find({
            where: { destinationId },
            order: { sortOrder: 'ASC', createdAt: 'DESC' },
        });
    }
    async findOne(userId, activityId) {
        const activity = await this.activityRepository.findOne({
            where: { id: activityId },
            relations: ['destination'],
        });
        if (!activity) {
            throw new common_1.NotFoundException('Activity not found');
        }
        if (activity.destination.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to access this activity');
        }
        return activity;
    }
    async update(userId, activityId, updateActivityDto) {
        const activity = await this.findOne(userId, activityId);
        Object.assign(activity, updateActivityDto);
        return this.activityRepository.save(activity);
    }
    async remove(userId, activityId) {
        const activity = await this.findOne(userId, activityId);
        await this.activityRepository.remove(activity);
    }
    async toggleCompleted(userId, activityId) {
        const activity = await this.findOne(userId, activityId);
        activity.completed = !activity.completed;
        return this.activityRepository.save(activity);
    }
    async reorder(userId, destinationId, activityIds) {
        const destination = await this.destinationRepository.findOne({
            where: { id: destinationId, userId },
        });
        if (!destination) {
            throw new common_1.NotFoundException('Destination not found');
        }
        for (let i = 0; i < activityIds.length; i++) {
            await this.activityRepository.update({ id: activityIds[i], destinationId }, { sortOrder: i });
        }
        return this.findByDestination(userId, destinationId);
    }
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Activity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Destination)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map