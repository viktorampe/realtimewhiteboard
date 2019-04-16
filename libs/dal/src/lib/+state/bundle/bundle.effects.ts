import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UnlockedContentInterface } from '../../+models';
import {
  BundleServiceInterface,
  BUNDLE_SERVICE_TOKEN
} from '../../bundle/bundle.service.interface';
import { DalState } from '../dal.state.interface';
import { EffectFeedback, Priority } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import { AddUnlockedContent } from '../unlocked-content/unlocked-content.actions';
import {
  BundlesActionTypes,
  BundlesLoaded,
  BundlesLoadError,
  LinkEduContent,
  LoadBundles
} from './bundle.actions';

@Injectable()
export class BundlesEffects {
  @Effect()
  loadBundles$ = this.dataPersistence.fetch(BundlesActionTypes.LoadBundles, {
    run: (action: LoadBundles, state: DalState) => {
      if (!action.payload.force && state.bundles.loaded) return;
      return this.bundleService
        .getAllForUser(action.payload.userId)
        .pipe(map(bundles => new BundlesLoaded({ bundles })));
    },
    onError: (action: LoadBundles, error) => {
      return new BundlesLoadError(error);
    }
  });

  @Effect()
  linkEduContent$ = this.dataPersistence.fetch(
    BundlesActionTypes.LinkEduContent,
    {
      run: (action: LinkEduContent, state: DalState) => {
        return this.bundleService
          .linkEduContent(action.payload.bundleId, [
            action.payload.eduContentId
          ])
          .pipe(
            switchMap((unlockedContents: UnlockedContentInterface[]) => {
              const actions = unlockedContents.map(
                unlockedContent => new AddUnlockedContent({ unlockedContent })
              );
              return from(actions);
            })
          );
      },
      onError: (action: LinkEduContent, error) => {
        const effectFeedback = new EffectFeedback({
          id: this.uuid(),
          triggerAction: action,
          message:
            'Het is niet gelukt om het lesmateriaal aan de bundel toe te voegen.',
          type: 'error',
          userActions: [
            {
              title: 'Opniew proberen',
              userAction: action
            }
          ],
          priority: Priority.HIGH
        });

        return new AddEffectFeedback({ effectFeedback });
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(BUNDLE_SERVICE_TOKEN) private bundleService: BundleServiceInterface,
    @Inject('uuid') private uuid: Function
  ) {}
}
