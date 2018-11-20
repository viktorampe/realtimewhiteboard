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
      const paramValue = [{ test: 'test' }];
      setupTest(
        new ScormCmiFixture({
          mode: ScormCMIMode.CMI_MODE_NORMAL,
          suspend_data: paramValue
        }),
        ScormCMIMode.CMI_MODE_NORMAL
      );
      const expectedParamValue = scormApi.LMSGetValue('suspend_data');
      expect(expectedParamValue).toBe(paramValue);
    });

    it('should return false when the parameter does not exist', () => {
      setupTest(new ScormCmiFixture(), ScormCMIMode.CMI_MODE_NORMAL);
      const result = scormApi.LMSGetValue('i-do-not-exist');
      expect(result).toBe('false');
      expect(scormApi.lastErrorCode).toBe(
        ScormErrorCodes.NOT_IMPLEMENTED_ERROR
      );
      expect(scormApi.lastDiagnosticMessage).toBe(
        `Deze info (i-do-not-exist) is niet beschikbaar`
      );
    });
  });

  describe('#LMSSetValue', () => {
    it('should set a value for the CMI data model', () => {
      setupTest(new ScormCmiFixture(), ScormCMIMode.CMI_MODE_NORMAL);
      expect(scormApi.LMSSetValue('mode', ScormCMIMode.CMI_MODE_BROWSE)).toBe(
        'true'
      );
      expect(scormApi.LMSGetValue('mode')).toBe(ScormCMIMode.CMI_MODE_BROWSE);
    });

    it('should not set a value if we are in preview mode', () => {
      setupTest(
        new ScormCmiFixture({ mode: ScormCMIMode.CMI_MODE_PREVIEW }),
        ScormCMIMode.CMI_MODE_PREVIEW
      );

      expect(scormApi.LMSSetValue('mode', ScormCMIMode.CMI_MODE_REVIEW)).toBe(
        'false'
      );
      expect(scormApi.LMSGetValue('mode')).toBe(ScormCMIMode.CMI_MODE_PREVIEW);
    });
  });

  describe('#LMSCommit', () => {
    it('should return false when we are in preview mode', () => {
      setupTest(
        new ScormCmiFixture({ mode: ScormCMIMode.CMI_MODE_PREVIEW }),
        ScormCMIMode.CMI_MODE_PREVIEW
      );

      expect(scormApi.LMSCommit()).toBe('false');
    });

    it('should trigger the commit stream with the current result', () => {
      const result = new ScormCmiFixture({
        mode: ScormCMIMode.CMI_MODE_BROWSE
      });
      setupTest(result, ScormCMIMode.CMI_MODE_BROWSE);

      expect(scormApi.LMSCommit()).toBe('true');
      expect(commitSpy).toHaveBeenCalledTimes(1);
      expect(commitSpy).toHaveBeenCalledWith(result);
    });
  });

  describe('#LMSGetLastError', () => {
    it('should return the last error code', () => {
      setupTest(new ScormCmiFixture(), ScormCMIMode.CMI_MODE_BROWSE);
      scormApi.lastErrorCode = ScormErrorCodes.NOT_INITIALIZED_ERROR;
      expect(scormApi.LMSGetLastError()).toBe(
        ScormErrorCodes.NOT_INITIALIZED_ERROR
      );
    });
  });

  describe('#LMSGetDiagnostic', () => {
    it('should return the last diagnostic message', () => {
      setupTest(new ScormCmiFixture(), ScormCMIMode.CMI_MODE_BROWSE);
      scormApi.lastDiagnosticMessage = 'this is a test diagnostic message';
      expect(scormApi.LMSGetDiagnostic()).toBe(
        'this is a test diagnostic message'
      );
    });
  });
  describe('#LMSGetErrorString', () => {
    it('should return an error description for the specified error code', () => {
      setupTest(new ScormCmiFixture(), ScormCMIMode.CMI_MODE_BROWSE);
      expect(
        scormApi.LMSGetErrorString(
          ScormErrorCodes.INVALID_SET_VALUE_ELEMENT_IS_KEYWORD_ERROR
        )
      ).toBe('Je kan geen waardes zetten voor keywords');
    });
  });
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
