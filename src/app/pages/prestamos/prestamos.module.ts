import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PrestamosPageRoutingModule } from './prestamos-routing.module';
import { PrestamosPage } from './prestamos.page';
import { ModalPrestamosPage } from '../modal-prestamos/modal-prestamos.page'
import { ModalPrestamosPageModule } from '../modal-prestamos/modal-prestamos.module'
import { ComponentesModule } from '../../components/componentes.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrestamosPageRoutingModule,
    ModalPrestamosPageModule, 
    ComponentesModule
  ],
  declarations: [PrestamosPage],
  entryComponents: [ModalPrestamosPage]
})
export class PrestamosPageModule {}
