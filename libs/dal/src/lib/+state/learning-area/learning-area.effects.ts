import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  LearningAreaServiceInterface,
  LEARNINGAREA_SERVICE_TOKEN
} from '../../learning-area/learning-area.service.interface';
import {
  LearningAreasActionTypes,
  LearningAreasLoaded,
  LearningAreasLoadError,
  LoadLearningAreas
} from './learning-area.actions';
import { State } from './learning-area.reducer';

@Injectable()
export class LearningAreasEffects {
  @Effect()
  loadLearningAreas$ = this.dataPersistence.fetch(
    LearningAreasActionTypes.LoadLearningAreas,
    {
      run: (action: LoadLearningAreas, state: any) => {
        if (!action.payload.force && state.learningAreas.loaded) return;
        return this.learningAreaService
          .getAll()
          .pipe(
            map(learningAreas => new LearningAreasLoaded({ learningAreas }))
          );
      },
      onError: (action: LoadLearningAreas, error) => {
        console.log({ error });
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
