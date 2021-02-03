import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from '../../../models/usuario.model';

import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  totalUsuarios = 0;
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];

  imgSubs: Subscription = new Subscription();
  desde = 0;
  cargando = true;

  constructor(private usuarioService: UsuarioService,
              private busquedasService: BusquedasService,
              public modalImagenService: ModalImagenService) { }

  ngOnDestroy(): void {
      this.imgSubs.unsubscribe();
  }


  ngOnInit(): void {
    this.cargarUsuarios();
    // El delay se hace porque se actualiza muy rapido y no alcanza a cargar la
    // nueva imagen entonces de esta forma carga la imagen y luego carga la pagina
    this.imgSubs = this.modalImagenService.nuevaImage
              .pipe(
                delay(100)
              )
              .subscribe(img => {
                this.cargarUsuarios();
              });
  }


  cargarUsuarios(): void {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
                        .subscribe( ({total, usuarios}) => {
                          this.totalUsuarios = total;
                          this.usuarios = usuarios;
                          this.usuariosTemp = usuarios;
                          this.cargando = false;
                        });
  }


  cambiarPagina(valor: number): void {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }


  buscar(termino: string): any {

    if (termino.length === 0){
      return this.usuarios = this.usuariosTemp;
    }
    this.busquedasService.buscar('usuarios', termino)
                  .subscribe(res => {
                    this.usuarios = res;
                  });

  }


  eliminarUsuario(usuario: Usuario): any{

    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrrar ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario)
            .subscribe(res => {
              Swal.fire(
                'Usuario borrado',
                `${usuario.nombre} ha sido eliminado`,
                'success'
              );
              this.cargarUsuarios();
            });
      }
    });

  }


  cambiarRole(usuario: Usuario): void {
    this.usuarioService.guardarUsuario(usuario)
              .subscribe(res => console.log(res));
  }


  abrirModal(usuario: Usuario): void {
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}
