import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalPrestamosPage } from './modal-prestamos.page';

const routes: Routes = [
  {
    path: '',
    component: ModalPrestamosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalPrestamosPageRoutingModule {}
