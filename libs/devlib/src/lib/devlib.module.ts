import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { InfoPanelTaskComponent } from '../../../pages/tasks/src/lib/components/info-panel/info-panel-task/info-panel-task.component';
import { DevlibRoutingModule } from './devlib.routing.module';
import { EduContentComponent } from './edu-content/edu-content.component';
import { EduContentViewModel } from './edu-content/edu-content.viewmodel';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LoginPageViewModel } from './loginpage/loginpage.viewmodel';
import { UiPageComponent } from './ui-page/ui-page.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    UiModule,
    DevlibRoutingModule,
    SharedModule
  ],
  providers: [LoginPageViewModel, EduContentViewModel],
  declarations: [
    LoginpageComponent,
    EduContentComponent,
    UiPageComponent,
    InfoPanelTaskComponent
  ]
})
export class DevlibModule {}
