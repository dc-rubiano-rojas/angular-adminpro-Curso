import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Medico } from '../../../models/medico.model';

import { MedicoService } from '../../../services/medico.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  medicos: Medico[] = [];
  cargando = true;
  imgSubs: Subscription = new Subscription();


  constructor(private medicosService: MedicoService,
              private busquedaService: BusquedasService,
              private modalImagenService: ModalImagenService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImage
                        .pipe(delay(100))
                        .subscribe(img => {
                            this.cargarMedicos();
                        });
  }


  buscar(medicoTermino: string): void{
    if (medicoTermino.length === 0){
      return this.cargarMedicos();
    }

    this.busquedaService.buscar('medicos', medicoTermino)
          .subscribe(res => {
            this.medicos = res;
          });
  }


  cargarMedicos(): void {
    this.cargando = true;
    this.medicosService.cargarMedicos()
        .subscribe(medicos => {
          this.cargando = false;
          this.medicos = medicos;
          // console.log(medicos);
        });
  }


  abrirModal(medico: Medico): void{
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
    console.log(medico);
  }


  borrarMedico(medico: Medico): void{
    Swal.fire({
      title: '¿Borrar Médico?',
      text: `Esta a punto de borrrar ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicosService.borrarMedico(medico._id)
            .subscribe(res => {
              Swal.fire(
                'Usuario borrado',
                `${medico.nombre} ha sido eliminado`,
                'success'
              );
              this.cargarMedicos();
            });
      }
    });
  }

}
