import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseFolder } from './folder.component';

describe('FolderComponent', () => {
  let component: BaseFolder;
  let fixture: ComponentFixture<BaseFolder>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseFolder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFolder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
