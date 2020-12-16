import { ContainerInstance, ContainerService } from '@slickgrid-universal/common';
import { Container, inject } from 'aurelia-framework';

@inject(Container)
export class UniversalContainerService implements ContainerService {
  dependencies: ContainerInstance[] = [];

  constructor(private container: Container) { }

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
