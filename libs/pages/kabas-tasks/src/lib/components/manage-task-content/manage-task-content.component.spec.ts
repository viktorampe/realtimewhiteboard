import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from '../kabas-tasks.viewmodel.mock';
import { ManageTaskContentComponent } from './manage-task-content.component';

describe('ManageTaskContentComponent', () => {
  let component: ManageTaskContentComponent;
  let fixture: ComponentFixture<ManageTaskContentComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, NoopAnimationsModule],
      declarations: [ManageTaskContentComponent],
      providers: [
        { provide: KabasTasksViewModel, useClass: MockKabasTasksViewModel },
        {
          provide: MatIconRegistry,
          useClass: MockMatIconRegistry
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTaskContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
