import { Inject, Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import {
  BundleInterface,
  EduContent,
  EffectFeedbackInterface,
  FavoriteInterface,
  HistoryInterface,
  LearningAreaInterface,
  TaskInterface
} from '@campus/dal';
import { Observable } from 'rxjs';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '../../content/open-static-content.interface';
import {
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '../../scorm/scorm-exercise.service.interface';
import { QuickLinkTypeEnum } from './quick-link-type.enum';

@Injectable()
export class QuickLinkViewModel {
  constructor(
    private router: Router,
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface,
    @Inject(SCORM_EXERCISE_SERVICE_TOKEN)
    private scormExerciseService: ScormExerciseServiceInterface
  ) {}

  public quickLinks$: Observable<HistoryInterface[] | FavoriteInterface[]>;
  public feedback$: Observable<EffectFeedbackInterface>;
  public update(id: number, name: string, mode: QuickLinkTypeEnum): void {}
  public delete(id: number, mode: QuickLinkTypeEnum): void {}

  public openBundle(bundle: BundleInterface) {
    this.router.navigate(['/bundles', bundle.learningAreaId, bundle.id]);
  }

  public openTask(task: TaskInterface) {
    this.router.navigate(['/tasks', task.learningAreaId, task.id]);
  }

  public openArea(area: LearningAreaInterface) {
    this.router.navigate(['/edu-content', area.id]);
  }

  public openStaticContent(eduContent: EduContent, stream?: boolean) {
    this.openStaticContentService.open(eduContent, stream);
  }

  public openExercise(eduContent: EduContent, withSolution?: boolean) {
    this.scormExerciseService.previewExerciseFromUnlockedContent(
      null,
      eduContent.id,
      null,
      !!withSolution
    );
  }

  public openSearch(
    quickLink: FavoriteInterface | HistoryInterface,
    type: QuickLinkTypeEnum
  ) {
    let queryParams: Params;
    switch (type) {
      case QuickLinkTypeEnum.FAVORITES:
        queryParams = { favorite_id: quickLink.id };
        break;
      case QuickLinkTypeEnum.HISTORY:
        queryParams = { history_id: quickLink.id };
        break;
    }
    this.router.navigate(['/edu-content', quickLink.learningAreaId, 'term'], {
      queryParams
    });
  }
}
