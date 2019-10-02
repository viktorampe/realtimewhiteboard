/// <reference types="cypress" />

import { cyEnv } from '../support/commands';
import { ApiPathsInterface, AppPathsInterface } from '../support/interfaces';

describe('Timeline', () => {
  const apiUrl = cyEnv('apiUrl');
  const appPaths = cyEnv('appPaths') as AppPathsInterface;
  const apiPaths = cyEnv('apiPaths') as ApiPathsInterface;

  describe('test', () => {
    it('should work', () => {
      assert(true);
    });
  });
});
