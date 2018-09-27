import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BundleDetailComponent } from './bundle-detail.component';

describe('BundleDetailComponent', () => {
  let component: BundleDetailComponent;
  let fixture: ComponentFixture<BundleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BundleDetailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*
    Analyse bundle detail page (Student version)
  */

  // it('should display a toolbar at the top of the page', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should display a pageheader with the bundle icon, name and description ', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should display the number of available items', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should be able to filter the available items', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should display all available items of the bundle in a list', () => {
  // expect(component).toBeTruthy();
  // });

  // it('should be able to toggle the list between list and grid view', () => {
  // expect(component).toBeTruthy();
  // });

  // it('should be start the list in grid view', () => {
  // expect(component).toBeTruthy();
  // });

  // it('should display show the teacher info in a sidepanel if no item is selected', () => {
  // expect(component).toBeTruthy();
  // });

  // it('should display show the item info in a sidepanel if an item is selected', () => {
  // expect(component).toBeTruthy();
  // });

  // it('should display show the item descriptions in a sidepanel if multiple items are selected', () => {
  // expect(component).toBeTruthy();
  // });

  // it('should display an error message if a bundle is no longer available', () => {
  // expect(component).toBeTruthy();
  // });
});
