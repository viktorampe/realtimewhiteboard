import { ScormCmiFixture } from '@campus/dal';
import { ScormApi } from './scorm-api';
import {
  ScormCMIMode,
  ScormErrorCodes,
  ScormStatus
} from './scorm-api.interface';
// file.only
let scormApi: ScormApi;
let commitSpy: jest.SpyInstance;
describe('The scorm API', () => {
  describe('#LMSInitialize - should initialize the API and exercise', () => {
    describe('when not in preview mode', () => {
      describe('and a current exercise as object is provided', () => {
        beforeEach(() => {
          setupTest(new ScormCmiFixture(), ScormCMIMode.CMI_MODE_NORMAL);
        });
        it('should reset the API', () => {
          expect(scormApi.lastErrorCode).toBe(ScormErrorCodes.NO_ERROR);
          expect(scormApi.lastDiagnosticMessage).toBe(
            'Geen vuiltje aan de lucht...'
          );

          scormApi.LMSCommit();
          expect(commitSpy).toHaveBeenCalledWith(
            new ScormCmiFixture({ mode: ScormCMIMode.CMI_MODE_NORMAL })
          );
        });
      });
      describe('and a current exercise is provided', () => {
        beforeEach(() => {
          setupTest(
            JSON.stringify(new ScormCmiFixture()),
            ScormCMIMode.CMI_MODE_NORMAL
          );
        });
        it('should reset the API', () => {
          expect(scormApi.lastErrorCode).toBe(ScormErrorCodes.NO_ERROR);
          expect(scormApi.lastDiagnosticMessage).toBe(
            'Geen vuiltje aan de lucht...'
          );
          checkOutput(commitSpy, {
            mode: ScormCMIMode.CMI_MODE_NORMAL
          });
        });
      });
      describe('and no current exercise is provided', () => {
        beforeEach(() => {
          setupTest(undefined, ScormCMIMode.CMI_MODE_BROWSE);
        });
        it('should reset the API', () => {
          expect(scormApi.lastErrorCode).toBe(ScormErrorCodes.NO_ERROR);
          expect(scormApi.lastDiagnosticMessage).toBe(
            'Geen vuiltje aan de lucht...'
          );
          checkOutput(commitSpy, { mode: ScormCMIMode.CMI_MODE_BROWSE });
        });
      });
    });

    xdescribe('preview mode', () => {
      beforeEach(() => {
        setupTest(new ScormCmiFixture(), ScormCMIMode.CMI_MODE_PREVIEW);
      });
      it('should reset the API', () => {
        checkOutput(commitSpy, { mode: ScormCMIMode.CMI_MODE_PREVIEW });
      });
    });
  });

  describe('#LMSFinish', () => {
    let LMSCommitSpy: jest.SpyInstance;

    describe('when in preview mode', () => {
      beforeEach(() => {
        setupTest(new ScormCmiFixture(), ScormCMIMode.CMI_MODE_PREVIEW);
        LMSCommitSpy = jest.spyOn(scormApi, 'LMSCommit');
      });
      it(`should return 'true'`, () => {
        expect(scormApi.LMSFinish()).toBe('true');

        expect(LMSCommitSpy).not.toHaveBeenCalled();
      });
    });
    describe('when not in preview mode', () => {
      beforeEach(() => {});
      it(`should return 'false'`, () => {
        setupTest(
          new ScormCmiFixture({ mode: ScormCMIMode.CMI_MODE_BROWSE }),
          ScormCMIMode.CMI_MODE_BROWSE
        );
        LMSCommitSpy = jest.spyOn(scormApi, 'LMSCommit');
        expect(scormApi.LMSFinish()).toBe('false');

        expect(LMSCommitSpy).toHaveBeenCalledTimes(1);
      });

      it(`should return 'true'`, () => {
        setupTest(
          new ScormCmiFixture({
            mode: ScormCMIMode.CMI_MODE_BROWSE,
            core: { lesson_status: ScormStatus.STATUS_COMPLETED }
          }),
          ScormCMIMode.CMI_MODE_BROWSE
        );
        LMSCommitSpy = jest.spyOn(scormApi, 'LMSCommit');

        expect(scormApi.LMSFinish()).toBe('true');

        expect(LMSCommitSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('#LMSGetValue', () => {
    it('should return the parameter as string', () => {
      setupTest(
        new ScormCmiFixture({
          mode: ScormCMIMode.CMI_MODE_NORMAL,
          suspended_data: [{ test: 'test' }]
        }),
        ScormCMIMode.CMI_MODE_NORMAL
      );
      const paramValue = scormApi.LMSGetValue('suspended_data');
      expect(paramValue).toEqual([{ test: 'test' }]);
    });
  });
  describe('#LMSSetValue', () => {});
  describe('#LMSCommit', () => {});
  describe('#LMSGetLastError', () => {});
  describe('#LMSGetDiagnostic', () => {});
  describe('#LMSGetErrorString', () => {});
});

function setupTest(
  scormCmiFixture: ScormCmiFixture | string,
  scormCmiMode: ScormCMIMode
) {
  scormApi = new ScormApi(scormCmiFixture, scormCmiMode);
  commitSpy = jest.spyOn(scormApi.commit$, 'next');

  scormApi.LMSInitialize();
}

function checkOutput(spy: jest.SpyInstance, expectedValue: any) {
  scormApi.LMSCommit();
  expect(spy).toHaveBeenCalledWith(new ScormCmiFixture(expectedValue));
}
