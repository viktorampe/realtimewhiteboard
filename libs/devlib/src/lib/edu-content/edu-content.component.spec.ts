import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EduContentComponent } from './edu-content.component';

describe('EduContentComponent', () => {
  let component: EduContentComponent;
  let fixture: ComponentFixture<EduContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EduContentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
