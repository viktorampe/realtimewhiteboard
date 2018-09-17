import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExtensionComponent } from './file-extension.component';
import { By } from '@angular/platform-browser';

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

  it('should apply the .ui-file-extension--title class', () => {
    component.showTitle = true;
    fixture.detectChanges();

    const componentDE = fixture.debugElement.query(By.css('i'));
    const componentEL = componentDE.nativeElement;
    expect(componentEL.className).toContain('ui-file-extension--title');
  });

  it('shouldnt apply the .ui-file-extension--title class', () => {
    component.showTitle = false;
    fixture.detectChanges();

    const componentDE = fixture.debugElement.query(By.css('i'));
    const componentEL = componentDE.nativeElement;
    expect(componentEL.className).not.toContain('ui-file-extension--title');
  });

  it('should apply the .ui-file-extension--icon class', () => {
    component.showIcon = true;
    fixture.detectChanges();

    const componentDE = fixture.debugElement.query(By.css('i'));
    const componentEL = componentDE.nativeElement;
    expect(componentEL.className).toContain('ui-file-extension--icon');
  });

  it('shouldnt apply the .ui-file-extension--icon class', () => {
    component.showIcon = false;
    fixture.detectChanges();

    const componentDE = fixture.debugElement.query(By.css('i'));
    const componentEL = componentDE.nativeElement;
    expect(componentEL.className).not.toContain('ui-file-extension--icon');
  });

  it('should show the title', () => {
    component.showTitle = true;
    component.extensionClass = 'extClass';
    fixture.detectChanges();

    const componentDE = fixture.debugElement.query(By.css('i'));
    const componentEL = componentDE.nativeElement;
    expect(componentEL.textContent).toContain('extClass');
  });

  it('shouldnt show the title', () => {
    component.showTitle = false;
    component.extensionClass = 'extClass';
    fixture.detectChanges();

    const componentDE = fixture.debugElement.query(By.css('i'));
    const componentEL = componentDE.nativeElement;
    expect(componentEL.textContent).not.toContain('extClass');
  });
});
