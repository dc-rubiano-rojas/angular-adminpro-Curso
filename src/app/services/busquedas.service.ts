import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const url = environment.url;


@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(): object {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }


  private transformarUsuarios(resultados: any[]): Usuario[]{
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
    );
  }


  private transformarHospitales(resultados: any[]): Hospital[]{
    return resultados;
  }


  private transformarMedicos(resultados: any[]): Medico[]{
    return resultados;
  }


  buscar(tipo: 'usuarios'|'medicos'|'hospitales', termino: string ): Observable<any> {
    return this.http.get<any[]>(`${url}/todo/coleccion/${tipo}/${termino}`, this.headers)
                .pipe(
                  map( (res: any) => {
                    // return res;
                    switch (tipo) {
                      case 'usuarios':
                        return this.transformarUsuarios(res.resultados);
                        break;

                      case 'hospitales':
                        return this.transformarHospitales(res.resultados);
                        break;

                      case 'medicos':
                        return this.transformarMedicos(res.resultados);
                        break;

                      default:
                        return [];
                    }
                  })
                );
  }

}
