import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectModule, MatSlideToggleModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchModule } from '@campus/search';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from '../kabas-tasks.viewmodel.mock';
import { ManageKabasTasksDetailComponent } from './manage-kabas-tasks-detail.component';

describe('ManageKabasTasksDetailComponent', () => {
  let component: ManageKabasTasksDetailComponent;
  let fixture: ComponentFixture<ManageKabasTasksDetailComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSlideToggleModule,
        MatSelectModule,
        SearchModule,
        UiModule,
        NoopAnimationsModule
      ],
      declarations: [ManageKabasTasksDetailComponent],
      providers: [
        { provide: KabasTasksViewModel, useClass: MockKabasTasksViewModel }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageKabasTasksDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
