import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UiModule } from '@campus/ui';
import { EduContentsComponent } from './edu-contents.component';

describe('EduContentsComponent', () => {
  let component: EduContentsComponent;
  let fixture: ComponentFixture<EduContentsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, NoopAnimationsModule],
      declarations: [EduContentsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
