import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DalModule } from '@campus/dal';
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
export class DevlibModule {}
