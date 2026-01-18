import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Photo, Destination } from '../entities';
import { CreatePhotoDto } from './dto/create-photo.dto';

@Injectable()
export class PhotosService {
  private uploadPath: string;

  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
    private configService: ConfigService,
  ) {
    this.uploadPath = this.configService.get<string>('UPLOAD_PATH', './uploads');
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async create(
    userId: string,
    file: Express.Multer.File,
    createPhotoDto: CreatePhotoDto,
  ): Promise<Photo> {
    const { destinationId, caption, sortOrder } = createPhotoDto;

    // Verify destination belongs to user
    const destination = await this.destinationRepository.findOne({
      where: { id: destinationId, userId },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadPath, fileName);

    // Save file
    fs.writeFileSync(filePath, file.buffer);

    // Create photo record
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

  async findByDestination(
    userId: string,
    destinationId: string,
  ): Promise<Photo[]> {
    // Verify destination belongs to user
    const destination = await this.destinationRepository.findOne({
      where: { id: destinationId, userId },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    return this.photoRepository.find({
      where: { destinationId },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async updateCaption(
    userId: string,
    photoId: string,
    caption: string,
  ): Promise<Photo> {
    const photo = await this.photoRepository.findOne({
      where: { id: photoId },
      relations: ['destination'],
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    if (photo.destination.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this photo');
    }

    photo.caption = caption;
    return this.photoRepository.save(photo);
  }

  async remove(userId: string, photoId: string): Promise<void> {
    const photo = await this.photoRepository.findOne({
      where: { id: photoId },
      relations: ['destination'],
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    if (photo.destination.userId !== userId) {
      throw new ForbiddenException('Not authorized to delete this photo');
    }

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), photo.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.photoRepository.remove(photo);
  }

  async reorder(
    userId: string,
    destinationId: string,
    photoIds: string[],
  ): Promise<Photo[]> {
    // Verify destination belongs to user
    const destination = await this.destinationRepository.findOne({
      where: { id: destinationId, userId },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    // Update sort order for each photo
    for (let i = 0; i < photoIds.length; i++) {
      await this.photoRepository.update(
        { id: photoIds[i], destinationId },
        { sortOrder: i },
      );
    }

    return this.findByDestination(userId, destinationId);
  }
}
