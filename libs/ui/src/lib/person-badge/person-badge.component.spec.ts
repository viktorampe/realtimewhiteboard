import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PersonBadgeComponent } from './person-badge.component';

describe('PersonBadgeComponent', () => {
  let component: PersonBadgeComponent;
  let fixture: ComponentFixture<PersonBadgeComponent>;

  let mockData: {
    align: string;
    size: string;
    displayName: string;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonBadgeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonBadgeComponent);
    component = fixture.componentInstance;

    mockData = {
      align: 'left',
      size: 'medium',
      displayName: 'The name'
    };

    component.align = mockData.align;
    component.size = mockData.size;
    component.displayName = mockData.displayName;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should add the size class', () => {
    const element = fixture.debugElement.query(
      By.css('.ui_person-badge__badge--' + mockData.size)
    );
    expect(element).toBeTruthy();
  });
  it('should add the align class', () => {
    const element = fixture.debugElement.query(
      By.css('.ui_person-badge--' + mockData.align)
    );
    expect(element).toBeTruthy();
  });
  it('should show the displayName', () => {
    const text = fixture.debugElement.query(
      By.css('.ui_person-badge__displayName')
    ).nativeElement.textContent;
    expect(text).toBe(mockData.displayName);
  });
});
