import { UiActions, uiReducer } from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { BundlesViewModel } from './bundles.viewmodel';

class TestStore<T> {
  private state: BehaviorSubject<T> = new BehaviorSubject(undefined);

  setState(data: T) {
    this.state.next(data);
  }

  select(selector?: any): Observable<T> {
    return this.state.asObservable();
  }

  dispatch(action: any) {}
}
let dispatchSpy;

let bundlesViewModel: BundlesViewModel;
const uiStore = new TestStore<uiReducer.UiState>();
// const studentContentStatusStore = new TestStore<any>();

beforeEach(() => {
  bundlesViewModel = new BundlesViewModel(uiStore);
  dispatchSpy = jest.spyOn(uiStore, 'dispatch');
});

afterEach(() => {
  dispatchSpy.mockRestore();
});

test('it should return', () => {
  return;
});

describe('list format', () => {
  it('should set the list format to grid', () => {
    bundlesViewModel.changeListFormat(ListFormat.GRID);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new UiActions.SetListFormatUi({ listFormat: ListFormat.GRID })
    );
  });

  it('should set the list format to line', () => {
    bundlesViewModel.changeListFormat(ListFormat.LINE);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new UiActions.SetListFormatUi({ listFormat: ListFormat.LINE })
    );
  });
});

describe('save student content status', () => {
  // it('should update the student content status', () => {
  //   const studentContentStatus: StudentContentStatusInterface = {
  //     id: 1,
  //     unlockedContentId: 2,
  //     contentStatusId: 3
  //   };
  //   bundlesViewModel.saveStudentContentStatus(studentContentStatus);
  //   expect(dispatchSpy).toHaveBeenCalledTimes(1);
  //   expect(dispatchSpy).toHaveBeenCalledWith(
  //     new StudentContentInterfaceActions.UpdateStudentContentStatus({
  //       studentContentStatus: {
  //         id: 1,
  //         changes: {
  //           unlockedContentId: 2,
  //           contentStatusId: 3
  //         }
  //       }
  //     })
  //   );
  // });
});
