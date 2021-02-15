import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Hospital } from '../../../models/hospital.model';

import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  hospitales: Hospital[] = [];
  cargando = true;
  imgSubs: Subscription = new Subscription();

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService) { }

  ngOnDestroy(): void {
      this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImage
                    .pipe(delay(100))
                    .subscribe(img => {
                      this.cargarHospitales();
                    });
  }


  buscar(termino: string): any{
    if (termino.length === 0){
      return this.cargarHospitales();
    }

    this.busquedaService.buscar('hospitales', termino)
          .subscribe(res => {
            this.hospitales = res;
          });
  }


  cargarHospitales(): void{
    this.cargando = true;
    this.hospitalService.cargarHospitales()
          .subscribe(hospitales => {
            this.cargando = false;
            this.hospitales = hospitales;
          });
  }


  guardarCambios(hospital: Hospital): void{
    this.hospitalService.actualizarHospitales(hospital._id, hospital.nombre)
          .subscribe(res => {
            Swal.fire('Actualizado', hospital.nombre, 'success');
          });
  }


  eliminarHospital(hospital: Hospital): void{
    // console.log(hospital);
    this.hospitalService.borrarHospitales(hospital._id)
          .subscribe(res => {
            // Con esto actualizo para que me muestre la tabla sin el hosptal que borramos
            this.cargarHospitales();
            Swal.fire('Borrado', hospital.nombre, 'success');
          });
  }


  async abrirSweetAlert(): Promise<void>{
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo Hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    });

    if ( value && value.trim().length > 0) {
      this.hospitalService.crearHospitales(value)
          .subscribe((res: any) => {
            this.hospitales.push(res.hospital);
          });
    }
  }


  abrirModal(hospital: Hospital): void{
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }




}
