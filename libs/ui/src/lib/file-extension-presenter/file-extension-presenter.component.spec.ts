import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExtensionPresenterComponent } from './file-extension-presenter.component';

describe('FileExtensionPresenterComponent', () => {
  let component: FileExtensionPresenterComponent;
  let fixture: ComponentFixture<FileExtensionPresenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileExtensionPresenterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileExtensionPresenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
