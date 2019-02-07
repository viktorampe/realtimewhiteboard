import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@campus/ui';
import { LogoutComponent } from './components/logout.component';
import { LogoutViewModel } from './components/logout.viewmodel';
import { PagesLogoutRoutingModule } from './pages-logout-routing.module';

@NgModule({
  imports: [CommonModule, PagesLogoutRoutingModule, UiModule],
  declarations: [LogoutComponent],

  providers: [LogoutViewModel]
})
export class PagesLogoutModule {}
