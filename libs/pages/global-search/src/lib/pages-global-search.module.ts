import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchModule } from '@campus/search';
import {
  CONTENT_OPENER_TOKEN,
  CONTENT_TASK_MANAGER_TOKEN,
  SharedModule
} from '@campus/shared';
import { UiModule } from '@campus/ui';
import { GlobalSearchViewModel } from './components/global-search.viewmodel';
import { GlobalSearchComponent } from './components/global-search/global-search.component';
import { GlobalSearchResolver } from './resolvers/pages-global-search.resolver';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    SharedModule,
    SearchModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: GlobalSearchComponent,
        resolve: { isResolved: GlobalSearchResolver }
      }
    ])
  ],
  declarations: [GlobalSearchComponent],
  providers: [
    {
      provide: CONTENT_OPENER_TOKEN,
      useExisting: GlobalSearchViewModel
    },
    {
      provide: CONTENT_TASK_MANAGER_TOKEN,
      useExisting: GlobalSearchViewModel
    }
  ]
})
export class PagesGlobalSearchModule {}
