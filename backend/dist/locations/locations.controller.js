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
exports.LocationsController = void 0;
const common_1 = require("@nestjs/common");
const locations_service_1 = require("./locations.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const create_city_dto_1 = require("./dto/create-city.dto");
let LocationsController = class LocationsController {
    locationsService;
    constructor(locationsService) {
        this.locationsService = locationsService;
    }
    getAllContinents() {
        return this.locationsService.getAllContinents();
    }
    getContinentById(id) {
        return this.locationsService.getContinentById(id);
    }
    getCountriesByContinent(id) {
        return this.locationsService.getCountriesByContinent(id);
    }
    getAllCountries() {
        return this.locationsService.getAllCountries();
    }
    getCountryById(id) {
        return this.locationsService.getCountryById(id);
    }
    getCitiesByCountry(id) {
        return this.locationsService.getCitiesByCountry(id);
    }
    searchCities(query) {
        return this.locationsService.searchCities(query || '');
    }
    getCityById(id) {
        return this.locationsService.getCityById(id);
    }
    createCity(createCityDto) {
        return this.locationsService.createCity(createCityDto.name, createCityDto.countryId, createCityDto.latitude, createCityDto.longitude);
    }
};
exports.LocationsController = LocationsController;
__decorate([
    (0, common_1.Get)('continents'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "getAllContinents", null);
__decorate([
    (0, common_1.Get)('continents/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "getContinentById", null);
__decorate([
    (0, common_1.Get)('continents/:id/countries'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "getCountriesByContinent", null);
__decorate([
    (0, common_1.Get)('countries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "getAllCountries", null);
__decorate([
    (0, common_1.Get)('countries/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "getCountryById", null);
__decorate([
    (0, common_1.Get)('countries/:id/cities'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "getCitiesByCountry", null);
__decorate([
    (0, common_1.Get)('cities/search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "searchCities", null);
__decorate([
    (0, common_1.Get)('cities/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "getCityById", null);
__decorate([
    (0, common_1.Post)('cities'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_city_dto_1.CreateCityDto]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "createCity", null);
exports.LocationsController = LocationsController = __decorate([
    (0, common_1.Controller)('locations'),
    __metadata("design:paramtypes", [locations_service_1.LocationsService])
], LocationsController);
//# sourceMappingURL=locations.controller.js.map