import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { ContentThumbnailComponent } from './content-thumbnail.component';

describe('ContentThumbnailComponent', () => {
  let component: ContentThumbnailComponent;
  let fixture: ComponentFixture<ContentThumbnailComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ContentThumbnailComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
