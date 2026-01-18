import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { User } from '../entities';
export declare class PhotosController {
    private readonly photosService;
    constructor(photosService: PhotosService);
    create(user: User, file: Express.Multer.File, createPhotoDto: CreatePhotoDto): Promise<import("../entities").Photo>;
    findByDestination(user: User, destinationId: string): Promise<import("../entities").Photo[]>;
    updateCaption(user: User, id: string, caption: string): Promise<import("../entities").Photo>;
    reorder(user: User, destinationId: string, photoIds: string[]): Promise<import("../entities").Photo[]>;
    remove(user: User, id: string): Promise<void>;
}
