import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Medico } from '../models/medico.model';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

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

  cargarMedicos(): Observable<any>{
    return this.http.get<{ok: boolean, medicos: Medico[]}>(`${url}/medicos`, this.headers)
    .pipe(
      map( res => res.medicos)
    );
  }

  obtenerMedicoPorId(id: string): Observable<any> {
    return this.http.get<{ok: boolean, medico: Medico}>(`${url}/medicos/${id}`, this.headers)
    .pipe(
      map( res => res.medico)
    );
  }



  crearMedico(medico: {nombre: string, hospital: string}): Observable<any> {
    return this.http.post<Medico>(`${url}/medicos`, medico, this.headers);
  }


  actualizarMedico(medico: Medico): Observable<any> {
    return this.http.put(`${url}/medicos/${medico._id}`, medico, this.headers);
  }


  borrarMedico(id: string| any): Observable<any> {
    return this.http.delete(`${url}/medicos/${id}`, this.headers);
  }


}
