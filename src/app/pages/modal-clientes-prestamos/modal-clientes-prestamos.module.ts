import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalClientesPrestamosPageRoutingModule } from './modal-clientes-prestamos-routing.module';
import { ModalClientesPrestamosPage } from './modal-clientes-prestamos.page';
import { ModalPrestamosPage } from '../modal-prestamos/modal-prestamos.page'
import { ModalPrestamosPageModule } from '../modal-prestamos/modal-prestamos.module'
import { ComponentesModule } from '../../components/componentes.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalClientesPrestamosPageRoutingModule,
    ModalPrestamosPageModule,
    ComponentesModule
  ],
  declarations: [ModalClientesPrestamosPage],
  entryComponents: [ModalPrestamosPage]
})
export class ModalClientesPrestamosPageModule {}
