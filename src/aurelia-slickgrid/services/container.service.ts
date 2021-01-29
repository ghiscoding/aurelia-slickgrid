import { ContainerService as UniversalContainerService } from '@slickgrid-universal/common';
import { Container, inject, singleton } from 'aurelia-framework';

@inject(Container)
@singleton(true)
export class ContainerService implements UniversalContainerService {
  constructor(private readonly container: Container) { }

  get<T = any>(key: string): T | null {
    const dependency = this.container.get(key);
    if (typeof key === 'string' && dependency === key) {
      return null;
    }
    return dependency;
  }

  registerInstance(key: string, instance: any) {
    this.container.registerInstance(key, instance);
  }
}
