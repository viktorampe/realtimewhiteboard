import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule, MAT_DIALOG_DATA } from '@angular/material';
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
  providers: [
    LoginPageViewModel,
    EduContentViewModel,
    {
      provide: MAT_DIALOG_DATA,
      useValue: {
        title: 'Zelda needs some Links',
        item: {
          icon: 'task',
          label: 'Zelda',
          id: 42,
          className: 'itemReceivingLinks'
        },
        linkableItems: [
          {
            icon: 'bundle',
            label: 'Link',
            id: 1,
            className: 'itemToLink'
          },
          {
            icon: 'bundle',
            label: 'Toon Link',
            id: 2,
            className: 'itemToLink'
          },
          {
            icon: 'bundle',
            label: 'Dark Link',
            id: 3,
            className: 'itemToLink'
          }
        ],
        linkedItemIds: new Set([1, 3]),
        recentItemIds: new Set([1])
      }
    }
  ],
  declarations: [
    LoginpageComponent,
    EduContentComponent,
    FindingNemoComponent,
    PolpoResultItemComponent
  ],
  exports: [],
  entryComponents: [PolpoResultItemComponent]
})
export class DevlibModule {}
