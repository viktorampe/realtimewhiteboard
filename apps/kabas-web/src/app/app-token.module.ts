import { NgModule } from '@angular/core';
import { AuthService, AUTH_SERVICE_TOKEN } from '@campus/dal';

@NgModule({
  providers: [
    //app level services

    // dal services
    { provide: AUTH_SERVICE_TOKEN, useClass: AuthService }
  ]
})
export class AppTokenModule {}
