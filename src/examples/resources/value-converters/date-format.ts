import * as moment from 'moment';

export class DateFormatValueConverter {
  toView(value: any, format: string): string {
    return moment(value).format(format);
  }
}
