import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { UiModule } from '@campus/ui';
import { CoupledTeachersComponent } from './components/coupled-teachers.component';
import { PagesSettingsCoupledTeachersRoutingModule } from './pages-settings-coupled-teachers-routing.module';

@NgModule({
  declarations: [CoupledTeachersComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiModule,
    MatFormFieldModule,
    MatInputModule,
    PagesSettingsCoupledTeachersRoutingModule
  ]
})
export class PagesSettingsCoupledTeachersModule {}
