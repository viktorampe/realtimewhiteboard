import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { ScormModule } from '@campus/scorm';
import { SearchModule } from '@campus/search';
import { SharedModule } from '@campus/shared';
import { ManageCollectionComponent, UiModule } from '@campus/ui';
import { QuickLinkViewModel } from 'libs/shared/src/lib/components/quick-link/quick-link.viewmodel';
import { DevlibRoutingModule } from './devlib.routing.module';
import { EduContentComponent } from './edu-content/edu-content.component';
import { EduContentViewModel } from './edu-content/edu-content.viewmodel';
import { FindingNemoComponent } from './finding-nemo/finding-nemo.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LoginPageViewModel } from './loginpage/loginpage.viewmodel';
import { PolpoResultItemComponent } from './polpo-result-item/polpo-result-item.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    UiModule,
    DevlibRoutingModule,
    SharedModule,
    MatIconModule,
    ScormModule,
    SearchModule
  ],
  providers: [LoginPageViewModel, EduContentViewModel, QuickLinkViewModel],
  declarations: [
    LoginpageComponent,
    EduContentComponent,
    FindingNemoComponent,
    PolpoResultItemComponent
  ],
  exports: [],
  entryComponents: [PolpoResultItemComponent, ManageCollectionComponent]
})
export class DevlibModule {}
