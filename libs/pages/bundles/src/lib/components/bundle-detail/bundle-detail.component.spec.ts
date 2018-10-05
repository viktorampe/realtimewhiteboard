import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagesBundlesModule } from './../../pages-bundles.module';
import { BundleDetailComponent } from './bundle-detail.component';

@NgModule({
  imports: [CommonModule, PagesBundlesModule]
})
export class TestModule {}

describe('BundleDetailComponent', () => {
  let component: BundleDetailComponent;
  let fixture: ComponentFixture<BundleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule, BrowserAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  /*
    Analyse needed data bundle detail page (Student version)
  */
  it('should get the page header info', () => {});
  // bundle icon
  // title
  // subtitle

  it('should get an array of educontents', () => {});
  // type icon
  // file extension
  // preview image
  // title
  // description
  // method logo src
  // current status

  it('should get an array of actions per educontent', () => {});
  // action icon
  // tooltip
  // function to call
  // function parameters

  it('should get a marker when there are afwijkende instellingen per educontent', () => {});

  it('should get the teacherinfo', () => {});
  // name
  // avatar

  it('should get the errormessage when there isnt any content', () => {});

  it('should get the default list layout (gird/line) ?', () => {});
  // is dit iets wat de pagina bijhoudt? of komt dat uit de store?
});
