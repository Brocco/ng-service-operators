import { NgModule } from '@angular/core';
import {
  createAction,
  createReducer,
  on,
  props,
  StoreModule,
} from '@ngrx/store';
import { Person } from './models';

export const loadPerson = createAction(
  'Load Person',
  props<{ personId: string }>()
);
export const loadPersonSuccess = createAction(
  'Load Person Success',
  props<{ person: Person }>()
);

export interface State {
  loadingPeople: boolean;
  loadingPerson: boolean;
  people: Person[];
  selectedPerson: Person | undefined;
}

const initialState: State = {
  people: [],
  loadingPeople: false,
  selectedPerson: undefined,
  loadingPerson: false,
};

export const myReducer = createReducer(
  initialState,
  on(loadPerson, (state) => ({
    ...state,
    loadingPerson: true,
  })),
  on(loadPersonSuccess, (state, { person }) => ({
    ...state,
    loadingPerson: false,
    selectedPerson: person,
  }))
);

@NgModule({
  imports: [StoreModule.forRoot({ game: myReducer })],
})
export class MyStoreModule {}
