import { BundleDetailViewModel } from './bundle-detail.viewmodel';

let bundleDetailViewModel: BundleDetailViewModel;

beforeEach(() => {
  bundleDetailViewModel = new BundleDetailViewModel();
});

test('it should return', () => {
  return;
});

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
