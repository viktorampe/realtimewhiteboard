import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { ButtonComponent } from '../button/button.component';
import { PersonSummaryComponent } from './person-summary.component';

describe('PersonSummaryComponent', () => {
  let component: PersonSummaryComponent;
  let fixture: ComponentFixture<PersonSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonSummaryComponent, ButtonComponent],
      imports: [MatIconModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonSummaryComponent);
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
      fixture.debugElement.children[0].children[1].children[0].nativeElement
        .textContent;
    expect(text).toContain(name);
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
