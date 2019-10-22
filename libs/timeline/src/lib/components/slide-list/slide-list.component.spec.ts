import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatListModule } from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SlideListComponent } from './slide-list.component';

describe('SlideListComponent', () => {
  let component: SlideListComponent;
  let fixture: ComponentFixture<SlideListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatListModule, MatIconModule, NoopAnimationsModule],
      declarations: [SlideListComponent],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
