import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthService, AuthServiceToken } from '@campus/dal';
import { SDKBrowserModule } from '@diekeure/polpo-api-angular-sdk';

@NgModule({
  imports: [CommonModule, SDKBrowserModule.forRoot(), HttpClientModule]
})
export class DalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DalModule,
      providers: [{ provide: AuthServiceToken, useClass: AuthService }]
    };
  }
}
