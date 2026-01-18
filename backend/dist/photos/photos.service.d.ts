import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Photo, Destination } from '../entities';
import { CreatePhotoDto } from './dto/create-photo.dto';
export declare class PhotosService {
    private photoRepository;
    private destinationRepository;
    private configService;
    private uploadPath;
    constructor(photoRepository: Repository<Photo>, destinationRepository: Repository<Destination>, configService: ConfigService);
    create(userId: string, file: Express.Multer.File, createPhotoDto: CreatePhotoDto): Promise<Photo>;
    findByDestination(userId: string, destinationId: string): Promise<Photo[]>;
    updateCaption(userId: string, photoId: string, caption: string): Promise<Photo>;
    remove(userId: string, photoId: string): Promise<void>;
    reorder(userId: string, destinationId: string, photoIds: string[]): Promise<Photo[]>;
}
