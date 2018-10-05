import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DalModule } from '@campus/dal';
import { LoopBackConfig } from '@diekeure/polpo-api-angular-sdk';
import { DevlibRoutingModule } from './devlib.routing.module';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LoginPageViewModel } from './loginpage/loginpage.viewmodel';

@NgModule({
  imports: [
    DalModule.forRoot(),
    FormsModule,
    CommonModule,
    DevlibRoutingModule
  ],
  providers: [LoginPageViewModel],
  declarations: [LoginpageComponent]
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
