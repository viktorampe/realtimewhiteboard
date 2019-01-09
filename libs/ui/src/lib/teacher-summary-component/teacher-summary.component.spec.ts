import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { ButtonComponent } from '../button/button.component';
import { TeacherSummaryComponent } from './teacher-summary.component';

describe('TeacherSummaryComponent', () => {
  let component: TeacherSummaryComponent;
  let fixture: ComponentFixture<TeacherSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherSummaryComponent, ButtonComponent],
      imports: [MatIconModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct name', () => {
    const name = 'testname';
    component.name = name;
    fixture.detectChanges();
    const text =
      fixture.debugElement.children[0].children[1].nativeElement.textContent;
    expect(text).toContain(name);
  });

  it('should display correct code', () => {
    const code = 'asdfasdfwerq';
    component.code = code;
    fixture.detectChanges();
    const text =
      fixture.debugElement.children[0].children[1].nativeElement.textContent;
    expect(text).toContain(code);
  });

  it('should display correct datestring', () => {
    const dateString = '19=98';
    component.dateString = dateString;
    fixture.detectChanges();
    const text =
      fixture.debugElement.children[0].children[1].nativeElement.textContent;
    expect(text).toContain(dateString);
  });

  it('should display correct learningAreasString', () => {
    const learningAreasString = 'wiskunde en nog iets';
    component.learningAreasString = learningAreasString;
    fixture.detectChanges();
    const text =
      fixture.debugElement.children[0].children[1].nativeElement.textContent;
    expect(text).toContain(learningAreasString);
  });

  it('should display correct image url', () => {
    const imageUrl = 'https://127.0.0.1/testje.jpg';
    component.imageUrl = imageUrl;
    fixture.detectChanges();
    const text =
      fixture.debugElement.children[0].children[0].nativeElement.attributes.src
        .textContent;
    expect(text).toContain(imageUrl);
  });
});
