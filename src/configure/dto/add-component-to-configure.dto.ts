import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';

export class AddComponentToConfigureDto {
  @IsNumber()
  @Min(1)
  componentId: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number = 1;
}

export class AddComponentsToConfigureDto {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddComponentToConfigureDto)
  components: AddComponentToConfigureDto[];
}