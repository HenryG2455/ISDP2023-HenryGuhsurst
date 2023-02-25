import { PartialType } from '@nestjs/mapped-types';
import { CreateSiteDto } from './create-site.dto';

export class UpdateSiteDto extends PartialType(CreateSiteDto) {
    siteID: number;
    name: string;
    address: string;
    address2: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
    dayOfWeek: string;
    distanceFromWH: number;
    notes: string;
    active: boolean;
    provinceID: string;
    siteType: string;

}
