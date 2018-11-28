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
        if (
          this.environmentErrorManagementFeature.managedStatusCodes.some(
            managedStatusCode => managedStatusCode === error.status
          )
        ) {
          this.router.navigate(['/error', error.status]);
        }
        return throwError(error);
      })
    );
  }
}
