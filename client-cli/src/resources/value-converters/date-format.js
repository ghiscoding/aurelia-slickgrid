import moment from 'moment';

export class DateFormatValueConverter {
  toView(value, format) {
    return moment(value).format(format);
  }
}
