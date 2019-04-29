import {
  HttpClient,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CampusHttpInterceptor } from '.';
import { ENVIRONMENT_ERROR_MANAGEMENT_FEATURE_TOKEN } from '../interfaces';

describe(`AuthHttpInterceptor`, () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const mockedManagedAllowedStatusCode = 401;
  const mockedManagedUnAllowedStatusCode = 404;
  const mockedNonManagedStatusCode = 400;
  const mockedManagedStatusCodes = [
    mockedManagedAllowedStatusCode,
    mockedManagedUnAllowedStatusCode
  ];
  const mockRequestErrorUrl = '/fake-api-url';
  const spy = jest.fn();

  class MockRouter {
    navigate = spy;
  }

  const allowedError = {
    status: mockedManagedAllowedStatusCode
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CampusHttpInterceptor,
          multi: true
        },
        { provide: Router, useClass: MockRouter },
        {
          provide: ENVIRONMENT_ERROR_MANAGEMENT_FEATURE_TOKEN,
          useValue: {
            managedStatusCodes: mockedManagedStatusCodes,
            allowedErrors: [allowedError]
          }
        }
      ]
    });
    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should not redirect if the request was successfull', () => {
    httpClient.get(mockRequestErrorUrl).subscribe();
    const httpRequest = httpMock.expectOne(mockRequestErrorUrl);
    httpRequest.flush({ data: 'successfull' });
    expect(spy).toHaveBeenCalledTimes(0);
    httpMock.verify();
  });
  it('should not redirect with the router if an error with a nonmanaged statuscode is thrown', () => {
    httpClient.get(mockRequestErrorUrl).subscribe();
    const httpRequest = httpMock.expectOne(mockRequestErrorUrl);
    httpRequest.error(
      new ErrorEvent('testing error for the first time before the retry'),
      {
        status: mockedNonManagedStatusCode
      }
    );
    expect(spy).toHaveBeenCalledTimes(0);
    const httpRequestRetry = httpMock.expectOne(mockRequestErrorUrl);
    httpRequestRetry.error(new ErrorEvent('testing error for the retry'), {
      status: mockedNonManagedStatusCode
    });
    expect(spy).toHaveBeenCalledTimes(0);
    httpMock.verify();
  });
  it('should redirect with the router if an error with a managed statuscode is thrown', () => {
    httpClient.get(mockRequestErrorUrl).subscribe();
    const httpRequest = httpMock.expectOne(mockRequestErrorUrl);
    httpRequest.error(
      new ErrorEvent('testing error for the first time before the retry'),
      {
        status: mockedManagedUnAllowedStatusCode
      }
    );
    expect(spy).toHaveBeenCalledTimes(0);
    const httpRequestRetry = httpMock.expectOne(mockRequestErrorUrl);
    httpRequestRetry.error(new ErrorEvent('testing error for the retry'), {
      status: mockedManagedUnAllowedStatusCode
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith([
      '/error',
      mockedManagedUnAllowedStatusCode
    ]);
    httpMock.verify();
  });

  it('should not redirect if an allowed error statuscode is thrown', () => {
    httpClient.get(mockRequestErrorUrl).subscribe();
    const httpRequest = httpMock.expectOne(mockRequestErrorUrl);
    httpRequest.error(
      new ErrorEvent('testing error for the first time before the retry'),
      {
        status: mockedManagedAllowedStatusCode
      }
    );
    expect(spy).toHaveBeenCalledTimes(0);
    const httpRequestRetry = httpMock.expectOne(mockRequestErrorUrl);
    httpRequestRetry.error(new ErrorEvent('testing error for the retry'), {
      status: mockedManagedAllowedStatusCode
    });
    expect(spy).toHaveBeenCalledTimes(0);
    httpMock.verify();
  });

  describe('allowed errors', () => {
    let error;
    beforeEach(() => {
      error = new HttpErrorResponse({ status: 404 });
    });

    it('should allow the error', () => {
      const interceptor = new CampusHttpInterceptor(<Router>{}, {
        managedStatusCodes: [404],
        allowedErrors: [
          {
            status: 404
          }
        ]
      });
      expect(interceptor.isAllowedError(error)).toBe(true);
    });

    it('should not allow the error', () => {
      error.status = 405;
      const interceptor = new CampusHttpInterceptor(<Router>{}, {
        managedStatusCodes: [404],
        allowedErrors: [
          {
            status: 404
          }
        ]
      });
      expect(interceptor.isAllowedError(error)).toBe(false);
    });

    it('should allow the error on statusText match', () => {
      error.statusText = 'how now brown cow';
      const interceptor = new CampusHttpInterceptor(<Router>{}, {
        managedStatusCodes: [404],
        allowedErrors: [
          {
            statusText: 'how now brown cow'
          }
        ]
      });
      expect(interceptor.isAllowedError(error)).toBe(true);
    });

    it('should deny the error on statusText fail', () => {
      error.statusText = 'how now green bean';
      const interceptor = new CampusHttpInterceptor(<Router>{}, {
        managedStatusCodes: [404],
        allowedErrors: [
          {
            statusText: 'how now brown cow'
          }
        ]
      });
      expect(interceptor.isAllowedError(error)).toBe(false);
    });

    it('should allow the error on message regex match', () => {
      error.message = 'how now brown cow';
      const interceptor = new CampusHttpInterceptor(<Router>{}, {
        managedStatusCodes: [404],
        allowedErrors: [
          {
            messageRegex: '(.*)brown(.)*'
          }
        ]
      });
      expect(interceptor.isAllowedError(error)).toBe(true);
    });

    it('should allow the error on message regex match for error.error object message', () => {
      error.status = 404;
      error.error = {
        error: { message: 'deep error message here' }
      };
      const interceptor = new CampusHttpInterceptor(<Router>{}, {
        managedStatusCodes: [404],
        allowedErrors: [
          {
            status: 404,
            messageRegex: 'deep error message here'
          }
        ]
      });
      expect(interceptor.isAllowedError(error)).toBe(true);
    });

    it('should deny the error on message regex fail', () => {
      error.message = 'how now green bean';
      const interceptor = new CampusHttpInterceptor(<Router>{}, {
        managedStatusCodes: [404],
        allowedErrors: [
          {
            messageRegex: '(.*)brown(.)*'
          }
        ]
      });
      expect(interceptor.isAllowedError(error)).toBe(false);
    });

    it('should allow the error on url regex match', () => {
      error.url = 'cow.svg';
      const interceptor = new CampusHttpInterceptor(<Router>{}, {
        managedStatusCodes: [404],
        allowedErrors: [
          {
            urlRegex: '(.*).svg'
          }
        ]
      });
      expect(interceptor.isAllowedError(error)).toBe(true);
    });

    it('should deny the error on url regex fail', () => {
      error.url = 'cow.jpg';
      const interceptor = new CampusHttpInterceptor(<Router>{}, {
        managedStatusCodes: [404],
        allowedErrors: [
          {
            urlRegex: '(.*).svg'
          }
        ]
      });
      expect(interceptor.isAllowedError(error)).toBe(false);
    });

    it('should match all combinations', () => {
      error.url = 'cow.svg';
      error.message = 'how now brown cow';
      error.status = 422;
      error.statusText = 'holy cow';
      const interceptor = new CampusHttpInterceptor(<Router>{}, {
        managedStatusCodes: [422],
        allowedErrors: [
          {
            status: 422,
            statusText: 'holy cow',
            messageRegex: '.*brown.*',
            urlRegex: '(.*).svg'
          }
        ]
      });
      expect(interceptor.isAllowedError(error)).toBe(true);
    });

    it('should fail if one of them fails', () => {
      error.url = 'cow.svg';
      error.message = 'how now brown cow';
      error.status = 422;
      error.statusText = 'holy crap';
      const interceptor = new CampusHttpInterceptor(<Router>{}, {
        managedStatusCodes: [422],
        allowedErrors: [
          {
            status: 422,
            statusText: 'holy cow',
            messageRegex: '.*brown.*',
            urlRegex: '(.*).svg'
          }
        ]
      });
      expect(interceptor.isAllowedError(error)).toBe(false);
    });
  });
});
