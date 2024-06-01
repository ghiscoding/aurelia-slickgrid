import { DI } from 'aurelia';
import { SharedService } from '@slickgrid-universal/common';
import { ContainerService } from '../container.service';

describe('Container Service', () => {
  const container = DI.createContainer();
  let service: ContainerService;
  let sharedService: SharedService;

  beforeEach(() => {
    service = new ContainerService(container);
    sharedService = new SharedService();
  });

  it('should register an instance and expect to retrieve it with the get method', () => {
    service.registerInstance('SharedService', sharedService);
    expect(service.get('SharedService')).toEqual(sharedService);
  });

  it('should register an instance and expect to return null when calling the get method with an invalid name', () => {
    service.registerInstance('SharedService', sharedService);
    const output = service.get('DifferentName');
    expect(output).toBeNull();
    // expect(() => service.get('DifferentName')).toThrow();
  });
});
