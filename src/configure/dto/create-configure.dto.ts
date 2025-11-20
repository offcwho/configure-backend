import { IsString, IsNotEmpty, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddComponentToConfigureDto } from './add-component-to-configure.dto';

export class CreateConfigureDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddComponentToConfigureDto)
  components: AddComponentToConfigureDto[];
}