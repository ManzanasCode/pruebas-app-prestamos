import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalClientesPrestamosPage } from './modal-clientes-prestamos.page';

const routes: Routes = [
  {
    path: '',
    component: ModalClientesPrestamosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalClientesPrestamosPageRoutingModule {}
