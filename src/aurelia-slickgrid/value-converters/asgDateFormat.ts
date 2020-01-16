import * as moment from 'moment-mini';

export class AsgDateFormatValueConverter {
  toView(value: any, format: string): string {
    return moment(value).format(format);
  }
}
