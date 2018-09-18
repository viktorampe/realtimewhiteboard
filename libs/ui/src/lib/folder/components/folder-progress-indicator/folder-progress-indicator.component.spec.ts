import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FolderProgressIndicatorComponent } from './folder-progress-indicator.component';

describe('FolderProgressIndicatorComponent', () => {
  let component: FolderProgressIndicatorComponent;
  let fixture: ComponentFixture<FolderProgressIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FolderProgressIndicatorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderProgressIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
