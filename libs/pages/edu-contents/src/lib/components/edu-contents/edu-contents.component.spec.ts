import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UiModule } from '@campus/ui';
import { EduContentLearningAreaOverviewComponent } from './edu-contents.component';

describe('EduContentLearningAreaOverviewComponent', () => {
  let component: EduContentLearningAreaOverviewComponent;
  let fixture: ComponentFixture<EduContentLearningAreaOverviewComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, NoopAnimationsModule],
      declarations: [EduContentLearningAreaOverviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentLearningAreaOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
