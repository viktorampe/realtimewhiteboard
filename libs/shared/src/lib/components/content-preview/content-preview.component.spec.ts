import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ContentPreviewComponent } from '.';

describe('ContentPreviewComponent', () => {
  let component: ContentPreviewComponent;
  let fixture: ComponentFixture<ContentPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ContentPreviewComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => {} } }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
