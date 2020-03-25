import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WhiteboardModule } from '../../whiteboard.module';
import { WhiteboardStandaloneComponent } from './whiteboard-standalone.component';

describe('WhiteboardStandaloneComponent', () => {
  let component: WhiteboardStandaloneComponent;
  let fixture: ComponentFixture<WhiteboardStandaloneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [WhiteboardModule, HttpClientTestingModule],

      declarations: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiteboardStandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
