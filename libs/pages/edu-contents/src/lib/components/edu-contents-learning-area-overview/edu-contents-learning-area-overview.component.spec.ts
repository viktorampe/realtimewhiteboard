import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FavoriteAreasComponent } from '@campus/pages/edu-contents';
import { UiModule } from '@campus/ui';
import { EduContentLearningAreaOverviewComponent } from './edu-contents-learning-area-overview.component';

describe('EduContentLearningAreaOverviewComponent', () => {
  let component: EduContentLearningAreaOverviewComponent;
  let fixture: ComponentFixture<EduContentLearningAreaOverviewComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule, NoopAnimationsModule],
      declarations: [
        EduContentLearningAreaOverviewComponent,
        FavoriteAreasComponent
      ]
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
