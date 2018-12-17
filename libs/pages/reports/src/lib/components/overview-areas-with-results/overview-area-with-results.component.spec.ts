import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MockActivatedRoute, MockMatIconRegistry } from '@campus/testing';
import { ListFormat, UiModule } from '@campus/ui';
import {
  FilterService,
  FilterServiceInterface,
  FILTER_SERVICE_TOKEN
} from '@campus/utils';
import { ReportsViewModel } from '../reports.viewmodel';
import { MockReportsViewModel } from '../reports.viewmodel.mock';
import { OverViewAreaWithResultsComponent } from './overview-area-with-results.component';

describe('OverViewAreaWithResultsComponent', () => {
  let component: OverViewAreaWithResultsComponent;
  let reportsViewModel: ReportsViewModel;
  let fixture: ComponentFixture<OverViewAreaWithResultsComponent>;
  let filterService: FilterServiceInterface;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, MatIconModule],
      declarations: [OverViewAreaWithResultsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FILTER_SERVICE_TOKEN, useClass: FilterService },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: ReportsViewModel, useClass: MockReportsViewModel }
      ]
    }).compileComponents();
    reportsViewModel = TestBed.get(ReportsViewModel);
    filterService = TestBed.get(FILTER_SERVICE_TOKEN);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverViewAreaWithResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the viewModel changeListFormat method when calling clickChangeListFormat', () => {
    const spy = jest.spyOn(MockReportsViewModel.prototype, 'changeListFormat');
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

  it('should show correct text for no results', () => {
    component.filterTextInput.setValue(
      'a random string that will not return any results'
    );
    fixture.detectChanges();
    const errorMessage = 'Er zijn nog geen resultaten beschikbaar.';

    const componentEl = fixture.nativeElement;
    expect(componentEl.textContent).toContain(errorMessage);
  });

  it('should not show text for no results when results are present', () => {
    component.filterTextInput.setValue('');
    fixture.detectChanges();
    const errorMessage = 'Er zijn nog geen resultaten beschikbaar.';

    const componentEl = fixture.nativeElement;
    const contains = componentEl.textContent.includes(errorMessage);
    expect(contains).toBeFalsy();
  });

  it('should show correct text for 1 results', () => {
    component.filterTextInput.setValue(
      'a random string that will not return any results'
    );
    fixture.detectChanges();
    const text =
      fixture.debugElement.children[0].children[2].children[1].nativeElement
        .textContent;
    expect(text).toContain('Er zijn nog geen resultaten beschikbaar.');
  });

  it('should show correct number of items', () => {
    const container = fixture.debugElement.children[0].children[2].children[1];
    component.filterTextInput.setValue('');
    fixture.detectChanges();
    expect(container.children[0].children.length).toBe(2);
    component.filterTextInput.setValue('a');
    fixture.detectChanges();
    expect(container.children[0].children.length).toBe(1);
  });
});
