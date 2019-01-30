import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {
  EnvironmentErrorManagementFeatureInterface,
  ENVIRONMENT_ERROR_MANAGEMENT_FEATURE_TOKEN
} from '../interfaces';

@Injectable()
export class CampusHttpInterceptor implements HttpInterceptor {
  constructor(
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
        const errorNeedsRedirect = !this.isAllowedError(error);
        const managedError = this.isManagedError(error);
        if (managedError && errorNeedsRedirect) {
          this.router.navigate(['/error', error.status]);
        }
        return throwError(error);
      })
    );
  }
  private isAllowedError(error: HttpErrorResponse): boolean {
    return this.environmentErrorManagementFeature.allowedErrors.some(
      allowedError => {
        return (
          (!!allowedError.status
            ? error.status === allowedError.status
            : true) &&
          (!!allowedError.name ? error.name === allowedError.name : true) &&
          (!!allowedError.statusText
            ? error.statusText === allowedError.statusText
            : true) &&
          (!!allowedError.urlRegex
            ? allowedError.urlRegex.test(error.url)
            : true) &&
          (!!allowedError.messageRegex
            ? allowedError.messageRegex.test(error.message)
            : true)
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
