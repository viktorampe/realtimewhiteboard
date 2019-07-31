import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchModule } from '@campus/search';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { GlobalSearchComponent } from './components/global-search/global-search.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    SharedModule,
    SearchModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: GlobalSearchComponent }
    ])
  ],
  declarations: [GlobalSearchComponent]
})
export class PagesGlobalSearchModule {}
