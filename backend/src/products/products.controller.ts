import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'mainImage', maxCount: 1 },
    { name: 'detailImages', maxCount: 10 },
  ]))
  create(@Body() body: any, @UploadedFiles() files: { mainImage?: Express.Multer.File[], detailImages?: Express.Multer.File[] }) {
    // If sizes comes as a string from FormData, parse it.
    if (typeof body.sizes === 'string') {
      try { body.sizes = JSON.parse(body.sizes); } catch(e) { /* ignore */ }
    }
    return this.productsService.create(body, files.mainImage?.[0], files.detailImages);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() body: any) {
    if (typeof body.sizes === 'string') {
      try { body.sizes = JSON.parse(body.sizes); } catch(e) { /* ignore */ }
    }
    return this.productsService.update(id, body);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'detailImages', maxCount: 10 }]))
  addImages(@Param('id') id: string, @UploadedFiles() files: { detailImages?: Express.Multer.File[] }) {
    return this.productsService.addImages(id, files.detailImages);
  }

  @Delete('images/:imageId')
  @UseGuards(JwtAuthGuard)
  removeImage(@Param('imageId') imageId: string) {
    return this.productsService.removeImage(imageId);
  }

  @Patch(':id/main-image')
  @UseGuards(JwtAuthGuard)
  updateMainImage(@Param('id') id: string, @Body() body: { imageId: string }) {
    return this.productsService.updateMainImage(id, body.imageId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
