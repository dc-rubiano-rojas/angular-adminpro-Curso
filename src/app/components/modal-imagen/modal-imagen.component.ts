import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  imagenSubir: any;
  imgTemp: any;

  constructor(public modalImageService: ModalImagenService,
              public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }


  cerrarModal(): void{
    this.imgTemp = null;
    this.modalImageService.cerrarModal();
  }


  cambiarImage(event: any): any {
    const file = event.target.files[0];
    this.imagenSubir = file;

    if (!file){
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onload = () => {
      this.imgTemp = reader.result;
      // console.log(reader.result);
    };

  }


  subirImagen(): void{

    const id = this.modalImageService.id;
    const tipo = this.modalImageService.tipo;

    this.fileUploadService
        // .actualizarFoto(this.imagenSubir, tipo, id)
        .actualizarFoto(this.imagenSubir, tipo, id)
        .then((img: any) => {
          console.log(img);
          Swal.fire('Guardado', 'Imagen fue guardada', 'success');
          this.modalImageService.nuevaImage.emit(img);
          this.cerrarModal();
        })
        .catch(err => {
          console.log(err);
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        });
  }

}
