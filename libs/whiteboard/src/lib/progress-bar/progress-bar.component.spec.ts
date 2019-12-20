import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressBarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the correct progress of images uploaded', () => {
    component.amountOfImages = 3;
    component.amountCompleted = 1;

    fixture.detectChanges();

    const contentParagraph = fixture.debugElement.query(
      By.css('.progress-bar__progress')
    );

    expect(contentParagraph.nativeElement.style.width).toBe(
      (1 / 3) * 100 + '%'
    );
  });
});
