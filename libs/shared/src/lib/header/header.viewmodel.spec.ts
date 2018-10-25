// file.only

import { AuthService, DalState } from '@campus/dal';
import { StateResolver } from '@campus/pages/shared';
import { Store } from '@ngrx/store';
import { EnvironmentFeaturesInterface } from '../interfaces';
import { HeaderViewModel } from './header.viewmodel';

let environmentFeatures: EnvironmentFeaturesInterface = {
  alerts: {
    enabled: true,
    hasAppBarDropDown: true
  },
  messages: {
    enabled: true,
    hasAppBarDropDown: true
  }
};
let headerViewModel: HeaderViewModel;

describe('headerViewModel', () => {
  describe('loadFeatureToggles and enableAlerts, enableMessage', () => {
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
      headerViewModel = new HeaderViewModel(
        <StateResolver>{},
        environmentFeatures,
        <AuthService>{},
        <Store<DalState>>{}
      );
      headerViewModel['loadStateStreams'] = jest.fn;
      headerViewModel['loadDisplayStream'] = jest.fn;
      headerViewModel['stateResolver'].resolve = jest.fn(() => []);
      headerViewModel.resolve();
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
  describe('resolve', () => {
    let spy;
    beforeEach(() => {
      headerViewModel = new HeaderViewModel(
        <StateResolver>{},
        environmentFeatures,
        <AuthService>{},
        <Store<DalState>>{}
      );
      headerViewModel['loadStateStreams'] = jest.fn();
      headerViewModel['loadDisplayStream'] = jest.fn();
      headerViewModel['stateResolver'].resolve = jest.fn(() => []);
      spy = jest.spyOn(jest, 'fn');
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('should call loadDisplayStream once', () => {
      headerViewModel['loadDisplayStream'] = jest.fn;
      headerViewModel.resolve();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call loadStateStreams once', () => {
      headerViewModel['loadStateStreams'] = jest.fn;
      headerViewModel.resolve();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call stateResolver.resolve once', () => {
      spy = jest.spyOn(headerViewModel['stateResolver'], 'resolve');
      headerViewModel.resolve();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
  describe('stateResolver.resolve', () => {
    let spy;
    beforeEach(() => {
      headerViewModel = new HeaderViewModel(
        <StateResolver>{},
        environmentFeatures,
        <AuthService>{},
        <Store<DalState>>{}
      );
      headerViewModel['loadStateStreams'] = jest.fn;
      headerViewModel['loadDisplayStream'] = jest.fn;
      headerViewModel['getLoadableActions'] = jest.fn(() => 1);
      headerViewModel['getResolvedQueries'] = jest.fn(() => 2);
      headerViewModel['stateResolver'].resolve = jest.fn(() => {});
      spy = jest.spyOn(headerViewModel['stateResolver'], 'resolve');
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('should call loadDisplayStream once', () => {
      headerViewModel['loadDisplayStream'] = jest.fn;
      headerViewModel.resolve();
      expect(spy).toHaveBeenCalledWith(1, 2);
    });
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
