import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconModule,
  MatIconRegistry,
  MatListModule,
  MatTabsModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { hot } from '@nrwl/nx/testing';
import { BehaviorSubject } from 'rxjs';
import { KabasTasksViewModel } from './components/kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from './components/kabas-tasks.viewmodel.mock';
import { ManageKabasTasksOverviewComponent } from './manage-kabas-tasks-overview.component';
import { PagesKabasTasksModule } from './pages-kabas-tasks.module';

describe('ManageKabasTasksOverviewComponent', () => {
  let component: ManageKabasTasksOverviewComponent;
  let fixture: ComponentFixture<ManageKabasTasksOverviewComponent>;
  const queryParams: BehaviorSubject<Params> = new BehaviorSubject<Params>({});
  let kabasTasksViewModel: KabasTasksViewModel;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatListModule,
        MatTabsModule,
        MatIconModule,
        RouterTestingModule,
        SharedModule,
        PagesKabasTasksModule,
        UiModule
      ],
      declarations: [ManageKabasTasksOverviewComponent],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        { provide: ActivatedRoute, useValue: { queryParams } },
        { provide: KabasTasksViewModel, useClass: MockKabasTasksViewModel },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageKabasTasksOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageKabasTasksOverviewComponent);
    component = fixture.componentInstance;
    kabasTasksViewModel = TestBed.get(KabasTasksViewModel);
    router = TestBed.get(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(PagesKabasTasksModule).toBeDefined();
  });

  describe('tabs', () => {
    describe('onSelectedTabIndexChanged', () => {
      it('should navigate with the new tab index in the queryParams', () => {
        const tab = 1;

        component.onSelectedTabIndexChanged(tab);

        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith([], {
          queryParams: { tab }
        });
      });
    });
    it('should open correct tab when navigating with tab in queryParams', () => {
      const tab = 1;

      queryParams.next({ tab });

      expect(component.currentTab$).toBeObservable(hot('a', { a: tab }));
    });
  });
});
