import { Component } from '@angular/core';
import {
  concatMap,
  interval,
  map,
  of,
  Subject,
  switchMap,
  tap,
  forkJoin,
} from 'rxjs';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'service-pattern-playground';

  private personIdSubject = new Subject<string>();
  loadingText = '';

  people$ = this.dataService.getPeople();

  detailedPeople$ = this.people$.pipe(
    map((people) => people.map((per) => per.id)),
    switchMap((personIds) => {
      return forkJoin(
        personIds.map((personId) => {
          // return of(personId).pipe(this.dataService.switchPerson());
          return this.dataService.getPerson(personId);
        })
      );
    })
  );

  // person$ = this.personIdSubject.pipe(
  //   tap((personId) => (this.loadingText = `loading ${personId}`)),
  //   switchMap((personId) => this.dataService.getPerson(personId)),
  //   tap(() => (this.loadingText = ``))
  // );
  // person$ = this.personIdSubject.pipe(
  //   tap((personId) => (this.loadingText = `loading ${personId}`)),
  //   this.dataService.personMap,
  //   tap(() => (this.loadingText = ``))
  // );
  person$ = this.personIdSubject.pipe(
    tap((personId) => (this.loadingText = `loading ${personId}`)),
    map((pid) => ({ theId: pid })), // simulates an object

    // map((obj) => obj.theId), // maps object to just the string id
    // this.dataService.switchPerson(),

    this.dataService.switchPersonMap((obj) => obj.theId),

    // this.dataService.personGetter2(),
    tap((x) => (this.loadingText = ``))
  );

  constructor(private dataService: DataService) {}

  showPerson(personId: string) {
    this.personIdSubject.next(personId);
  }
}
