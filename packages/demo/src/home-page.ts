import { IAurelia, resolve } from 'aurelia';

console.log((IAurelia as any).test);


export class HomePage {
  constructor(private aurelia: IAurelia = resolve(IAurelia)) {
    console.log(aurelia);
  }
}
