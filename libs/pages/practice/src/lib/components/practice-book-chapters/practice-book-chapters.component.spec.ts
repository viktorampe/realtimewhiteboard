import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeBookChaptersComponent } from './practice-book-chapters.component';

describe('PracticeBookChaptersComponent', () => {
  let component: PracticeBookChaptersComponent;
  let fixture: ComponentFixture<PracticeBookChaptersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeBookChaptersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeBookChaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
