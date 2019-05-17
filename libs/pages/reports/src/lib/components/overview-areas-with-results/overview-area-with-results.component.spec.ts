import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { LearningAreaFixture } from '@campus/dal';
import { MockMatIconRegistry } from '@campus/testing';
import { ListFormat, UiModule } from '@campus/ui';
import {
  FilterService,
  FilterServiceInterface,
  FILTER_SERVICE_TOKEN
} from '@campus/utils';
import { BehaviorSubject } from 'rxjs';
import { ReportsViewModel } from '../reports.viewmodel';
import { MockReportsViewModel } from '../reports.viewmodel.mock';
import { LearningAreasWithResultsInterface } from './../reports.viewmodel.interfaces';
import { OverviewAreaWithResultsComponent } from './overview-area-with-results.component';

describe('OverviewAreaWithResultsComponent', () => {
  let component: OverviewAreaWithResultsComponent;
  let reportsViewModel: ReportsViewModel;
  let fixture: ComponentFixture<OverviewAreaWithResultsComponent>;
  let filterService: FilterServiceInterface;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, MatIconModule, RouterTestingModule],
      declarations: [OverviewAreaWithResultsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FILTER_SERVICE_TOKEN, useClass: FilterService },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: ReportsViewModel, useClass: MockReportsViewModel }
      ]
    });
    reportsViewModel = TestBed.get(ReportsViewModel);
    filterService = TestBed.get(FILTER_SERVICE_TOKEN);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewAreaWithResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the viewModel changeListFormat method when calling clickChangeListFormat', () => {
    const spy = jest.spyOn(reportsViewModel, 'changeListFormat');
    component.clickChangeListFormat(ListFormat.GRID);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(ListFormat.GRID);
  });

  it('should call vm.filterFn when filterTextInput is changed', () => {
    const filterText = 'foo';
    const spy = jest.spyOn(filterService, 'filter');
    component.filterTextInput.setValue(filterText);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(jasmine.anything(), {
      learningArea: { name: filterText }
    });
  });

  it('should show the correct text for no results', () => {
    component.filterTextInput.setValue(
      'a random string that will not return any results'
    );
    fixture.detectChanges();
    const errorMessage = 'Er zijn nog geen resultaten beschikbaar.';

    const componentEl = fixture.nativeElement;
    expect(componentEl.textContent).toContain(errorMessage);
  });

  it('should not show the text for no results when results are present', () => {
    component.filterTextInput.setValue('');
    fixture.detectChanges();
    const errorMessage = 'Er zijn nog geen resultaten beschikbaar.';

    const componentEl = fixture.nativeElement;
    const contains = componentEl.textContent.includes(errorMessage);
    expect(contains).toBeFalsy();
  });

  it('should show the correct number of items', () => {
    let folders = fixture.debugElement.queryAll(By.css('campus-folder'));
    component.filterTextInput.setValue('');
    fixture.detectChanges();
    expect(folders.length).toBe(2);
    component.filterTextInput.setValue('a');
    fixture.detectChanges();
    folders = fixture.debugElement.queryAll(By.css('campus-folder'));
    expect(folders.length).toBe(1);
  });

  it('should show the correct data in the foldercomponent', () => {
    const mockLearningArea = {
      learningArea: new LearningAreaFixture({ id: 1, name: 'wiskunde' }),
      tasksWithResultsCount: 42,
      bundlesWithResultsCount: 12
    };

    const mockLearningAreasWithResults = {
      learningAreas: [mockLearningArea]
    };

    const vmStream = reportsViewModel.learningAreasWithResults$ as BehaviorSubject<
      LearningAreasWithResultsInterface
    >;
    vmStream.next(mockLearningAreasWithResults);

    fixture.detectChanges();

    const folderDE = fixture.debugElement.query(By.css('campus-folder'));
    const folder = folderDE.componentInstance;

    expect(folder.backgroundColor).toEqual(mockLearningArea.learningArea.color);
    expect(folder.icon).toEqual(mockLearningArea.learningArea.icon);
    expect(folder.title).toEqual(mockLearningArea.learningArea.name);
    expect(folder.itemCount).toEqual(
      mockLearningArea.tasksWithResultsCount +
        mockLearningArea.bundlesWithResultsCount
    );
    expect(
      folderDE.nativeElement.getAttribute('ng-reflect-router-link')
    ).toEqual(mockLearningArea.learningArea.id.toString());
  });

  it('should show the correct number of tasks/bundles in the folder detail', () => {
    const mockLearningArea = {
      learningArea: new LearningAreaFixture({ id: 1, name: 'wiskunde' }),
      tasksWithResultsCount: 42,
      bundlesWithResultsCount: 12
    };

    const mockLearningAreasWithResults = {
      learningAreas: [mockLearningArea]
    };

    const vmStream = reportsViewModel.learningAreasWithResults$ as BehaviorSubject<
      LearningAreasWithResultsInterface
    >;
    vmStream.next(mockLearningAreasWithResults);

    fixture.detectChanges();

    const folderDetails = fixture.debugElement.query(
      By.css('campus-folder-details')
    );
    expect(folderDetails.children[0].nativeElement.textContent).toContain(
      'Taken: ' +
        mockLearningAreasWithResults.learningAreas[0].tasksWithResultsCount
    );
    expect(folderDetails.children[1].nativeElement.textContent).toContain(
      'Bundels: ' +
        mockLearningAreasWithResults.learningAreas[0].bundlesWithResultsCount
    );
  });
});
