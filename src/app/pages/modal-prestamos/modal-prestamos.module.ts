import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalPrestamosPageRoutingModule } from './modal-prestamos-routing.module';

import { ModalPrestamosPage } from './modal-prestamos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalPrestamosPageRoutingModule
  ],
  declarations: [ModalPrestamosPage]
})
export class ModalPrestamosPageModule {}
