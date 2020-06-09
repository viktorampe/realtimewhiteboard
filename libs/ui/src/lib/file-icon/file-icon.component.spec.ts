import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { MockMatIconRegistry } from '@campus/testing';
import { FileIconComponent } from './file-icon.component';

describe('FileIconComponent', () => {
  let component: FileIconComponent;
  let fixture: ComponentFixture<FileIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [FileIconComponent],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the label', () => {
    component.label = `I'm special`;
    fixture.detectChanges();

    const componentDE = fixture.debugElement.query(By.css('div'));
    const componentEL = componentDE.nativeElement;
    expect(componentEL.textContent).toContain(`I'm special`);
  });

  it('should show the icon', () => {
    component.icon = `I'm special`;
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.directive(MatIcon))
      .componentInstance as MatIcon;
    expect(icon.svgIcon).toBe(`I'm special`);
  });

  it('should add the class from classModifier', () => {
    component.classModifier = `special`;
    fixture.detectChanges();

    const componentDE = fixture.debugElement.query(By.css('.ui-file-icon'));
    expect(componentDE.nativeElement.classList).toContain(
      'ui-file-icon--special'
    );
  });
});
