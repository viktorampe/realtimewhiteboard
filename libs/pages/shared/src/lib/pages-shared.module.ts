import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@campus/ui';
import { InfoPanelStudentBundleComponent } from './components/info-panel/student/bundle/info-panel-student-bundle.component';
@NgModule({
  imports: [
    CommonModule,
    UiModule
  ],
  declarations: [
    InfoPanelStudentBundleComponent
  ],
  exports: [
    InfoPanelStudentBundleComponent
  ]
})
export class PagesSharedModule { }
