import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { CheckboxLineFilterComponent } from './checkbox-line-filter-component';

describe('CheckboxLineFilterComponent', () => {
  let component: CheckboxLineFilterComponent;
  let fixture: ComponentFixture<CheckboxLineFilterComponent>;

  const selectFilter = {
    name: 'selectFilter',
    label: 'select filter',
    keyProperty: 'id',
    displayProperty: 'name',
    values: [
      {
        data: {
          id: 1,
          name: 'foo'
        },
        selected: false,
        prediction: 0,
        visible: true,
        child: null
      },
      {
        data: {
          id: 2,
          name: 'bar'
        },
        selected: false,
        prediction: 0,
        visible: true,
        child: null
      }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxLineFilterComponent],
      imports: [MatCheckboxModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxLineFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 2 items', () => {
    component.filterCriteria = selectFilter;
    fixture.detectChanges();
    const checkboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
    expect(checkboxes.length).toBe(2);
  });
});
