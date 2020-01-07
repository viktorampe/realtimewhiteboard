import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import {
  LearningAreaServiceInterface,
  LEARNINGAREA_SERVICE_TOKEN
} from '../../learning-area/learning-area.service.interface';
import { DalState } from '../dal.state.interface';
import {
  LearningAreasActionTypes,
  LearningAreasLoaded,
  LearningAreasLoadError,
  LoadLearningAreas
} from './learning-area.actions';

@Injectable()
export class LearningAreasEffects {
  @Effect()
  loadLearningAreas$ = this.dataPersistence.fetch(
    LearningAreasActionTypes.LoadLearningAreas,
    {
      run: (action: LoadLearningAreas, state: DalState) => {
        if (!action.payload.force && state.learningAreas.loaded) return;
        return this.learningAreaService
          .getAll()
          .pipe(
            map(learningAreas => new LearningAreasLoaded({ learningAreas }))
          );
      },
      onError: (action: LoadLearningAreas, error) => {
        return new LearningAreasLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(LEARNINGAREA_SERVICE_TOKEN)
    private learningAreaService: LearningAreaServiceInterface
  ) {}
}
