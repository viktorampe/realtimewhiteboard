// file.only

import { AlertQueueInterface, AuthService, DalState } from '@campus/dal';
import { StateResolver } from '@campus/pages/shared';
import { Store } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import {
  EnvironmentAlertsFeatureInterface,
  EnvironmentMessagesFeatureInterface
} from '../interfaces';
import { HeaderViewModel } from './header.viewmodel';

let environmentMessagesFeature: EnvironmentMessagesFeatureInterface = {
  enabled: false,
  hasAppBarDropDown: false
};
let environmentAlertsFeature: EnvironmentAlertsFeatureInterface = {
  enabled: false,
  hasAppBarDropDown: false
};
let headerViewModel: HeaderViewModel;

describe('headerViewModel', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('loadFeatureToggles and enableAlerts, enableMessage', () => {
    function expectEnablesToBe(
      enabled: boolean,
      haveDropDown: boolean,
      expectedEnabled: boolean
    ) {
      environmentMessagesFeature = {
        enabled: enabled,
        hasAppBarDropDown: haveDropDown
      };
      environmentAlertsFeature = {
        enabled: enabled,
        hasAppBarDropDown: haveDropDown
      };
      headerViewModel = new HeaderViewModel(
        <StateResolver>{},
        environmentAlertsFeature,
        environmentMessagesFeature,
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
        environmentAlertsFeature,
        environmentMessagesFeature,
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
        environmentAlertsFeature,
        environmentMessagesFeature,
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
    it('should call loadDisplayStream once', () => {
      headerViewModel['loadDisplayStream'] = jest.fn;
      headerViewModel.resolve();
      expect(spy).toHaveBeenCalledWith(1, 2);
    });
  });
  describe('methods', () => {
    let spy;
    beforeEach(() => {
      spy = jest.fn(() => {});
      headerViewModel = new HeaderViewModel(
        <StateResolver>{},
        environmentAlertsFeature,
        environmentMessagesFeature,
        <AuthService>{},
        <Store<DalState>>{}
      );
    });
    it('should have loadStateStreams call pipe one time for each store selection', () => {
      headerViewModel['store'].pipe = spy;
      headerViewModel['loadStateStreams']();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should have loadDisplayStream call all individual builder methods one time', () => {
      headerViewModel['getRecentAlerts'] = spy;
      headerViewModel['getRecentMessages'] = spy;
      headerViewModel['loadDisplayStream']();
      expect(spy).toHaveBeenCalledTimes(2);
    });
    it('should have getRecentAlerts return ...', () => {
      const alertsForUser$ = hot('-a-|', { a: <AlertQueueInterface[]>{} });
      const actual = headerViewModel['getRecentAlerts'](alertsForUser$);
      expect(actual).toBeObservable(
        hot('-a-|', { a: [{ text: 'temp alert' }] })
      );
    });
    it('should have getRecentMessages return ...', () => {
      const alertsForUser$ = hot('-a-|', { a: <AlertQueueInterface[]>{} });
      const actual = headerViewModel['getRecentMessages'](alertsForUser$);
      expect(actual).toBeObservable(
        hot('-a-|', { a: [{ text: 'temp message' }] })
      );
    });
  });
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
