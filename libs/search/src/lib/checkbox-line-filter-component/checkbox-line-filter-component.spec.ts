import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
      declarations: [CheckboxLineFilterComponent]
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
    component.filterCriteria = this.filterCriteria;
    fixture.detectChanges();
    console.log(component.filterCriteria);
    console.log(fixture.debugElement.children);
    expect(fixture.debugElement.children);
  });
});
