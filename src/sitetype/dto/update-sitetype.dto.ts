import { PartialType } from '@nestjs/mapped-types';
import { CreateSitetypeDto } from './create-sitetype.dto';

export class UpdateSitetypeDto extends PartialType(CreateSitetypeDto) {}
