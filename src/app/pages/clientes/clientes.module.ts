import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClientesPageRoutingModule } from './clientes-routing.module';
import { ClientesPage } from './clientes.page';
import { ModalClientesPage } from '../modal-clientes/modal-clientes.page';
import { ModalClientesPageModule } from '../modal-clientes/modal-clientes.module';
import { PipesModule } from '../../pipes/pipe.module'
import { ModalClientesPrestamosPageModule } from '../modal-clientes-prestamos/modal-clientes-prestamos.module'
import { ModalClientesPrestamosPage } from '../modal-clientes-prestamos/modal-clientes-prestamos.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientesPageRoutingModule,
    ModalClientesPageModule,
    ModalClientesPrestamosPageModule,
    PipesModule
  ],
  declarations: [ClientesPage],
  entryComponents: [ModalClientesPage, ModalClientesPrestamosPage]
})
export class ClientesPageModule {}
