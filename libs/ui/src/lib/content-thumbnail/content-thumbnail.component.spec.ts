import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentThumbnailComponent } from './content-thumbnail.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ContentThumbnailComponent', () => {
  let component: ContentThumbnailComponent;
  let fixture: ComponentFixture<ContentThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentThumbnailComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
