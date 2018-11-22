import { ScormCmiFixture } from '@campus/dal';
import { ScormApi } from './scorm-api';
import {
  ScormCmiMode,
  ScormErrorCodes,
  ScormStatus
} from './scorm-api.interface';

let scormApi: ScormApi;
let commit$Spy: jest.SpyInstance;
let LMSCommitSpy: jest.SpyInstance;
describe('The scorm API', () => {
  describe('#LMSInitialize - should initialize the API and exercise', () => {
    describe('when not in preview mode', () => {
      describe('and a current exercise as object is provided', () => {
        beforeEach(() => {
          setupTest(
            new ScormCmiFixture({ mode: ScormCmiMode.CMI_MODE_NORMAL })
          );
        });
        it('should reset the API', () => {
          expect(scormApi.lastErrorCode).toBe(ScormErrorCodes.NO_ERROR);
          expect(scormApi.lastDiagnosticMessage).toBe(
            'Geen vuiltje aan de lucht...'
          );

          scormApi.LMSCommit();
          expect(commit$Spy).toHaveBeenCalledWith(
            new ScormCmiFixture({ mode: ScormCmiMode.CMI_MODE_NORMAL })
          );
        });
      });
      describe('and a current exercise is provided', () => {
        beforeEach(() => {
          scormApi = new ScormApi(
            JSON.stringify(
              new ScormCmiFixture({ mode: ScormCmiMode.CMI_MODE_NORMAL })
            ),
            ScormCmiMode.CMI_MODE_NORMAL
          );
          scormApi.LMSInitialize();
        });
        it('should reset the API', () => {
          expect(scormApi.lastErrorCode).toBe(ScormErrorCodes.NO_ERROR);
          expect(scormApi.lastDiagnosticMessage).toBe(
            'Geen vuiltje aan de lucht...'
          );

          checkOutput(commit$Spy, {
            mode: ScormCmiMode.CMI_MODE_NORMAL
          });
        });
      });
      describe('and no current exercise is provided', () => {
        beforeEach(() => {
          setupTest(undefined);
        });
        it('should reset the API', () => {
          expect(scormApi.lastErrorCode).toBe(ScormErrorCodes.NO_ERROR);
          expect(scormApi.lastDiagnosticMessage).toBe(
            'Geen vuiltje aan de lucht...'
          );

          // this is the result from the private getNewCmi() function
          const expectedValue = new ScormCmiFixture({
            mode: ScormCmiMode.CMI_MODE_BROWSE,
            objectives: [
              {
                score: {
                  raw: 0,
                  min: undefined,
                  max: undefined,
                  scale: undefined
                },
                status: ScormStatus.STATUS_NOT_ATTEMPTED,
                id: 'points'
              }
            ],
            suspend_data: []
          });

          checkOutput(commit$Spy, expectedValue);
        });
      });
    });

    describe('when in preview mode', () => {
      beforeEach(() => {
        setupTest(new ScormCmiFixture({ mode: ScormCmiMode.CMI_MODE_PREVIEW }));
      });
      it('should reset the API', () => {
        scormApi.LMSCommit();
        expect(commit$Spy).not.toHaveBeenCalled();
        expect(scormApi.lastErrorCode).toBe(ScormErrorCodes.NO_ERROR);
        expect(scormApi.lastDiagnosticMessage).toBe(
          'Geen vuiltje aan de lucht...'
        );
      });
    });
  });

  describe('#LMSFinish', () => {
    describe('when in preview mode', () => {
      beforeEach(() => {
        setupTest(new ScormCmiFixture({ mode: ScormCmiMode.CMI_MODE_PREVIEW }));
      });
      it(`should not do anything (do not set value or commit)`, () => {
        expect(scormApi.LMSFinish()).toBe('true');
        expect(LMSCommitSpy).not.toHaveBeenCalled();
      });
    });

    describe('when in review mode', () => {
      beforeEach(() => {
        setupTest(new ScormCmiFixture({ mode: ScormCmiMode.CMI_MODE_REVIEW }));
      });
      it(`should not do anything (do not set value or commit)`, () => {
        expect(scormApi.LMSFinish()).toBe('true');
        expect(LMSCommitSpy).not.toHaveBeenCalled();
      });
    });

    describe('when not in preview or review mode', () => {
      describe('and the lesson is not completed', () => {
        it(`should return 'false'`, () => {
          setupTest(
            new ScormCmiFixture({
              mode: ScormCmiMode.CMI_MODE_BROWSE,
              core: { ...this, lesson_status: ScormStatus.STATUS_INCOMPLETE }
            })
          );
          expect(scormApi.LMSFinish()).toBe('false');

          expect(LMSCommitSpy).toHaveBeenCalledTimes(1);
        });
      });
      describe('and the lesson is completed', () => {
        it(`should return 'true'`, () => {
          setupTest(
            new ScormCmiFixture({
              mode: ScormCmiMode.CMI_MODE_BROWSE,
              core: { ...this, lesson_status: ScormStatus.STATUS_COMPLETED }
            })
          );

          expect(scormApi.LMSFinish()).toBe('true');

          expect(LMSCommitSpy).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('#LMSGetValue', () => {
    it('should return the parameter as string', () => {
      const paramValue = [{ test: 'test' }];
      setupTest(
        new ScormCmiFixture({
          mode: ScormCmiMode.CMI_MODE_NORMAL,
          suspend_data: paramValue
        })
      );
      const expectedParamValue = scormApi.LMSGetValue('suspend_data');
      expect(expectedParamValue).toEqual(paramValue);
    });

    it('should return false when the parameter does not exist', () => {
      setupTest(new ScormCmiFixture({ mode: ScormCmiMode.CMI_MODE_NORMAL }));
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
      setupTest(new ScormCmiFixture({ mode: ScormCmiMode.CMI_MODE_NORMAL }));
      expect(scormApi.LMSSetValue('mode', ScormCmiMode.CMI_MODE_BROWSE)).toBe(
        'true'
      );
      expect(scormApi.LMSGetValue('mode')).toBe(ScormCmiMode.CMI_MODE_BROWSE);
    });

    it('should not set a value if we are in preview mode', () => {
      setupTest(new ScormCmiFixture({ mode: ScormCmiMode.CMI_MODE_PREVIEW }));

      expect(scormApi.LMSSetValue('mode', ScormCmiMode.CMI_MODE_REVIEW)).toBe(
        'false'
      );
      expect(scormApi.LMSGetValue('mode')).toBe(ScormCmiMode.CMI_MODE_PREVIEW);
    });

    it('should not set a value if we are in review mode', () => {
      setupTest(new ScormCmiFixture({ mode: ScormCmiMode.CMI_MODE_REVIEW }));

      expect(scormApi.LMSSetValue('mode', ScormCmiMode.CMI_MODE_NORMAL)).toBe(
        'false'
      );
      expect(scormApi.LMSGetValue('mode')).toBe(ScormCmiMode.CMI_MODE_REVIEW);
    });
  });

  describe('#LMSCommit', () => {
    it('should not commit when we are in preview mode', () => {
      setupTest(new ScormCmiFixture({ mode: ScormCmiMode.CMI_MODE_PREVIEW }));
      expect(scormApi.LMSCommit()).toBe('false');
    });

    it('should not commit when we are in review mode', () => {
      setupTest(new ScormCmiFixture({ mode: ScormCmiMode.CMI_MODE_REVIEW }));

      expect(scormApi.LMSCommit()).toBe('false');
      expect(commit$Spy).not.toHaveBeenCalled();
    });

    it('should trigger the commit stream with the current result', () => {
      const result = new ScormCmiFixture({
        mode: ScormCmiMode.CMI_MODE_BROWSE
      });
      setupTest(result);

      expect(scormApi.LMSCommit()).toBe('true');
      expect(commit$Spy).toHaveBeenCalledTimes(1);
      expect(commit$Spy).toHaveBeenCalledWith(result);
    });
  });

  describe('#LMSGetLastError', () => {
    it('should return the last error code', () => {
      setupTest(new ScormCmiFixture({ mode: ScormCmiMode.CMI_MODE_BROWSE }));
      scormApi.lastErrorCode = ScormErrorCodes.NOT_INITIALIZED_ERROR;
      expect(scormApi.LMSGetLastError()).toBe(
        ScormErrorCodes.NOT_INITIALIZED_ERROR
      );
    });
  });

  describe('#LMSGetDiagnostic', () => {
    it('should return the last diagnostic message', () => {
      setupTest(new ScormCmiFixture({ mode: ScormCmiMode.CMI_MODE_BROWSE }));
      scormApi.lastDiagnosticMessage = 'this is a test diagnostic message';
      expect(scormApi.LMSGetDiagnostic()).toBe(
        'this is a test diagnostic message'
      );
    });
  });
  describe('#LMSGetErrorString', () => {
    it('should return an error description for the specified error code', () => {
      setupTest(new ScormCmiFixture({ mode: ScormCmiMode.CMI_MODE_BROWSE }));
      expect(
        scormApi.LMSGetErrorString(
          ScormErrorCodes.INVALID_SET_VALUE_ELEMENT_IS_KEYWORD_ERROR
        )
      ).toBe('Je kan geen waardes zetten voor keywords');
    });
  });
});

function setupTest(scormCmiFixture: ScormCmiFixture | any) {
  if (!scormCmiFixture) {
    scormApi = new ScormApi(undefined, ScormCmiMode.CMI_MODE_BROWSE);
  } else {
    scormApi = new ScormApi(scormCmiFixture, scormCmiFixture.mode);
  }
  commit$Spy = jest.spyOn(scormApi.commit$, 'next');
  LMSCommitSpy = jest.spyOn(scormApi, 'LMSCommit');

  scormApi.LMSInitialize();
}

function checkOutput(spy: jest.SpyInstance, expectedValue: any) {
  scormApi.LMSCommit();
  expect(spy).toHaveBeenCalledWith(new ScormCmiFixture(expectedValue));
}
