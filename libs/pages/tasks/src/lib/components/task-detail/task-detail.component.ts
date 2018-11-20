import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  ContentInterface,
  LearningAreaInterface,
  TaskInstanceInterface
} from '@campus/dal';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/shared';
import {
  FilterTextInputComponent,
  ListFormat,
  ListViewComponent,
  SideSheetComponent
} from '@campus/ui';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TasksViewModel } from '../tasks.viewmodel';

@Component({
  selector: 'campus-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit, AfterViewInit {
  subscriptions: Subscription;
  listFormat: typeof ListFormat;

  //input streams
  routerParams$: Observable<Params>;

  //output streams
  listFormat$: Observable<ListFormat>;
  learningArea$: Observable<LearningAreaInterface>;
  taskInstance$: Observable<TaskInstanceInterface>;
  contents$: Observable<ContentInterface[]>;

  //viewChildren
  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<ContentInterface, ContentInterface>;

  list: ListViewComponent<ContentInterface>;
  @ViewChild('taskInstanceListview')
  set listViewComponent(list: ListViewComponent<ContentInterface>) {
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
  }

  ngAfterViewInit(): void {
    this.setupListSubscription();
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
    this.learningArea$ = this.getLearingArea();
    this.taskInstance$ = this.getTaskInstance();
    this.contents$ = this.getContents();
    this.filterTextInput.filterFn = this.filterFn.bind(this);
  }

  private setupListSubscription(): void {
    this.subscriptions.add(
      this.list.selectedItems$.subscribe(
        (selectedItems: ContentInterface[]) => {
          if (selectedItems.length > 0) {
            this.sideSheet.toggle(true);
          }
        }
      )
    );

    // Needed to avoid ExpressionChangedAfterItHasBeenCheckedError
    this.changeDetector.detectChanges();
  }

  //stream getters
  private getLearingArea(): Observable<LearningAreaInterface> {
    return this.routerParams$.pipe(
      switchMap(params => {
        //TODO change to getLearningAreaById when method exists in viewModel
        return this.taskViewModel.getMockSelectedLearningArea();
      })
    );
  }

  private getTaskInstance(): Observable<TaskInstanceInterface> {
    return this.routerParams$.pipe(
      switchMap(params => {
        //TODO change to getTaskInstanceById when method exists in viewModel
        return this.taskViewModel.getMockSelectedTaskInstance();
      })
    );
  }

  private getContents(): Observable<ContentInterface[]> {
    return this.routerParams$.pipe(
      //TODO may need to change to other operator
      map(params => {
        //TODO change to getTaskEducontentsByTaskId
        return this.taskViewModel.getMockTaskEducontents().map(
          taskEduContent =>
            //TODO replace by custom viewModel method, this is a testing placeholder
            <ContentInterface>{
              description: taskEduContent.task.description,
              name: taskEduContent.task.name,
              fileExtension: 'xls',
              methodLogos: ['fillerMethod'],
              productType: taskEduContent.eduContent.type
            }
        );
      })
    );
  }

  //event handlers
  clickChangeListFormat(format: ListFormat): void {
    this.taskViewModel.changeListFormat(format);
  }

  //filterFunction
  private filterFn(
    info: ContentInterface[],
    searchText: string
  ): ContentInterface[] {
    if (this.list) {
      this.list.deselectAllItems();
    }
    return this.filterService.filter(info, {
      name: searchText
    });
  }
}
