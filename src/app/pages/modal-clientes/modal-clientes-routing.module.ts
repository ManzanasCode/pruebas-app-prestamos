import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalClientesPage } from './modal-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: ModalClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalClientesPageRoutingModule {}
