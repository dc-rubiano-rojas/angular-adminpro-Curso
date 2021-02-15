import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private ocultarModel = true;
  tipo?: 'usuarios'|'hospitales'|'medicos';
  id = '';
  // tslint:disable-next-line:no-inferrable-types
  img?: string = '';

  // Con esto emito el url de la nueva imagen
  // y con esto se actualiza de inmediato
  // Se esta emitiendo la imagen del componente del modal
  nuevaImage: EventEmitter<string> = new EventEmitter<string>();



  get ocultarModal(): boolean { // Esto es lo que llamo en mi modal html
    return this.ocultarModel;
  }

  abrirModal(tipo: 'usuarios'|'hospitales'|'medicos', id: any, img: string = 'no-img'): void {
    this.ocultarModel = false;
    this.tipo = tipo;
    this.id = id;

    if (img?.includes('https')) {
      this.img = img;
    } else {
      this.img = `${url}/upload/${tipo}/${img}`;
    }
  }

  cerrarModal(): void {
    this.ocultarModel = true;
  }

  constructor() { }
}
