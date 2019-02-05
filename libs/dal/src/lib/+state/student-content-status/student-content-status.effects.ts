import { Inject, Injectable } from '@angular/core';
import { StudentContentStatusInterface } from '@campus/dal';
import { Actions, Effect } from '@ngrx/effects';
import { select } from '@ngrx/store';
import { DataPersistence } from '@nrwl/nx';
import { undo } from 'ngrx-undo';
import { from, Observable } from 'rxjs';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { StudentContentStatusQueries } from '.';
import {
  StudentContentStatusServiceInterface,
  STUDENT_CONTENT_STATUS_SERVICE_TOKEN
} from '../../student-content-status/student-content-status.service.interface';
import { DalState } from '../dal.state.interface';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import {
  AddStudentContentStatus,
  LoadStudentContentStatuses,
  StudentContentStatusAdded,
  StudentContentStatusesActionTypes,
  StudentContentStatusesLoaded,
  StudentContentStatusesLoadError,
  UpdateStudentContentStatus,
  UpsertStudentContentStatus
} from './student-content-status.actions';

@Injectable()
export class StudentContentStatusesEffects {
  @Effect()
  loadStudentContentStatuses$ = this.dataPersistence.fetch(
    StudentContentStatusesActionTypes.LoadStudentContentStatuses,
    {
      run: (action: LoadStudentContentStatuses, state: DalState) => {
        if (!action.payload.force && state.studentContentStatuses.loaded)
          return;

        return this.studentContentStatusService
          .getAllByStudentId(action.payload.studentId)
          .pipe(
            map(
              studentContentStatuses =>
                new StudentContentStatusesLoaded({ studentContentStatuses })
            )
          );
      },
      onError: (action: LoadStudentContentStatuses, error) => {
        return new StudentContentStatusesLoadError(error);
      }
    }
  );

  @Effect()
  updateStudentContentStatus$ = this.dataPersistence.optimisticUpdate(
    StudentContentStatusesActionTypes.UpdateStudentContentStatus,
    {
      run: (action: UpdateStudentContentStatus, state: DalState) => {
        const statusId = <number>action.payload.studentContentStatus.id;

        const newValue: StudentContentStatusInterface = {
          ...{ id: statusId },
          ...action.payload.studentContentStatus.changes
        };

        return this.studentContentStatusService
          .updateStudentContentStatus(newValue)
          .pipe(
            map(() => {
              const effectFeedback = new EffectFeedback({
                id: this.uuid(),
                triggerAction: action,
                message: 'Status is aangepast.',
                type: 'success',
                display: true,
                priority: Priority.NORM
              });

              return new EffectFeedbackActions.AddEffectFeedback({
                effectFeedback
              });
            })
          );
      },
      undoAction: (action: UpdateStudentContentStatus, error: any) => {
        const undoAction = undo(action);
        const effectFeedback = new EffectFeedback({
          id: this.uuid(),
          triggerAction: action,
          message: 'Status kon niet worden aangepast.',
          type: 'error',
          userActions: [{ title: 'Opnieuw proberen', userAction: action }],
          display: true,
          priority: Priority.HIGH
        });
        const effectFeedbackAction = new EffectFeedbackActions.AddEffectFeedback(
          { effectFeedback }
        );
        return from([undoAction, effectFeedbackAction]);
      }
    }
  );

  @Effect()
  addStudentContentStatuses$ = this.dataPersistence.pessimisticUpdate(
    StudentContentStatusesActionTypes.AddStudentContentStatus,
    {
      run: (action: AddStudentContentStatus, state: DalState) => {
        const newValue = action.payload.studentContentStatus;

        return this.studentContentStatusService
          .addStudentContentStatus(newValue)
          .pipe(
            switchMap(studentContentStatus => {
              const effectFeedback = new EffectFeedback({
                id: this.uuid(),
                triggerAction: action,
                message: 'Status is aangepast.'
              });
              const effectFeedbackAction = new EffectFeedbackActions.AddEffectFeedback(
                { effectFeedback }
              );
              const studentContentStatusAddedAction = new StudentContentStatusAdded(
                { studentContentStatus }
              );

              return from([
                studentContentStatusAddedAction,
                effectFeedbackAction
              ]);
            })
          );
      },
      onError: (action: AddStudentContentStatus, error: any) => {
        const effectFeedback = new EffectFeedback({
          id: this.uuid(),
          triggerAction: action,
          message: 'Status kon niet worden aangepast.',
          type: 'error',
          userActions: [{ title: 'Opnieuw proberen', userAction: action }],
          priority: Priority.HIGH
        });
        return new EffectFeedbackActions.AddEffectFeedback({ effectFeedback });
      }
    }
  );

  @Effect()
  upsertStudentContentStatus$ = this.dataPersistence.pessimisticUpdate(
    StudentContentStatusesActionTypes.UpsertStudentContentStatus,
    {
      run: (action: UpsertStudentContentStatus, state: DalState) => {
        return this.dataPersistence.store.pipe(
          selectByBundleOrTask(action.payload.studentContentStatus),
          concatMap(insertOrUpdate),
          concatMap(studentContentStatus => {
            const studentContentStatusAddedAction = new StudentContentStatusAdded(
              { studentContentStatus }
            );

            const effectFeedback = new EffectFeedback({
              id: this.uuid(),
              triggerAction: action,
              message: 'Status is aangepast.'
            });
            const effectFeedbackAction = new EffectFeedbackActions.AddEffectFeedback(
              { effectFeedback }
            );

            return from([
              studentContentStatusAddedAction,
              effectFeedbackAction
            ]);
          })
        );

        function selectByBundleOrTask({
          unlockedContentId,
          taskEduContentId
        }: StudentContentStatusInterface) {
          if (unlockedContentId) {
            return select(StudentContentStatusQueries.getByUnlockedContentId, {
              unlockedContentId
            });
          }
          return select(StudentContentStatusQueries.getByTaskEduContentId, {
            taskEduContentId
          });
        }

        function insertOrUpdate(
          existing: StudentContentStatusInterface
        ): Observable<StudentContentStatusInterface> {
          if (existing) {
            return this.studentContentStatusService.updateStudentContentStatus({
              ...action.payload.studentContentStatus,
              id: existing.id
            });
          }
          return this.studentContentStatusService.addStudentContentStatus({
            ...action.payload.studentContentStatus
          });
        }
      },
      onError: (action: UpsertStudentContentStatus, error: any) => {
        const effectFeedback = new EffectFeedback({
          id: this.uuid(),
          triggerAction: action,
          message: 'Status kon niet worden aangepast.',
          type: 'error',
          userActions: [{ title: 'Opnieuw proberen', userAction: action }],
          priority: Priority.HIGH
        });
        return new EffectFeedbackActions.AddEffectFeedback({ effectFeedback });
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(STUDENT_CONTENT_STATUS_SERVICE_TOKEN)
    private studentContentStatusService: StudentContentStatusServiceInterface,
    @Inject('uuid') private uuid: Function
  ) {}
}
