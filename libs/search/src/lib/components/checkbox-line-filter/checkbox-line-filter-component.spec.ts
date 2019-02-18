import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckbox, MatCheckboxModule } from '@angular/material';
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

    component.filterCriteria = {
      name: 'selectFilter',
      label: 'select filter',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [
        {
          data: {
            id: 1,
            name: 'Aardrijkskunde'
          },
          selected: false,
          prediction: 0,
          visible: true,
          child: null
        },
        {
          data: {
            id: 2,
            name: 'Geschiedenis'
          },
          selected: false,
          prediction: 1,
          visible: true,
          child: null
        },
        {
          data: {
            id: 3,
            name: 'Wiskunde'
          },
          selected: true,
          prediction: 1,
          visible: true,
          child: null
        },
        {
          data: {
            id: 4,
            name: 'Informatica'
          },
          selected: false,
          prediction: 1,
          visible: false,
          child: null
        },
        {
          data: {
            id: 5,
            name: 'Engels'
          },
          selected: false,
          prediction: 0,
          visible: true,
          child: null
        }
      ]
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have this correct number of items', () => {
    const checkboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
    expect(checkboxes.length).toBe(4);
  });

  it('should have this correct number of disabled items', () => {
    const checkboxes = fixture.debugElement.queryAll(
      By.css('.mat-checkbox-disabled')
    );
    expect(checkboxes.length).toBe(2);
  });

  it('should emit the updated filtercriterium the selection changes', () => {
    spyOn(component.filterSelectionChange, 'emit');
    const checkbox: MatCheckbox = fixture.debugElement.query(
      By.css('mat-checkbox')
    ).componentInstance;
    component.itemChanged(checkbox.value);

    const expected = {
      ...component.filterCriteria,
      ...{
        values: component.filterCriteria.values.map(value => ({ ...value }))
      }
    };
    expected.values[0].selected = true;

    expect(component.filterSelectionChange.emit).toHaveBeenCalled();
    expect(component.filterSelectionChange.emit).toHaveBeenCalledTimes(1);
    expect(component.filterSelectionChange.emit).toHaveBeenCalledWith(expected);
  });
});
