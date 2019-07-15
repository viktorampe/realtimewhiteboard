import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalSearchComponent } from './components/global-search/global-search.component';

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: GlobalSearchComponent }
    ])
  ],
  declarations: [GlobalSearchComponent]
})
export class PagesGlobalSearchModule {}
