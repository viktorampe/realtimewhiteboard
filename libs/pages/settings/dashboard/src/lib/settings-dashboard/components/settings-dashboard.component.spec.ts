import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatListModule } from '@angular/material';
import { SettingsDashboardComponent } from './settings-dashboard.component';

describe('SettingsDashboardComponent', () => {
  let component: SettingsDashboardComponent;
  let fixture: ComponentFixture<SettingsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsDashboardComponent],
      imports: [MatIconModule, MatListModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct number of links', () => {
    const navlist =
      fixture.debugElement.children[0].children[1].children[0].children[0];
    expect(navlist.children.length).toBe(7);
  });

  it('navitem should be populated with the correct name', () => {
    const navlist =
      fixture.debugElement.children[0].children[1].children[0].children[0];
    const navItem = navlist.children[0];
    expect(navItem.nativeElement.textContent).toContain('link1');
  });

  it('navitem should be populated with the correct link', () => {
    const navlist =
      fixture.debugElement.children[0].children[1].children[0].children[0];
    const navItem = navlist.children[0];
    console.log(
      navItem.children[0].children[0].nativeElement.attributes.length
    );
  });

  it('navitem should be populated with the correct icon', () => {
    const navlist =
      fixture.debugElement.children[0].children[1].children[0].children[0];
    const navItem = navlist.children[0];
  });
});
