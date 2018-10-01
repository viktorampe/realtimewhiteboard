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

  it('should show a toolbar at the top of the page', () => {});

  it('should show a pageheader with the bundle icon, name and description ', () => {});

  it('should show the number of available items', () => {});

  it('should be able to filter the available items', () => {});

  it('should show a list of all available items in the bundle', () => {});

  it('should be able to toggle the list between list and grid view', () => {});

  it('should start the list in grid view on desktop', () => {});

  it('should start the list in list view on mobile', () => {});

  it('should show an infopanel', () => {});

  it('should show the infopanel next to the the list on desktop', () => {});

  it('should show the infopanel as a bottom/side(?) drawer on mobile', () => {});

  it('should show the teacher info in the infopanel if no item is selected', () => {});

  it('should show the item info in the infopanel if an item is selected', () => {});

  it('should be able to set the item status in the infopanel if an item is selected', () => {});

  it('should show the item descriptions in the infopanel if multiple items are selected', () => {});

  it('should show an error message if a bundle is no longer available', () => {});
});
