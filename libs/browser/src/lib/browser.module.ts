import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StorageService } from './storage/storage.service';
import { BROWSER_STORAGE_SERVICE_TOKEN } from './storage/storage.service.interface';
@NgModule({
  imports: [CommonModule],
  providers: [
    { provide: BROWSER_STORAGE_SERVICE_TOKEN, useClass: StorageService }
  ]
})
export class BrowserModule {}
