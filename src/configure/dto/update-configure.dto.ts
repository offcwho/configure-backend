import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigureDto } from './create-configure.dto';

export class UpdateConfigureDto extends PartialType(CreateConfigureDto) { }