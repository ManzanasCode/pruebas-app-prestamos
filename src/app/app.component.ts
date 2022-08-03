import { Component } from '@angular/core';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private navController: NavController) {
    this.initializeApp();
  }

  initializeApp() {
    //this.navController.navigateRoot('/tabs/home').then();
    moment.defineLocale('es', {
      months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
      monthsShort: 'Enero._Febrero._Marzo_Abril._Mayo_Junio_Julio._Agosto_Septiembre._Octubre._Noviembre._Diciembre.'.split('_'),
      weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
      weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
      weekdaysMin: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_')
    });

    moment.locale("ES");
  }
}
