import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { WhiteboardModule } from '../../whiteboard.module';
import { WhiteboardStandaloneComponent } from './whiteboard-standalone.component';

describe('WhiteboardStandaloneComponent', () => {
  let component: WhiteboardStandaloneComponent;
  let fixture: ComponentFixture<WhiteboardStandaloneComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [WhiteboardModule, HttpClientTestingModule],

      declarations: []
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
