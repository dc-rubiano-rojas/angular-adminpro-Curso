import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Hospital } from '../models/hospital.model';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})


export class HospitalService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(): object {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  cargarHospitales(): Observable<any> {
    return this.http.get<{ok: boolean, hospitales: Hospital[]}>(`${url}/hospitales`, this.headers)
          .pipe(
            map( res => res.hospitales)
          );
  }


  crearHospitales(nombre: string): Observable<any> {
    return this.http.post(`${url}/hospitales`, {nombre}, this.headers);
  }


  actualizarHospitales(id: string|any, nombre: string): Observable<any> {
    return this.http.put(`${url}/hospitales/${id}`, {nombre}, this.headers);
  }


  borrarHospitales(id: string| any): Observable<any> {
    return this.http.delete(`${url}/hospitales/${id}`, this.headers);
  }
}
