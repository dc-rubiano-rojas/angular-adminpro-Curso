import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: ['./promesas.component.css']
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios().then(usuarios => {
      console.log(usuarios);
    });

    // this.getUsuarios();

    // const promesa = new Promise((resolve, reject) => {
    //   if (false) {
    //     resolve('HOLA MUNDO');
    //   } else {
    //     reject('ALGO SALIO MAL');
    //   }
    // });

    // promesa
    //   .then((mensaje) => {
    //     console.log(mensaje);
    //   })
    //   .catch(err => {
    //     console.log('ERROR EN MI PROMESA', err);
    //   });

    // console.log('FIN DEL INIT');
  }


  getUsuarios(): Promise<any>{

    return new Promise(resolve => {
      fetch('https://reqres.in/api/users')
        .then(res => res.json() )
        .then(body => resolve(body.data));
    });
  }

}
