import { DragDropModule } from '@angular/cdk/drag-drop';
import { SimpleChanges } from '@angular/core';
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
import { FilterService, FILTER_SERVICE_TOKEN } from '@campus/utils';
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
  const mockOtherLearningAreas = [mockLearningAreas[1], mockLearningAreas[2]];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UiModule,
        RouterTestingModule,
        MatIconModule,
        MatInputModule,
        FormsModule,
        NoopAnimationsModule,
        DragDropModule
      ],
      declarations: [AreasListComponent],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: FILTER_SERVICE_TOKEN, useClass: FilterService }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasListComponent);
    component = fixture.componentInstance;

    component.connectedDropList = 'foo';
    component.learningAreas = mockLearningAreas;
    component.favoriteLearningAreas = mockFavoriteLearningAreas;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show only show learning areas that are not marked as favorite', () => {
    // fake an update to the favorites[]
    const changes = {
      favoriteLearningAreas: []
    };
    component.ngOnChanges((changes as unknown) as SimpleChanges);
    //update the view
    fixture.detectChanges();

    const areas = fixture.debugElement.queryAll(
      By.css('.pages-edu-contents-areas-list__area')
    );

    for (let i = 0; i < mockOtherLearningAreas.length; i++) {
      const areaModel = mockOtherLearningAreas[i];
      const area = areas[i];
      const areaIcon = area.query(By.css('mat-icon')).componentInstance.svgIcon;
      const areaText = area.query(By.css('a')).nativeElement.textContent;

      expect(areaIcon).toBe(areaModel.icon);
      expect(areaText).toBe(areaModel.name);
    }
  });

  it('should filter the learning areas correctly', async(() => {
    component.filterTextInput.setValue('kunde');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const expectedAreas = [mockLearningAreas[2]];
      const areas = fixture.debugElement.queryAll(
        By.css('.pages-edu-contents-areas-list__area')
      );

      areas.forEach((area, index) => {
        const areaModel = expectedAreas[index];
        const areaText = area.query(By.css('a')).nativeElement.textContent;

        expect(areaText).toBe(areaModel.name);
      });
    });
  }));
});
