import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScormApiService } from './scorm-api';
import { SCORM_API_SERVICE_TOKEN } from './scorm-api/scorm-api.service.interface';

@NgModule({
  imports: [CommonModule],
  providers: [{ provide: SCORM_API_SERVICE_TOKEN, useClass: ScormApiService }]
})
export class ScormModule {}
