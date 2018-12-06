import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
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
  const mockedManagedStatusCode = 401;
  const mockedNonManagedStatusCode = 400;
  const mockedManagedStatusCodes = [mockedManagedStatusCode];
  const mockRequestErrorUrl = '/fake-api-url';
  const spy = jest.fn();

  class MockRouter {
    navigate = spy;
  }

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
            managedStatusCodes: mockedManagedStatusCodes
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
  it('should redirect with the router if an error with a managed statuscode is thrown', () => {
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
        status: mockedManagedStatusCode
      }
    );
    expect(spy).toHaveBeenCalledTimes(0);
    const httpRequestRetry = httpMock.expectOne(mockRequestErrorUrl);
    httpRequestRetry.error(new ErrorEvent('testing error for the retry'), {
      status: mockedManagedStatusCode
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/error', mockedManagedStatusCode]);
    httpMock.verify();
  });
});
