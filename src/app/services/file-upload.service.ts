import { Injectable } from '@angular/core';
import { promise } from 'protractor';
import { environment } from '../../environments/environment';

const url_base = environment.url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {


  constructor() { }

  async actualizarFoto(archivo: File, tipo: any, id: any): Promise<any>{
     try{
        const url = `${url_base}/upload/${tipo}/${id}`;
        const formData = new FormData();
        formData.append('imagen', archivo);

        const resp = await fetch(url, {
          method: 'PUT',
          headers: {
            'x-token': localStorage.getItem('token') || ''
          },
          body: formData
        });
        // El fetch viene como encapsulado y para abrirlo tengo que hacer el .json()
        const data = await resp.json();

        if (data.ok) {
          return data.nombreArchivo;
        } else {
          console.log(data);
          return false;
        }
     }catch (error) {
       console.log(error);
       return false;
     }
  }

}
