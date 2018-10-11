import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { LearningAreaServiceInterface, LEARNINGAREA_SERVICE_TOKEN } from '../../learning-area/learning-area.service.interface';
import {
  LearningAreasActionTypes,
  LearningAreasLoadError,
  LoadLearningAreas,
  LearningAreasLoaded
} from './learning-area.actions';
import { State } from './learning-area.reducer';

@Injectable()
export class LearningAreasEffects {
  @Effect()
  loadLearningAreas$ = this.dataPersistence.fetch(
    LearningAreasActionTypes.LoadLearningAreas,
    {
      run: (action: LoadLearningAreas, state: any) => {
        if (!action.payload.force && state.learningArea.loaded) return;
        return this.learningAreaService
          .getAll()
          .pipe(map(learningAreas => new LearningAreasLoaded({ learningAreas })));
      },
      onError: (action: LoadLearningAreas, error) => {
        return new LearningAreasLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<State>,
    @Inject(LEARNINGAREA_SERVICE_TOKEN)
    private learningAreaService: LearningAreaServiceInterface
  ) {}
}
