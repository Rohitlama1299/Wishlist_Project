import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../entities';

@Controller('photos')
@UseGuards(JwtAuthGuard)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/i }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createPhotoDto: CreatePhotoDto,
  ) {
    return this.photosService.create(user.id, file, createPhotoDto);
  }

  @Get('destination/:destinationId')
  findByDestination(
    @GetUser() user: User,
    @Param('destinationId') destinationId: string,
  ) {
    return this.photosService.findByDestination(user.id, destinationId);
  }

  @Patch(':id/caption')
  updateCaption(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body('caption') caption: string,
  ) {
    return this.photosService.updateCaption(user.id, id, caption);
  }

  @Post('destination/:destinationId/reorder')
  reorder(
    @GetUser() user: User,
    @Param('destinationId') destinationId: string,
    @Body('photoIds') photoIds: string[],
  ) {
    return this.photosService.reorder(user.id, destinationId, photoIds);
  }

  @Delete(':id')
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.photosService.remove(user.id, id);
  }
}
