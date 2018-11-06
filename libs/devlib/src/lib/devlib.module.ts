import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@campus/browser';
import { DalModule } from '@campus/dal';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { LoopBackConfig } from '@diekeure/polpo-api-angular-sdk';
import { DevlibRoutingModule } from './devlib.routing.module';
import { EduContentComponent } from './edu-content/edu-content.component';
import { EduContentViewModel } from './edu-content/edu-content.viewmodel';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LoginPageViewModel } from './loginpage/loginpage.viewmodel';
import { UiPageComponent } from './ui-page/ui-page.component';

@NgModule({
  imports: [
    DalModule.forRoot({ apiBaseUrl: 'http://api.polpo.localhost:3000' }),
    FormsModule,
    CommonModule,
    UiModule,
    DevlibRoutingModule,
    SharedModule,
    BrowserModule
  ],
  providers: [LoginPageViewModel, EduContentViewModel],
  declarations: [LoginpageComponent, EduContentComponent, UiPageComponent]
})
export class DevlibModule {
  static forRoot(): ModuleWithProviders {
    LoopBackConfig.setBaseURL('http://api.polpo.localhost:3000');
    LoopBackConfig.setRequestOptionsCredentials(true);
    return {
      ngModule: DevlibModule
    };
  }
}
