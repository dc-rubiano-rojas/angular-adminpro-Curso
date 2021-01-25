import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';

import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  profileForm: FormGroup;
  usuario: Usuario;
  imagenSubir: File;
  imgTemp: any = '';

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private fileUploadService: FileUploadService) {

    this.usuario = usuarioService.usuario;
    this.profileForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }


  actualizarPerfil(): void {
    // console.log(this.profileForm.value);
    this.usuarioService.actualizarUsuario(this.profileForm.value)
        .subscribe(res => {
          // De esta forma se me actualiza la informacion de inmediato ya que estoy
          // llamando la instancia Usuario del servicio y al actualizarla aca se me actualiza
          // en mi servicio y en todos los lugares en donde la tenga (singleton)
          const {nombre, email} = this.profileForm.value;
          this.usuario.nombre = nombre;
          this.usuario.email = email;

          Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
        }, err => {
          Swal.fire('Error', err.error.msg, 'error');
        });
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
    this.fileUploadService
        .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
        .then((img: any) => {
          console.log(img);
          this.usuario.img = img;
          Swal.fire('Guardado', 'Imagen fue guardada', 'success');
        })
        .catch(err => {
          console.log(err);
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        });
  }

}
