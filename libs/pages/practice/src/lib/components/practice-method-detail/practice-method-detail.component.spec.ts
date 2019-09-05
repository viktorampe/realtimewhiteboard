import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeMethodDetailComponent } from './practice-method-detail.component';

describe('PracticeMethodDetailComponent', () => {
  let component: PracticeMethodDetailComponent;
  let fixture: ComponentFixture<PracticeMethodDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeMethodDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeMethodDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
