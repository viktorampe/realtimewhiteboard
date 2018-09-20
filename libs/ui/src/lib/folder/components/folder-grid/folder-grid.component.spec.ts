import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderGridComponent } from './folder-grid.component';

describe('FolderGridComponent', () => {
  let component: FolderGridComponent;
  let fixture: ComponentFixture<FolderGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
