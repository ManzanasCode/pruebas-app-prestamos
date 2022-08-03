import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalClientesPageRoutingModule } from './modal-clientes-routing.module';

import { ModalClientesPage } from './modal-clientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalClientesPageRoutingModule
  ],
  declarations: [ModalClientesPage]
})
export class ModalClientesPageModule {}
