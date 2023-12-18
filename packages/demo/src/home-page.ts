import { IAurelia } from 'aurelia';

console.log((IAurelia as any).test);


export class HomePage {
  constructor(@IAurelia private aurelia: IAurelia) {
    console.log(aurelia);
  }
}
