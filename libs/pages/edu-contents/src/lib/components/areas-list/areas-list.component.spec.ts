import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MatIconModule,
  MatIconRegistry,
  MatInputModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LearningAreaFixture } from '@campus/dal';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { AreasListComponent } from './areas-list.component';

describe('AreasListComponent', () => {
  let component: AreasListComponent;
  let fixture: ComponentFixture<AreasListComponent>;

  const mockLearningAreas = [
    new LearningAreaFixture({
      name: 'Wiskunde',
      icon: 'polpo-wiskunde',
      id: 1
    }),
    new LearningAreaFixture({
      name: 'Wetenschappen',
      icon: 'polpo-natuurwetenschappen',
      id: 2
    }),
    new LearningAreaFixture({
      name: 'Bertkunde',
      icon: 'polpo-techniek',
      id: 3
    })
  ];

  const mockFavoriteLearningAreas = [mockLearningAreas[0]];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UiModule,
        RouterTestingModule,
        MatIconModule,
        MatInputModule,
        FormsModule,
        NoopAnimationsModule
      ],
      declarations: [AreasListComponent],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasListComponent);
    component = fixture.componentInstance;

    component.learningAreas = mockLearningAreas;
    component.favoriteLearningAreas = mockFavoriteLearningAreas;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the learning areas correctly', () => {
    const areas = fixture.debugElement.queryAll(
      By.css('.pages-edu-contents-areas-list__area')
    );

    for (let i = 0; i < mockLearningAreas.length; i++) {
      const areaModel = mockLearningAreas[i];
      const area = areas[i];
      const areaIcon = area.query(By.css('mat-icon')).componentInstance.svgIcon;
      const areaText = area.query(By.css('a')).nativeElement.textContent;

      //Check if the learning area is a favorite one
      if (mockFavoriteLearningAreas.indexOf(areaModel) !== -1) {
        //Check if it has the correct class
        expect(area.nativeElement.classList).toContain(
          'pages-edu-contents-areas-list__area--favorite'
        );
      }

      expect(areaIcon).toBe('learning-area:' + areaModel.icon);
      expect(areaText).toBe(areaModel.name);
    }
  });

  it('should filter the learning areas correctly', () => {
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'kunde';
    input.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const expectedAreas = [mockLearningAreas[0], mockLearningAreas[2]];
    const areas = fixture.debugElement.queryAll(
      By.css('.pages-edu-contents-areas-list__area')
    );

    areas.forEach((area, index) => {
      const areaModel = expectedAreas[index];
      const areaText = area.query(By.css('a')).nativeElement.textContent;

      expect(areaText).toBe(areaModel.name);
    });
  });
});
