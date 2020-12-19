import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any[] = [
    {
      titulo: 'Dashboard',
      icono: 'mdi mdi-gauge',
      submenu: [
        {titulo: 'Main', url: '/'},
        {titulo: 'ProgressBar', url: 'progress'},
        // la ruta realmente es '/dashboard/chart' pero al ponerla sin / 
        // la agrega a la ruta actual que en este casi es dashboard
        {titulo: 'Gráficas', url: 'chart'},
        {titulo: 'Promesas', url: 'promesas'},
        {titulo: 'RxJs', url: 'rxjs'},
      ]
    },

  ];

  constructor() { }
}
