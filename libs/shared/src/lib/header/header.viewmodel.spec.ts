import { EnvironmentFeaturesInterface } from '../interfaces';
import { HeaderViewModel } from './header.viewmodel';

let environmentFeatures: EnvironmentFeaturesInterface;
let headerViewModel: HeaderViewModel;

describe('loadFeatureToggles and enableAlerts, enableMessages', () => {
  function expectEnablesToBe(
    enabled: boolean,
    haveDropDown: boolean,
    expectedEnabled: boolean
  ) {
    environmentFeatures = {
      alerts: {
        enabled: enabled,
        hasAppBarDropDown: haveDropDown
      },
      messages: {
        enabled: enabled,
        hasAppBarDropDown: haveDropDown
      }
    };
    headerViewModel = new HeaderViewModel(environmentFeatures);
    expect(headerViewModel.enableAlerts).toBe(expectedEnabled);
    expect(headerViewModel.enableMessages).toBe(expectedEnabled);
  }
  it('should be true if enable and hasDropDown are true', () => {
    expectEnablesToBe(true, true, true);
  });
  it('should be false if enable is false and hasDropDown is true', () => {
    expectEnablesToBe(false, true, false);
  });
  it('should be false if enable is true and hasDropDown is false', () => {
    expectEnablesToBe(true, false, false);
  });
  it('should be false if enable is false and hasDropDown is false', () => {
    expectEnablesToBe(false, false, false);
  });
});

test('it should provide a stream with the array of breadcrumbs', () => {
  return;
});

test('it should (conditionally) provide a stream with the array of recent Alerts', () => {
  return;
});

test('it should (conditionally) provide a stream with the array of recent Messages', () => {
  return;
});

test('it should provide a stream with the logged in users details', () => {
  return;
});

test('it should dispatch an action to poll the server every x seconds', () => {
  return;
});

test('it should dispatch an action set an alert as read', () => {
  return;
});

test('it should dispatch an action set a message as read', () => {
  return;
});
