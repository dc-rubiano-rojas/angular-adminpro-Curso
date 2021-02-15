import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

const url = environment.url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: any, tipo: 'usuario'| 'medicos'|'hospitales'): string {
 
    if (!img) {
        return `${url}/upload/usuarios/no-image`;
    } else if (img.includes('https')) {
        return img;
    } else if (img) {
        return `${url}/upload/${tipo}/${img}`;
    } else {
        return `${url}/upload/usuarios/no-image`;
    }
  }

}
