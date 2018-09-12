import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PersonBadgeComponent } from './person-badge.component';


describe('PersonBadgeComponent', () => {
  let component: PersonBadgeComponent;
  let fixture: ComponentFixture<PersonBadgeComponent>;

  let mockData: {
    orientation: string;
    size: string;
    displayName: string;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonBadgeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonBadgeComponent);
    component = fixture.componentInstance;

    mockData = {
      orientation: 'left',
      size: 'medium',
      displayName: 'The name'
    }

    component.orientation = mockData.orientation
    component.size = mockData.size
    component.displayName = mockData.displayName

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should add the size class', () => {
    const element = fixture.debugElement.query(
      By.css('.ui-person-badge__badge--' + mockData.size)
    );
    expect(element).toBeTruthy();
  });
  it('should add the orientation class', () => {
    const element = fixture.debugElement.query(
      By.css('.ui-person-badge--' + mockData.orientation)
    );
    expect(element).toBeTruthy();
  });
  it('should show the displayName', () => {
    const text = fixture.debugElement.query(
      By.css('.ui-person-badge__displayName')
    ).nativeElement.textContent;
    expect(text).toBe(mockData.displayName);
  });
});
