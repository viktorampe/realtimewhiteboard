import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { WhiteboardModule } from '../../whiteboard.module';
import { WhiteboardStandaloneComponent } from './whiteboard-standalone.component';

describe('WhiteboardStandaloneComponent', () => {
  let component: WhiteboardStandaloneComponent;
  let fixture: ComponentFixture<WhiteboardStandaloneComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [WhiteboardModule, HttpClientTestingModule],
      declarations: [],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiteboardStandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
