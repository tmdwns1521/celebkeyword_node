import { PartialType } from '@nestjs/mapped-types';
import { CreateTrandkeywordDto } from './create-trandkeyword.dto';

export class UpdateTrandkeywordDto extends PartialType(CreateTrandkeywordDto) {}
