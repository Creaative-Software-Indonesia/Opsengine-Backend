import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateMachineDto {
  // Diambil dari token, tidak perlu diinput dari frontend
  // Tidak perlu validasi maupun dokumentasi Swagger
  companyGuid?: string;

  // Diambil dari token, tidak perlu diinput dari frontend
  userGuid?: string;

  @ApiProperty({
    description: 'Nama mesin',
    example: 'Mesin Pemotong Kayu',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
    description: 'URL atau path gambar mesin',
    example: 'https://example.com/images/machine.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    required: false,
    description: 'Deskripsi mesin',
    example: 'Mesin digunakan untuk memotong kayu secara otomatis.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
