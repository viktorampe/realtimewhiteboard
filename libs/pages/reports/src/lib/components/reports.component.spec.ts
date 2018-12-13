import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { MockMatIconRegistry } from '@campus/testing';
import {
  FilterService,
  FilterServiceInterface,
  FILTER_SERVICE_TOKEN
} from '@campus/utils';
import { ReportsComponent } from './reports.component';
import { ReportsViewModel } from './reports.viewmodel';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let reportsViewModel: ReportsViewModel;
  let fixture: ComponentFixture<ReportsComponent>;
  let filterService: FilterServiceInterface;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReportsViewModel,
        //{ provide: , useClass: MockViewModel },
        { provide: FILTER_SERVICE_TOKEN, useClass: FilterService },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ],
      declarations: [ReportsComponent]
    }).compileComponents();
    reportsViewModel = TestBed.get(ReportsViewModel);
    filterService = TestBed.get(FILTER_SERVICE_TOKEN);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the viewModel changeListFormat method when calling clickChangeListFormat', () => {
    const spy = jest.spyOn(ReportsViewModel, 'changeListFormat');
    component.setListFormat(ListFormat.GRID);
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

  it('should show correct text for 1 results', () => {
    component.filterTextInput.setValue(
      'a random string that will not return any results'
    );
    fixture.detectChanges();
    const text = fixture.debugElement.query(
      By.css('pages-reports__container__tasks-count')
    );
    expect(text.nativeElement.textContent).toContain('');
  });

  it('should show correct number of items', () => {
    const container = fixture.debugElement.query(
      By.css('pages-reports__container')
    );
    expect(container.children[0].children.length).toBe(2);
    component.filterTextInput.setValue(
      'a random string that will not return any results'
    );
    fixture.detectChanges();
    expect(container.children[0].children.length).toBe(0);
  });
});
