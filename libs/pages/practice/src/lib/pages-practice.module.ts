import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GuardsModule } from '@campus/guards';
import { PagesSharedModule } from '@campus/pages/shared';
import { UiModule } from '@campus/ui';
import { PracticeComponent } from './components/practice.component';
import { PracticeViewModel } from './components/practice.viewmodel';
import { PagesPracticeRoutingModule } from './pages-practice-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesPracticeRoutingModule,
    UiModule,
    GuardsModule,
    PagesSharedModule
  ],
  declarations: [PracticeComponent],
  providers: [PracticeViewModel]
})
export class PagesPracticeModule {}
