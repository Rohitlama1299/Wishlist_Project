"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const entities_1 = require("../entities");
let PhotosService = class PhotosService {
    photoRepository;
    destinationRepository;
    configService;
    uploadPath;
    constructor(photoRepository, destinationRepository, configService) {
        this.photoRepository = photoRepository;
        this.destinationRepository = destinationRepository;
        this.configService = configService;
        this.uploadPath = this.configService.get('UPLOAD_PATH', './uploads');
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }
    async create(userId, file, createPhotoDto) {
        const { destinationId, caption, sortOrder } = createPhotoDto;
        const destination = await this.destinationRepository.findOne({
            where: { id: destinationId, userId },
        });
        if (!destination) {
            throw new common_1.NotFoundException('Destination not found');
        }
        const fileExtension = path.extname(file.originalname);
        const fileName = `${(0, uuid_1.v4)()}${fileExtension}`;
        const filePath = path.join(this.uploadPath, fileName);
        fs.writeFileSync(filePath, file.buffer);
        const photo = this.photoRepository.create({
            url: `/uploads/${fileName}`,
            fileName: file.originalname,
            mimeType: file.mimetype,
            caption,
            sortOrder: sortOrder || 0,
            destinationId,
        });
        return this.photoRepository.save(photo);
    }
    async findByDestination(userId, destinationId) {
        const destination = await this.destinationRepository.findOne({
            where: { id: destinationId, userId },
        });
        if (!destination) {
            throw new common_1.NotFoundException('Destination not found');
        }
        return this.photoRepository.find({
            where: { destinationId },
            order: { sortOrder: 'ASC', createdAt: 'DESC' },
        });
    }
    async updateCaption(userId, photoId, caption) {
        const photo = await this.photoRepository.findOne({
            where: { id: photoId },
            relations: ['destination'],
        });
        if (!photo) {
            throw new common_1.NotFoundException('Photo not found');
        }
        if (photo.destination.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to update this photo');
        }
        photo.caption = caption;
        return this.photoRepository.save(photo);
    }
    async remove(userId, photoId) {
        const photo = await this.photoRepository.findOne({
            where: { id: photoId },
            relations: ['destination'],
        });
        if (!photo) {
            throw new common_1.NotFoundException('Photo not found');
        }
        if (photo.destination.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to delete this photo');
        }
        const filePath = path.join(process.cwd(), photo.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        await this.photoRepository.remove(photo);
    }
    async reorder(userId, destinationId, photoIds) {
        const destination = await this.destinationRepository.findOne({
            where: { id: destinationId, userId },
        });
        if (!destination) {
            throw new common_1.NotFoundException('Destination not found');
        }
        for (let i = 0; i < photoIds.length; i++) {
            await this.photoRepository.update({ id: photoIds[i], destinationId }, { sortOrder: i });
        }
        return this.findByDestination(userId, destinationId);
    }
};
exports.PhotosService = PhotosService;
exports.PhotosService = PhotosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Photo)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Destination)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], PhotosService);
//# sourceMappingURL=photos.service.js.map