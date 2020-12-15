import { SharedService } from '@slickgrid-universal/common';
import { UniversalContainerService } from '../universalContainer.service';

describe('UniversalContainer Service', () => {
  let service: UniversalContainerService;
  let sharedService: SharedService;

  beforeEach(() => {
    service = new UniversalContainerService();
    sharedService = new SharedService();
  });

  it('should register an instance and expect to retrieve it with the get method', () => {
    service.registerInstance('SharedService', sharedService);
    expect(service.get('SharedService')).toEqual(sharedService);
  });

  it('should register an instance and expect to null when calling the get method with an invalid name', () => {
    service.registerInstance('SharedService', sharedService);
    expect(service.get('DifferentName')).toBeNull();
  });

  it('should register an instance and expect it to be inside the array retrieved by the getAll method', () => {
    service.registerInstance('SharedService', sharedService);
    expect(service.getAll()).toEqual([{ key: 'SharedService', instance: sharedService }]);
  });
});
