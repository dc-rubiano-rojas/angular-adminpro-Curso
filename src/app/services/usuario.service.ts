import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';

const url = environment.url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  auth2: any;
  usuario: Usuario;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {
    this.googleInit(); // Esto solo se ejectua una unica vez. Cada vez que se entra por primera vez a la app
    this.usuario = new Usuario('', '', '', '', false, '', '');
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string{
    return this.usuario.uid || '';
  }


  googleInit(): Promise<any> {

    return new Promise(resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '89649149439-ra8vebs3ri7q21rur1v63tbhgeublo0r.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    });

  }

  logout(): void{
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {
      // NgZone se usa cuando estamos trabajando con librerías externas
      // Me permite correr en Angular aunque se ejecuten fuera del mismo
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }


  // IMPORTANTE!!!
  // Aca llenamos la informacion del usuario para poder usar id y demas
  validarToken(): Observable<boolean> {
    return this.http.get(`${url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (res: any) => {
        const { email, google, nombre, role, uid, img = '' } = res.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        localStorage.setItem('token', res.token);
        return true;
      }),
      // map( (res: any) => true), // Si hay respuesta me retorna true
      catchError(error => of(false))
      // El of de rx me permite crear un observable en base al valor que pongamos (en este caso un observable que me envie false)
    );
  }


  crearUsuario(formData: RegisterForm): Observable<any>{
    return this.http.post(`${url}/usuarios`, formData)
                    .pipe(
                      tap((res: any) => {
                        localStorage.setItem('token', res.token);
                      })
                    );
  }

  actualizarUsuario(data: {email: string, nombre: string, role: any}): Observable<any> {

    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put(`${url}/usuarios/${this.uid}`, data,  {
      headers: {
        'x-token': this.token
      }
    });
  }

  login(formData: LoginForm): Observable<any>{
    return this.http.post(`${url}/login`, formData)
                    .pipe(
                      tap((res: any) => {
                        localStorage.setItem('token', res.token);
                      })
                    );
  }

  loginGoogle(token: any): Observable<any>{
    return this.http.post(`${url}/login/google`, {token})
                    .pipe(
                      tap((res: any) => {
                        localStorage.setItem('token', res.token);
                      })
                    );
  }


}
