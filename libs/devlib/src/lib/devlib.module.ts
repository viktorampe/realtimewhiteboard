import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { DevlibRoutingModule } from './devlib.routing.module';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LoginPageViewModel } from './loginpage/loginpage.viewmodel';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    UiModule,
    DevlibRoutingModule,
    SharedModule,
    MatIconModule
  ],
  providers: [LoginPageViewModel],
  declarations: [LoginpageComponent],
  exports: [],
  entryComponents: []
})
export class DevlibModule {}
