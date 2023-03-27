import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileService } from './fileupload.service';

@Controller('file')
@ApiTags('파일 업로드 API')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @ApiOperation({
    summary: '파일 한 개 업로드',
    description: '파일 한 개 업로드 API',
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.MulterS3.File) {
    return this.fileService.uploadFile(file);
  }

  @Post('uploads')
  @ApiOperation({
    summary: '파일 여러 개 업로드',
    description: '파일 여러 개 업로드 API',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFiles(@UploadedFiles() files) {
    const imgurl: string[] = [];
    await Promise.all(
      files.map(async (file: Express.MulterS3.File) => {
        const key = await this.fileService.uploadFiles(file);
        imgurl.push(key);
      }),
    );
    return {
      statusCode: 201,
      message: '이미지 등록 성공',
      data: imgurl,
    };
  }
}
