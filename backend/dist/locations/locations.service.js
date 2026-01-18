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
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let LocationsService = class LocationsService {
    continentRepository;
    countryRepository;
    cityRepository;
    constructor(continentRepository, countryRepository, cityRepository) {
        this.continentRepository = continentRepository;
        this.countryRepository = countryRepository;
        this.cityRepository = cityRepository;
    }
    async getAllContinents() {
        return this.continentRepository.find({
            order: { name: 'ASC' },
        });
    }
    async getContinentById(id) {
        const continent = await this.continentRepository.findOne({
            where: { id },
            relations: ['countries'],
        });
        if (!continent) {
            throw new common_1.NotFoundException(`Continent with ID ${id} not found`);
        }
        return continent;
    }
    async getCountriesByContinent(continentId) {
        return this.countryRepository.find({
            where: { continentId },
            order: { name: 'ASC' },
        });
    }
    async getCountryById(id) {
        const country = await this.countryRepository.findOne({
            where: { id },
            relations: ['continent', 'cities'],
        });
        if (!country) {
            throw new common_1.NotFoundException(`Country with ID ${id} not found`);
        }
        return country;
    }
    async getAllCountries() {
        return this.countryRepository.find({
            relations: ['continent'],
            order: { name: 'ASC' },
        });
    }
    async getCitiesByCountry(countryId) {
        return this.cityRepository.find({
            where: { countryId },
            order: { name: 'ASC' },
        });
    }
    async getCityById(id) {
        const city = await this.cityRepository.findOne({
            where: { id },
            relations: ['country', 'country.continent'],
        });
        if (!city) {
            throw new common_1.NotFoundException(`City with ID ${id} not found`);
        }
        return city;
    }
    async searchCities(query) {
        return this.cityRepository
            .createQueryBuilder('city')
            .leftJoinAndSelect('city.country', 'country')
            .leftJoinAndSelect('country.continent', 'continent')
            .where('LOWER(city.name) LIKE LOWER(:query)', { query: `%${query}%` })
            .orderBy('city.name', 'ASC')
            .limit(20)
            .getMany();
    }
    async createCity(name, countryId, latitude, longitude) {
        const country = await this.countryRepository.findOne({
            where: { id: countryId },
        });
        if (!country) {
            throw new common_1.NotFoundException(`Country with ID ${countryId} not found`);
        }
        const city = this.cityRepository.create({
            name,
            countryId,
            latitude,
            longitude,
        });
        return this.cityRepository.save(city);
    }
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Continent)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Country)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.City)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LocationsService);
//# sourceMappingURL=locations.service.js.map