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
  EduContent,
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
import { switchMap } from 'rxjs/operators';
import { MockTasksViewModel } from '../tasks.viewmodel.mock';

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
  contents$: Observable<EduContent[]>;

  //viewChildren
  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<EduContent[], EduContent>;

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
    private taskViewModel: MockTasksViewModel, // TODO replace by TasksViewModel
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
    this.learningArea$ = this.getLearningArea();
    this.taskInstance$ = this.getTaskInstance();
    this.contents$ = this.getContents();
    this.filterTextInput.setFilterableItem(this);
  }

  private setupListSubscription(): void {
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
        return this.taskViewModel.getLearningAreaById(params.area);
      })
    );
  }

  private getTaskInstance(): Observable<TaskInstanceInterface> {
    return this.routerParams$.pipe(
      switchMap(params => {
        return this.taskViewModel.getTaskById(params.task);
      })
    );
  }

  private getContents(): Observable<EduContent[]> {
    return this.routerParams$.pipe(
      // TODO check actual viewmodel method name
      switchMap(params => this.taskViewModel.getTaskEduContents(params.task))
    );
  }

  //event handlers
  clickChangeListFormat(format: ListFormat): void {
    this.taskViewModel.changeListFormat(format);
  }

  clickOpenContent(content: EduContent): void {
    //TODO contact viewmodel to open new window
    console.log('%cclickOpenContent:', 'color: orange; font-weight: bold;');
    console.log({ content });
  }

  //filterFunction
  filterFn(info: EduContent[], searchText: string): EduContent[] {
    if (this.list) {
      this.list.deselectAllItems();
    }
    return this.filterService.filter(info, {
      name: searchText
    });
  }
}
