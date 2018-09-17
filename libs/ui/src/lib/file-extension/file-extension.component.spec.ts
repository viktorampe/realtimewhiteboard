import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExtensionComponent } from './file-extension.component';
import { compileComponentFromMetadata } from '@angular/compiler';

describe('FileExtensionComponent', () => {
  let component: FileExtensionComponent;
  let fixture: ComponentFixture<FileExtensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileExtensionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create without any inputs', () => {
    expect(component).toBeTruthy();
  });

  it('should create with any extension', () => {
    component.extensionClass = 'definitely-wrong-class';
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should create with showTitle true', () => {
    component.showTitle = true;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should create with showTitle false', () => {
    component.showTitle = false;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should create withs showIcon true', () => {
    component.showIcon = true;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should create withs showIcon false', () => {
    component.showIcon = false;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
