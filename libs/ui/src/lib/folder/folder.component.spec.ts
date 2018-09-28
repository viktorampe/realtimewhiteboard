import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UiModule } from '../ui.module';
import { FolderComponent } from './folder.component';

describe('FolderComponent', () => {
  let component: FolderComponent;
  let fixture: ComponentFixture<FolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
