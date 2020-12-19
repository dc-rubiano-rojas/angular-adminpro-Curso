import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  titulo = '';
  titulosSubs$: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute) {

    // console.log(route.snapshot.children[0].data);

    this.titulosSubs$ = this.getDataRuta()
                              .subscribe( ({titulo}) => {
                                  this.titulo = titulo;
                                  document.title = `AdminPro - ${titulo}`;
                              });
  }



  ngOnDestroy(): void {
    this.titulosSubs$.unsubscribe();
  }


  getDataRuta(): Observable<any> {
    return this.router.events
                        .pipe(
                          filter((event: any) => event instanceof ActivationEnd),
                          filter((event: ActivationEnd) => event.snapshot.firstChild === null),
                          map((event: ActivationEnd) => event.snapshot.data),
                        );
  }


}
