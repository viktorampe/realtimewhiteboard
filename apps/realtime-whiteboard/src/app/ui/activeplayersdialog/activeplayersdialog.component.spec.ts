import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveplayersdialogComponent } from './activeplayersdialog.component';

describe('ActiveplayersdialogComponent', () => {
  let component: ActiveplayersdialogComponent;
  let fixture: ComponentFixture<ActiveplayersdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveplayersdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveplayersdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
