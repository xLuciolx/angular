import { MessageService } from './message.service';
import { Injectable } from '@angular/core';
import { Hero } from './hero';
// import { HEROES } from './mock-heroes';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
}

@Injectable()
export class HeroService {
  private heroesUrl = 'api/heroes' //Url to web api

  constructor(
    private messageService: MessageService, 
    private http: HttpClient,
  ) 
  { }

  /**Get heroes with uses of RxJS */
  // getHeroes(): Observable<Hero[]> {
  //   this.messageService.add('HeroService: fetched heroes')
  //   return of(HEROES)
  // }

  /**GET hero with HttpClient (from a server) */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log(`fetched heroes`)),
        catchError(this.handleError('getHeroes', []))
      )
  }

  /**Get hero with use of RxJS */
  // getHero(id:number): Observable<Hero> {
  //   this.messageService.add(`HeroService: fetched hero id=${id}`)
  //   // Find the hero corresponding to the id
  //   return of(HEROES.find(hero => hero.id === id))
  // }

  /**GET hero by id. Will 404 if not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`
    return this.http.get<Hero>(url)
      .pipe(
        tap(_=>this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      )
  }
  /**PUT: update the hero on the server */
  updatedHero(hero: Hero): Observable<any>{
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

  /**POST: add a new hero to the server */ 
  addHero(hero: Hero): Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      )
  }

  /**DELETE: delete the hero from the server */
  deleteHero( hero: Hero | number ): Observable<Hero> {
    // If the id is use to delete a hero ???
    const id = typeof hero === 'number' ? hero: hero.id
    const url = `${this.heroesUrl}/${id}`

    return this.http.delete<Hero>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      )
  }

  /**GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // If empty field return an empty array
      return of([])
    }
    return this.http.get<Hero[]>(`api/heroes/?name=${term}`)
      .pipe(
        tap(_ => this.log(`found heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      )
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message)
  }

 /**
 * Handle Http operation that failed.
 * Let the app continue
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }
}
