import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CardInfoPrestamosComponent } from './card-info-prestamos/card-info-prestamos.component'


@NgModule({
  declarations: [CardInfoPrestamosComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [CardInfoPrestamosComponent],
})
export class ComponentesModule { }
