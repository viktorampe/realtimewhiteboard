import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DalModule } from '@campus/dal';
import { DevlibRoutingModule } from './devlib.routing.module';
import { EduContentComponent } from './edu-content/edu-content.component';
import { EduContentViewModel } from './edu-content/edu-content.viewmodel';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LoginPageViewModel } from './loginpage/loginpage.viewmodel';

@NgModule({
  imports: [
    DalModule.forRoot({ apiBaseUrl: 'http://api.polpo.localhost:3000' }),
    FormsModule,
    CommonModule,
    DevlibRoutingModule
  ],
  providers: [LoginPageViewModel, EduContentViewModel],
  declarations: [LoginpageComponent, EduContentComponent]
})
export class DevlibModule {}
