import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducontentPreviewComponent } from './educontent-preview.component';

describe('EducontentPreviewComponent', () => {
  let component: EducontentPreviewComponent;
  let fixture: ComponentFixture<EducontentPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducontentPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducontentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
