import { Inject, Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { DalState } from '..';
import {
  TocServiceInterface,
  TOC_SERVICE_TOKEN
} from '../../toc/toc.service.interface';

@Injectable()
export class EduContentTocEffects {
  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TOC_SERVICE_TOKEN)
    private eduContentTocService: TocServiceInterface
  ) {}
}
