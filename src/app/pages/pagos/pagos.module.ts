import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PagosPageRoutingModule } from './pagos-routing.module';
import { PagosPage } from './pagos.page';
import { ModalPrestamosPage } from '../modal-prestamos/modal-prestamos.page'
import { ModalPrestamosPageModule } from '../modal-prestamos/modal-prestamos.module'
import { ComponentesModule } from '../../components/componentes.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagosPageRoutingModule,
    ModalPrestamosPageModule,
    ComponentesModule
  ],
  declarations: [PagosPage],
  entryComponents: [ModalPrestamosPage]
})
export class PagosPageModule {}
