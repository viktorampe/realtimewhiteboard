import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentThumbnailComponent } from './content-thumbnail.component';

describe('ContentThumbnailComponent', () => {
  let component: ContentThumbnailComponent;
  let fixture: ComponentFixture<ContentThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentThumbnailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
