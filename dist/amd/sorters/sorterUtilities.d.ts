/// <reference types="moment" />
import { FieldType } from './../models/fieldType.enum';
import * as moment from 'moment';
export declare function sortByFieldType(value1: any, value2: any, fieldType: FieldType, sortDirection: number): number;
export declare function compareDates(sortDirection: number, value1: any, value2: any, format: string | moment.MomentBuiltinFormat, strict?: boolean): number;
