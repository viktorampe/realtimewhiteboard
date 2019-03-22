import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LearningAreaFixture } from '@campus/dal';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { FavoriteAreasComponent } from './favorite-areas.component';

describe('FavoriteAreasComponent', () => {
  let component: FavoriteAreasComponent;
  let fixture: ComponentFixture<FavoriteAreasComponent>;

  const mockLearningAreas = [
    new LearningAreaFixture({
      name: 'Wiskunde',
      icon: 'polpo-wiskunde',
      color: '#2c354f',
      id: 1
    }),
    new LearningAreaFixture({
      name: 'Wetenschappen',
      icon: 'polpo-natuurwetenschappen',
      color: '#53463c',
      id: 2
    })
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, NoopAnimationsModule, MatIconModule],
      declarations: [FavoriteAreasComponent],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteAreasComponent);
    component = fixture.componentInstance;

    component.favoriteLearningAreas = mockLearningAreas;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
