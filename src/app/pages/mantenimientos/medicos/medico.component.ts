import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

import { Hospital } from '../../../models/hospital.model';
import { Medico } from '../../../models/medico.model';

import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  medicoForm: FormGroup = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

  hospitales: Hospital[] = [];
  hospitalSeleccionado?: Hospital;
  medicoSeleccionado?: Medico;

  constructor(private fb: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params
                .subscribe(({id}) => this.cargarMedico(id));

    this.cargarHospitales();

    // El delay se usa para que me alcance a cargar la información en el hospitalesSeleccionado
    // para que cuando se muestre la imagen la alcance a mostrar
    this.medicoForm.get('hospital')?.valueChanges
        .pipe(
          delay(100)
        )
        .subscribe(hospitalId => {
          this.hospitalSeleccionado = this.hospitales.find(hospital => hospital._id === hospitalId);
        });
  }


  cargarMedico(id: string): void{
    if (id === 'nuevo') {
      return;
    }

    this.medicoService.obtenerMedicoPorId(id)
    .subscribe(medico => {
      // console.log(medico);
      if (!medico) {
        return this.router.navigateByUrl(`/dashboard/medicos`);
      } else {
        const {nombre, hospital: {_id} } = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({nombre, hospital: _id});
        return;
      }

    });
  }


  cargarHospitales(): void {
    this.hospitalService.cargarHospitales()
          .subscribe((hospitales: Hospital[]) => {
            this.hospitales = hospitales;
          });
  }


  guardarMedico(): void{
    const { nombre } = this.medicoForm.value;
    if (this.medicoSeleccionado) {
      // ACTUALIZAR
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      };

      this.medicoService.actualizarMedico(data)
              .subscribe(res => {
                Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
              });

    } else {
      // CREAR
      this.medicoService.crearMedico(this.medicoForm.value)
                .subscribe( res => {
                  // console.log(res);
                  Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
                  this.router.navigateByUrl(`/dashboard/medico/${res.medico._id}`);
                });
    }
  }



}
