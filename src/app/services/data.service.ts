import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  delay,
  iif,
  map,
  mapTo,
  Observable,
  of,
  OperatorFunction,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { PeopleRespose, Person } from '../models';

@Injectable({ providedIn: 'root' })
export class DataService {
  private baseUrl = 'https://swapi.dev/api/people';
  constructor(private http: HttpClient) {}

  getPeople() {
    return this.http.get<PeopleRespose>(this.baseUrl).pipe(
      // delay(2000), // artificial delay
      map((results) =>
        results.results.map((person) => ({
          id: this.parseIdFromUrl(person.url),
          ...person,
        }))
      )
    );
  }

  // people$ = this.http.get<PeopleRespose>(this.baseUrl).pipe(
  //   delay(2000), // artificial delay
  //   map((results) =>
  //     results.results.map((person) => ({
  //       id: this.parseIdFromUrl(person.url),
  //       ...person,
  //     }))
  //   ));

  getPerson(personId: string) {
    return of(personId).pipe(this.switchPerson());
    // return this.http.get<Person>(`${this.baseUrl}/${personId}`).pipe(
    //   delay(2000), // artificial delay
    //   map((person) => ({
    //     id: this.parseIdFromUrl(person.url),
    //     ...person,
    //   }))
    // );
  }

  private parseIdFromUrl(url: string): string {
    return url.split('/').slice(-2)[0];
  }

  // switchPerson_: OperatorFunction<string, Person> = switchMap<
  //   string,
  //   Observable<Person>
  // >((personId) =>
  //   this.http.get<Person>(`${this.baseUrl}/${personId}`).pipe(
  //     // delay(2000), // artificial delay
  //     map(
  //       (person) =>
  //         ({
  //           id: this.parseIdFromUrl(person.url),
  //           ...person,
  //         } as Person)
  //     )
  //   )
  // );

  /**
   *
   * @param mapFunction mapping function to get the personId
   * @returns The person from the remote server
   */
  switchPerson(): OperatorFunction<string, Person> {
    return switchMap((personId: any) => {
      return this.http.get<Person>(`${this.baseUrl}/${personId}`).pipe(
        map((person) => ({
          id: this.parseIdFromUrl(person.url),
          ...person,
        }))
      );
    });
  }

  switchPersonMap<T>(
    project: (value: T) => string
  ): OperatorFunction<T, Person> {
    return pipe(map(project), this.switchPerson());
  }

  switchPersonPT<T>(
    context: T
  ): OperatorFunction<string, { context: T; person: Person }> {
    return pipe(
      this.switchPerson(),
      map((person) => ({ context, person }))
    );
  }
}
// switchPerson<T>(
//   thing: string | <T>(value: T) => string
// )
