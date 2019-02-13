import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFilterComponentComponent } from './select-filter-component.component';

describe('SelectFilterComponentComponent', () => {
  let component: SelectFilterComponentComponent;
  let fixture: ComponentFixture<SelectFilterComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectFilterComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFilterComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
