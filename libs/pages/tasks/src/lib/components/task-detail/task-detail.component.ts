import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  EduContent,
  LearningAreaInterface,
  TaskEduContentInterface
} from '@campus/dal';
import {
  FilterTextInputComponent,
  ListFormat,
  ListViewComponent,
  SideSheetComponent
} from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TasksViewModel } from '../tasks.viewmodel';
import { TaskWithInfoInterface } from '../tasks.viewmodel.interfaces';

@Component({
  selector: 'campus-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription;
  listFormat: typeof ListFormat;

  //input streams
  routerParams$: Observable<Params>;

  //output streams
  listFormat$: Observable<ListFormat>;
  learningArea$: Observable<LearningAreaInterface>;
  taskInfo$: Observable<TaskWithInfoInterface>;

  //viewChildren
  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    TaskWithInfoInterface,
    TaskEduContentInterface
  >;

  list: ListViewComponent<EduContent>;
  @ViewChild('taskInstanceListview')
  set listViewComponent(list: ListViewComponent<EduContent>) {
    this.list = list;
  }

  private sideSheet: SideSheetComponent;
  @ViewChild('taskInstanceSidesheet')
  set sideSheetComponent(sidesheet: SideSheetComponent) {
    this.sideSheet = sidesheet;
  }

  constructor(
    private taskViewModel: TasksViewModel,
    private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  //life cycle hooks
  ngOnInit(): void {
    this.initializeProperties();
    this.loadInputParams();
    this.loadOutputStreams();
    this.setupAlertsSubscription();
  }

  ngAfterViewInit(): void {
    this.setupListSubscription();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  //initializer methods
  private initializeProperties(): void {
    this.subscriptions = new Subscription();
    this.listFormat = ListFormat;
  }

  private loadInputParams(): void {
    this.routerParams$ = this.activatedRoute.params;
  }

  private loadOutputStreams(): void {
    this.listFormat$ = this.taskViewModel.listFormat$;
    this.learningArea$ = this.getLearningArea();
    this.taskInfo$ = this.getTaskInfo();
    this.filterTextInput.setFilterableItem(this);
  }

  private setupAlertsSubscription(): void {
    this.subscriptions.add(
      this.routerParams$.subscribe(params =>
        this.taskViewModel.setTaskAlertRead(+params.task)
      )
    );
  }

  private setupListSubscription(): void {
    if (!this.list) return;
    this.subscriptions.add(
      this.list.selectedItems$.subscribe((selectedItems: EduContent[]) => {
        if (selectedItems.length > 0) {
          this.sideSheet.toggle(true);
        }
      })
    );

    // Needed to avoid ExpressionChangedAfterItHasBeenCheckedError
    this.changeDetector.detectChanges();
  }

  //stream getters
  private getLearningArea(): Observable<LearningAreaInterface> {
    return this.routerParams$.pipe(
      switchMap(params => {
        return this.taskViewModel.getLearningAreaById(+params.area);
      })
    );
  }

  private getTaskInfo(): Observable<TaskWithInfoInterface> {
    return this.routerParams$.pipe(
      switchMap(params => {
        return this.taskViewModel.getTaskWithInfo(+params.task);
      })
    );
  }

  //event handlers
  clickChangeListFormat(format: ListFormat): void {
    this.taskViewModel.changeListFormat(format);
  }

  clickOpenContent(taskEduContent: TaskEduContentInterface): void {
    this.taskViewModel.startExercise(taskEduContent);
  }

  //filterFunction
  filterFn(
    info: TaskWithInfoInterface,
    searchText: string
  ): TaskEduContentInterface[] {
    if (this.list) {
      this.list.deselectAllItems();
    }
    return this.filterService.filter(info.taskEduContents, {
      eduContent: { publishedEduContentMetadata: { title: searchText } }
    });
  }
}
