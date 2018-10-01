import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentActionButtonComponent } from './content-action-button.component';

describe('ContentActionButtonComponent', () => {
  let component: ContentActionButtonComponent;
  let fixture: ComponentFixture<ContentActionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentActionButtonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
