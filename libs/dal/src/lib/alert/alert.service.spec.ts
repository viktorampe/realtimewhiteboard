import { TestBed } from '@angular/core/testing';
import { AlertQueue, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable, of } from 'rxjs';
import { AlertService } from './alert.service';

export class MockPersonApi {
  getAlertQueues(
    id: any,
    filter?: any,
    customHeaders?: Function
  ): Observable<AlertQueue[]> {
    return of([]);
  }

  setAlertRead(
    id: any,
    alertId: any,
    read?: any,
    intended?: any,
    customHeaders?: Function
  ): Observable<object> {
    return of({});
  }

  destroyByIdAlertQueues(userId: number, alertId: number): Observable<any> {
    return of({});
  }
}

describe('AlertsService', () => {
  let alertService;
  let personApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService, { provide: PersonApi, useClass: MockPersonApi }]
    });

    alertService = TestBed.get(AlertService);
    personApi = TestBed.get(PersonApi);
  });

  it('should be created', () => {
    expect(alertService).toBeTruthy();
  });

  it('should get alerts without a dateFilter', () => {
    spyOn(personApi, 'getAlertQueues');
    const mockId = 1;

    alertService.getAllForUser(mockId);

    expect(personApi.getAlertQueues).toHaveBeenCalledWith(mockId, {});
  });

  it('should get alerts with a dateFilter', () => {
    spyOn(personApi, 'getAlertQueues');
    const mockId = 1;
    const mockDate = new Date(Date.now());

    alertService.getAllForUser(mockId, mockDate);

    expect(personApi.getAlertQueues).toHaveBeenCalledWith(mockId, {
      where: { validFrom: { gt: mockDate.toISOString() } }
    });
  });

  it('should set an alert as read', () => {
    spyOn(personApi, 'setAlertRead');
    const mockUserId = 1;
    const mockAlertId = 2;
    const mockRead = false;
    const mockIntended = false;

    alertService.setAlertAsRead(
      mockUserId,
      mockAlertId,
      mockRead,
      mockIntended
    );

    expect(personApi.setAlertRead).toHaveBeenCalledWith(
      mockUserId,
      mockAlertId,
      mockRead,
      mockIntended
    );
  });

  it('should set an array of alerts as read', () => {
    spyOn(personApi, 'setAlertRead');
    const mockUserId = 1;
    const mockAlertIdArray = [2, 3];
    const mockRead = false;
    const mockIntended = false;

    alertService.setAlertAsRead(
      mockUserId,
      mockAlertIdArray,
      mockRead,
      mockIntended
    );

    expect(personApi.setAlertRead).toHaveBeenCalledWith(
      mockUserId,
      mockAlertIdArray,
      mockRead,
      mockIntended
    );
  });

  it('should use the default parameters for read and intended', () => {
    spyOn(personApi, 'setAlertRead');
    const mockUserId = 1;
    const mockAlertIdArray = [2, 3];

    alertService.setAlertAsRead(mockUserId, mockAlertIdArray);

    expect(personApi.setAlertRead).toHaveBeenCalledWith(
      mockUserId,
      mockAlertIdArray,
      true,
      true
    );
  });

  it('should call the api to delete an alert', () => {
    personApi.destroyByIdAlertQueues = jest.fn();
    const mockUserId = 123;
    const mockAlertId = 456;

    alertService.deleteAlert(mockUserId, mockAlertId);

    expect(personApi.destroyByIdAlertQueues).toHaveBeenCalledWith(
      mockUserId,
      mockAlertId
    );
  });
});
