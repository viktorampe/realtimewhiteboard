import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DalState } from '@campus/dal';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {
  EnvironmentErrorManagementFeatureInterface,
  ENVIRONMENT_ERROR_MANAGEMENT_FEATURE_TOKEN
} from '../interfaces';

@Injectable()
export class CampusHttpInterceptor implements HttpInterceptor {
  constructor(
    @Inject('uuid') private uuid: Function,
    private store: Store<DalState>,
    private router: Router,
    @Inject(ENVIRONMENT_ERROR_MANAGEMENT_FEATURE_TOKEN)
    private environmentErrorManagementFeature: EnvironmentErrorManagementFeatureInterface
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        if (
          this.isManagedError(error) &&
          !this.isAllowedError(error) &&
          !request.url.includes('People/login')
        ) {
          this.router.navigate(['/error', error.status]);
        }
        return throwError(error);
      })
    );
  }
  public isAllowedError(error: HttpErrorResponse): boolean {
    return this.environmentErrorManagementFeature.allowedErrors.some(
      allowedError => {
        return (
          (!allowedError.status || allowedError.status === error.status) &&
          (!allowedError.name || allowedError.name === error.name) &&
          (!allowedError.statusText ||
            allowedError.statusText === error.statusText) &&
          (!allowedError.urlRegex ||
            new RegExp(allowedError.urlRegex, 'i').test(error.url)) &&
          (!allowedError.messageRegex ||
            new RegExp(allowedError.messageRegex, 'i').test(error.message) ||
            (error.error &&
              error.error.error &&
              error.error.error.message &&
              new RegExp(allowedError.messageRegex, 'i').test(
                error.error.error.message
              )))
        );
      }
    );
  }

  private isManagedError(error: HttpErrorResponse): boolean {
    return this.environmentErrorManagementFeature.managedStatusCodes.includes(
      error.status
    );
  }
}
