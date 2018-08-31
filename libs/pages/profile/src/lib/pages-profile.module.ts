import { ProfileViewModel } from './components/profile.viewmodel';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesProfileRoutingModule } from './pages-profile-routing.module';
import { ProfileComponent } from './components/profile.component';

@NgModule({
  imports: [CommonModule, PagesProfileRoutingModule],
  declarations: [ProfileComponent],

  providers: [ProfileViewModel]
})
export class PagesProfileModule {}
