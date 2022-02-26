import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { firstValueFrom, map, mapTo, of } from 'rxjs';
import { AppComponent } from './app.component';
import { DataService } from './services/data.service';

describe('AppComponent', () => {
  let dataService = {} as any;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: DataService, useValue: dataService }],
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('should work', () => {
    const person = { foo: 'bar' } as any;

    dataService.switchPerson = jest.fn().mockReturnValue(mapTo(person));

    dataService.getPeople = () => of(null);

    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    const promise = firstValueFrom(component.person$).then((p) => {
      expect(p).toEqual(person);
      expect(dataService.switchPerson).toHaveBeenCalled();
      expect(dataService.switchPerson).toHaveBeenCalledTimes(1);
    });

    component.showPerson('1');

    return promise;
  });
});
