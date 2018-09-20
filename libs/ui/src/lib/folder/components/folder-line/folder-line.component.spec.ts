import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderLineComponent } from './folder-line.component';

describe('FolderLineComponent', () => {
  let component: FolderLineComponent;
  let fixture: ComponentFixture<FolderLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
