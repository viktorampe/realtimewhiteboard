import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { TruncateStringPipe } from './pipes/truncate-string/truncate-string.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [HeaderComponent, TruncateStringPipe],
  exports: [HeaderComponent, TruncateStringPipe]
})
export class SharedModule {}
