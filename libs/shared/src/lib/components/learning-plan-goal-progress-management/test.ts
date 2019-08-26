import { DalState, EduContentTOCInterface } from '@campus/dal';
import { createSelector } from '@ngrx/store';

export interface TestState {
  eduContentTocs: EduContentTOCInterface[];
}

export const initialState: TestState = {
  eduContentTocs: []
};

export function testReducer(state = initialState, action: any): TestState {
  return initialState;
}

export const selectFeature = (state: DalState) => state.eduContentTocs;

export const getLessonDisplaysForBook = createSelector(
  selectFeature,
  (state, props: { bookId: number; learningPlanGoalId: number }) => {
    console.log(props);
    return props;
  }
);
