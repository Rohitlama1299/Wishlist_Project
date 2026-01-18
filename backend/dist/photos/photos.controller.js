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
exports.PhotosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const photos_service_1 = require("./photos.service");
const create_photo_dto_1 = require("./dto/create-photo.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../common/decorators/get-user.decorator");
const entities_1 = require("../entities");
let PhotosController = class PhotosController {
    photosService;
    constructor(photosService) {
        this.photosService = photosService;
    }
    create(user, file, createPhotoDto) {
        return this.photosService.create(user.id, file, createPhotoDto);
    }
    findByDestination(user, destinationId) {
        return this.photosService.findByDestination(user.id, destinationId);
    }
    updateCaption(user, id, caption) {
        return this.photosService.updateCaption(user.id, id, caption);
    }
    reorder(user, destinationId, photoIds) {
        return this.photosService.reorder(user.id, destinationId, photoIds);
    }
    remove(user, id) {
        return this.photosService.remove(user.id, id);
    }
};
exports.PhotosController = PhotosController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
            new common_1.FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/i }),
        ],
    }))),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, Object, create_photo_dto_1.CreatePhotoDto]),
    __metadata("design:returntype", void 0)
], PhotosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('destination/:destinationId'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('destinationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], PhotosController.prototype, "findByDestination", null);
__decorate([
    (0, common_1.Patch)(':id/caption'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('caption')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], PhotosController.prototype, "updateCaption", null);
__decorate([
    (0, common_1.Post)('destination/:destinationId/reorder'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('destinationId')),
    __param(2, (0, common_1.Body)('photoIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Array]),
    __metadata("design:returntype", void 0)
], PhotosController.prototype, "reorder", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], PhotosController.prototype, "remove", null);
exports.PhotosController = PhotosController = __decorate([
    (0, common_1.Controller)('photos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [photos_service_1.PhotosService])
], PhotosController);
//# sourceMappingURL=photos.controller.js.map