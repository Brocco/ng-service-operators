import { Component } from '@angular/core';
import { concatMap, interval, map, Subject, switchMap, tap } from 'rxjs';
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
    map((pid) => ({ theId: pid })),

    this.dataService.switchPerson((obj) => obj.theId),

    // this.dataService.personGetter2(),
    tap((x) => (this.loadingText = ``))
  );

  constructor(private dataService: DataService) {}

  showPerson(personId: string) {
    this.personIdSubject.next(personId);
  }
}
