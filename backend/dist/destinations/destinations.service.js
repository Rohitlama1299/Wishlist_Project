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
exports.DestinationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let DestinationsService = class DestinationsService {
    destinationRepository;
    cityRepository;
    constructor(destinationRepository, cityRepository) {
        this.destinationRepository = destinationRepository;
        this.cityRepository = cityRepository;
    }
    async create(userId, createDestinationDto) {
        const { cityId } = createDestinationDto;
        const city = await this.cityRepository.findOne({ where: { id: cityId } });
        if (!city) {
            throw new common_1.NotFoundException(`City with ID ${cityId} not found`);
        }
        const existingDestination = await this.destinationRepository.findOne({
            where: { userId, cityId },
        });
        if (existingDestination) {
            throw new common_1.ConflictException('This destination is already in your list');
        }
        const destination = this.destinationRepository.create({
            ...createDestinationDto,
            userId,
        });
        return this.destinationRepository.save(destination);
    }
    async findAllByUser(userId) {
        return this.destinationRepository.find({
            where: { userId },
            relations: [
                'city',
                'city.country',
                'city.country.continent',
                'photos',
                'activities',
            ],
            order: { createdAt: 'DESC' },
        });
    }
    async findByContinent(userId, continentId) {
        return this.destinationRepository
            .createQueryBuilder('destination')
            .leftJoinAndSelect('destination.city', 'city')
            .leftJoinAndSelect('city.country', 'country')
            .leftJoinAndSelect('country.continent', 'continent')
            .leftJoinAndSelect('destination.photos', 'photos')
            .leftJoinAndSelect('destination.activities', 'activities')
            .where('destination.userId = :userId', { userId })
            .andWhere('continent.id = :continentId', { continentId })
            .orderBy('destination.createdAt', 'DESC')
            .getMany();
    }
    async findByCountry(userId, countryId) {
        return this.destinationRepository
            .createQueryBuilder('destination')
            .leftJoinAndSelect('destination.city', 'city')
            .leftJoinAndSelect('city.country', 'country')
            .leftJoinAndSelect('country.continent', 'continent')
            .leftJoinAndSelect('destination.photos', 'photos')
            .leftJoinAndSelect('destination.activities', 'activities')
            .where('destination.userId = :userId', { userId })
            .andWhere('country.id = :countryId', { countryId })
            .orderBy('destination.createdAt', 'DESC')
            .getMany();
    }
    async findOne(userId, id) {
        const destination = await this.destinationRepository.findOne({
            where: { id, userId },
            relations: [
                'city',
                'city.country',
                'city.country.continent',
                'photos',
                'activities',
            ],
        });
        if (!destination) {
            throw new common_1.NotFoundException(`Destination with ID ${id} not found`);
        }
        return destination;
    }
    async update(userId, id, updateDestinationDto) {
        const destination = await this.findOne(userId, id);
        Object.assign(destination, updateDestinationDto);
        return this.destinationRepository.save(destination);
    }
    async remove(userId, id) {
        const destination = await this.findOne(userId, id);
        await this.destinationRepository.remove(destination);
    }
    async getStats(userId) {
        const destinations = await this.findAllByUser(userId);
        const totalDestinations = destinations.length;
        const visitedCount = destinations.filter((d) => d.visited).length;
        const pendingCount = totalDestinations - visitedCount;
        const continentStats = destinations.reduce((acc, dest) => {
            const continentName = dest.city?.country?.continent?.name || 'Unknown';
            acc[continentName] = (acc[continentName] || 0) + 1;
            return acc;
        }, {});
        const countryStats = destinations.reduce((acc, dest) => {
            const countryName = dest.city?.country?.name || 'Unknown';
            acc[countryName] = (acc[countryName] || 0) + 1;
            return acc;
        }, {});
        const countryDetails = destinations.reduce((acc, dest) => {
            const country = dest.city?.country;
            if (!country)
                return acc;
            if (!acc[country.id]) {
                acc[country.id] = {
                    id: country.id,
                    name: country.name,
                    code: country.code,
                    continentName: country.continent?.name || 'Unknown',
                    cityCount: 0,
                    cities: [],
                };
            }
            acc[country.id].cityCount += 1;
            if (dest.city) {
                acc[country.id].cities.push({
                    id: dest.city.id,
                    name: dest.city.name,
                    imageUrl: dest.city.imageUrl,
                    destinationId: dest.id,
                    visited: dest.visited,
                });
            }
            return acc;
        }, {});
        return {
            totalDestinations,
            visitedCount,
            pendingCount,
            continentStats,
            countryStats,
            countryDetails: Object.values(countryDetails).sort((a, b) => b.cityCount - a.cityCount),
        };
    }
};
exports.DestinationsService = DestinationsService;
exports.DestinationsService = DestinationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Destination)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.City)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DestinationsService);
//# sourceMappingURL=destinations.service.js.map