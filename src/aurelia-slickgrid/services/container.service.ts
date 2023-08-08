import { ContainerService as UniversalContainerService } from '@slickgrid-universal/common';
import { IContainer, Registration, singleton } from 'aurelia';

@singleton()
export class ContainerService implements UniversalContainerService {
  constructor(@IContainer private readonly container: IContainer) { }

  get<T = any>(key: string): T | null {
    const dependency = this.container.get(key) as T;
    if (typeof key === 'string' && dependency === key) {
      return null;
    }
    return dependency;
  }

  registerInstance(key: string, instance: any) {
    this.container.register(Registration.instance(key, instance));
  }
}
