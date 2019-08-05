import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiCheckBoxTableComponent } from './multi-check-box-table.component';

describe('MultiCheckBoxTableComponent', () => {
  let component: MultiCheckBoxTableComponent;
  let fixture: ComponentFixture<MultiCheckBoxTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiCheckBoxTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiCheckBoxTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
