import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatListModule } from '@angular/material';
import { ScormModule } from '@campus/scorm';
import { SearchModule } from '@campus/search';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { DevlibRoutingModule } from './devlib.routing.module';
import { EduContentComponent } from './edu-content/edu-content.component';
import { EduContentViewModel } from './edu-content/edu-content.viewmodel';
import { FindingNemoComponent } from './finding-nemo/finding-nemo.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LoginPageViewModel } from './loginpage/loginpage.viewmodel';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    UiModule,
    DevlibRoutingModule,
    SharedModule,
    MatIconModule,
    ScormModule,
    SearchModule,
    ReactiveFormsModule,
    MatListModule
  ],
  providers: [LoginPageViewModel, EduContentViewModel],
  declarations: [LoginpageComponent, EduContentComponent, FindingNemoComponent]
})
export class DevlibModule {}
