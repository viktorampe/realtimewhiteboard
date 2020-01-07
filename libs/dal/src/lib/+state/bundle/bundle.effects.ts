import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UnlockedContentInterface } from '../../+models';
import {
  BundleServiceInterface,
  BUNDLE_SERVICE_TOKEN
} from '../../bundle/bundle.service.interface';
import { DalState } from '../dal.state.interface';
import { EffectFeedback } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import { AddUnlockedContent } from '../unlocked-content/unlocked-content.actions';
import {
  BundlesActionTypes,
  BundlesLoaded,
  BundlesLoadError,
  LinkEduContent,
  LinkUserContent,
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
  linkEduContent$ = this.dataPersistence.pessimisticUpdate(
    BundlesActionTypes.LinkEduContent,
    {
      run: (action: LinkEduContent, state: DalState) => {
        return this.bundleService
          .linkEduContent(action.payload.bundleId, [
            action.payload.eduContentId
          ])
          .pipe(
            switchMap((unlockedContents: UnlockedContentInterface[]) => {
              const actions: (
                | AddEffectFeedback
                | AddUnlockedContent)[] = unlockedContents.map(
                unlockedContent => new AddUnlockedContent({ unlockedContent })
              );
              const effectFeedback = EffectFeedback.generateSuccessFeedback(
                this.uuid(),
                action,
                'Het lesmateriaal is aan de bundel toegevoegd.'
              );
              actions.push(new AddEffectFeedback({ effectFeedback }));
              return from(actions);
            })
          );
      },
      onError: (action: LinkEduContent, error) => {
        return new AddEffectFeedback({
          effectFeedback: EffectFeedback.generateErrorFeedback(
            this.uuid(),
            action,
            'Het is niet gelukt om het lesmateriaal aan de bundel toe te voegen.'
          )
        });
      }
    }
  );
  @Effect()
  linkUserContent$ = this.dataPersistence.pessimisticUpdate(
    BundlesActionTypes.LinkUserContent,
    {
      run: (action: LinkUserContent, state: DalState) => {
        return this.bundleService
          .linkUserContent(action.payload.bundleId, [
            action.payload.userContentId
          ])
          .pipe(
            switchMap((unlockedContents: UnlockedContentInterface[]) => {
              const actions: (
                | AddEffectFeedback
                | AddUnlockedContent)[] = unlockedContents.map(
                unlockedContent => new AddUnlockedContent({ unlockedContent })
              );
              const effectFeedback = EffectFeedback.generateSuccessFeedback(
                this.uuid(),
                action,
                'Het eigen lesmateriaal is aan de bundel toegevoegd.'
              );
              actions.push(new AddEffectFeedback({ effectFeedback }));
              return from(actions);
            })
          );
      },
      onError: (action: LinkUserContent, error) => {
        return new AddEffectFeedback({
          effectFeedback: EffectFeedback.generateErrorFeedback(
            this.uuid(),
            action,
            'Het is niet gelukt om het eigen lesmateriaal aan de bundel toe te voegen.'
          )
        });
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
