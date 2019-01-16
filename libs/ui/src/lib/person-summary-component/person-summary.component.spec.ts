import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { By } from '@angular/platform-browser';
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
    const text = fixture.debugElement.query(
      By.css('.ui-person-summary__text__person-name')
    ).nativeElement.textContent;
    expect(text).toContain(name);
  });

  it('should display correct image url', () => {
    const imageUrl = 'https://127.0.0.1/testje.jpg';
    component.imageUrl = imageUrl;
    fixture.detectChanges();
    const image = fixture.debugElement.query(
      By.css('.ui-person-summary__images__picture')
    );
    expect(image.nativeElement.attributes.src.textContent).toContain(imageUrl);
  });

  it('should display correct icon url', () => {
    const imageUrl = 'https://127.0.0.1/testje.jpg';
    component.connectionTypeIcon = imageUrl;
    fixture.detectChanges();
    const image = fixture.debugElement.query(
      By.css('.ui-person-summary__images__connection-type-icon')
    );
    expect(
      image.nativeElement.attributes['ng-reflect-svg-icon'].textContent
    ).toContain(imageUrl);
  });
});
