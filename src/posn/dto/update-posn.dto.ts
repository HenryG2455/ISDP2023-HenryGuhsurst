import { PartialType } from '@nestjs/mapped-types';
import { CreatePosnDto } from './create-posn.dto';

export class UpdatePosnDto extends PartialType(CreatePosnDto) {}
