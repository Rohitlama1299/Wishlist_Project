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
exports.DestinationsController = void 0;
const common_1 = require("@nestjs/common");
const destinations_service_1 = require("./destinations.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../common/decorators/get-user.decorator");
const entities_1 = require("../entities");
let DestinationsController = class DestinationsController {
    destinationsService;
    constructor(destinationsService) {
        this.destinationsService = destinationsService;
    }
    create(user, createDestinationDto) {
        return this.destinationsService.create(user.id, createDestinationDto);
    }
    findAll(user) {
        return this.destinationsService.findAllByUser(user.id);
    }
    getStats(user) {
        return this.destinationsService.getStats(user.id);
    }
    findByContinent(user, continentId) {
        return this.destinationsService.findByContinent(user.id, continentId);
    }
    findByCountry(user, countryId) {
        return this.destinationsService.findByCountry(user.id, countryId);
    }
    findOne(user, id) {
        return this.destinationsService.findOne(user.id, id);
    }
    update(user, id, updateDestinationDto) {
        return this.destinationsService.update(user.id, id, updateDestinationDto);
    }
    remove(user, id) {
        return this.destinationsService.remove(user.id, id);
    }
};
exports.DestinationsController = DestinationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User,
        dto_1.CreateDestinationDto]),
    __metadata("design:returntype", void 0)
], DestinationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User]),
    __metadata("design:returntype", void 0)
], DestinationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User]),
    __metadata("design:returntype", void 0)
], DestinationsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('continent/:continentId'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('continentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, Number]),
    __metadata("design:returntype", void 0)
], DestinationsController.prototype, "findByContinent", null);
__decorate([
    (0, common_1.Get)('country/:countryId'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('countryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, Number]),
    __metadata("design:returntype", void 0)
], DestinationsController.prototype, "findByCountry", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], DestinationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, dto_1.UpdateDestinationDto]),
    __metadata("design:returntype", void 0)
], DestinationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], DestinationsController.prototype, "remove", null);
exports.DestinationsController = DestinationsController = __decorate([
    (0, common_1.Controller)('destinations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [destinations_service_1.DestinationsService])
], DestinationsController);
//# sourceMappingURL=destinations.controller.js.map