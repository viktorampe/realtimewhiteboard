import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { UiModule } from '@campus/ui';
import { EduContentsComponent } from './components/edu-contents.component';
import { EduContentsViewModel } from './components/edu-contents.viewmodel';
import { PagesEduContentsRoutingModule } from './pages-edu-contents-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesEduContentsRoutingModule,
    UiModule,
    PagesSharedModule
  ],
  declarations: [
    EduContentsComponent,
  ],
  providers: [EduContentsViewModel]
})
export class PagesEduContentsModule {}
