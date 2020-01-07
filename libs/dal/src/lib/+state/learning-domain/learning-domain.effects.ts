import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  LearningDomainServiceInterface,
  LEARNING_DOMAIN_SERVICE_TOKEN
} from '../../metadata/learning-domain.service.interface';
import {
  LearningDomainsActionTypes,
  LearningDomainsLoaded,
  LearningDomainsLoadError,
  LoadLearningDomains
} from './learning-domain.actions';

@Injectable()
export class LearningDomainEffects {
  @Effect()
  loadLearningDomains$ = this.dataPersistence.fetch(
    LearningDomainsActionTypes.LoadLearningDomains,
    {
      run: (action: LoadLearningDomains, state: DalState) => {
        if (!action.payload.force && state.learningDomains.loaded) return;
        return this.learningDomainService
          .getAll()
          .pipe(
            map(
              learningDomains => new LearningDomainsLoaded({ learningDomains })
            )
          );
      },
      onError: (action: LoadLearningDomains, error) => {
        return new LearningDomainsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(LEARNING_DOMAIN_SERVICE_TOKEN)
    private learningDomainService: LearningDomainServiceInterface
  ) {}
}
