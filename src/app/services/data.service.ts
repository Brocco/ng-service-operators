import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable, of, OperatorFunction, switchMap } from 'rxjs';

interface PeopleRespose {
  results: Person[];
}
interface Person {
  id?: string;
  url: string;
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
}

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
    // return of(personId).pipe(this.personGetter2());
    return this.http.get<Person>(`${this.baseUrl}/${personId}`).pipe(
      delay(2000), // artificial delay
      map((person) => ({
        id: this.parseIdFromUrl(person.url),
        ...person,
      }))
    );
  }

  private parseIdFromUrl(url: string): string {
    return url.split('/').slice(-2)[0];
  }

  personMap: OperatorFunction<string, Person> = switchMap<
    string,
    Observable<Person>
  >((personId) =>
    this.http.get<Person>(`${this.baseUrl}/${personId}`).pipe(
      // delay(2000), // artificial delay
      map(
        (person) =>
          ({
            id: this.parseIdFromUrl(person.url),
            ...person,
          } as Person)
      )
    )
  );
  /**
   *
   * @param mapFunction mapping function to get the personId
   * @returns The person from the remote server
   */
  switchPerson<T>(
    mapFunction?: (...args: any[]) => string
  ): OperatorFunction<T, Person> {
    return switchMap<T, Observable<Person>>((...args) => {
      // gets the id
      const id = !!mapFunction ? mapFunction(...args) : args[0];

      return this.http.get<Person>(`${this.baseUrl}/${id}`).pipe(
        map((person) => ({
          id: this.parseIdFromUrl(person.url),
          ...person,
        }))
      );
    });
  }
}
