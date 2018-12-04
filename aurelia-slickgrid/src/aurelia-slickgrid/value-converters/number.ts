export class NumberValueConverter {
  fromView(value: any, format: string): number {
    const number = parseFloat(value);
    return isNaN(number) ? value : number;
  }
}
