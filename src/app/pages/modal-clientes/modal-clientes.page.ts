import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { iCustomer } from '../../models/iCustomer';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { CustomerService } from '../../services/customer-service.service'
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators'
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-modal-clientes',
  templateUrl: './modal-clientes.page.html',
  styleUrls: ['./modal-clientes.page.scss'],
})
export class ModalClientesPage implements OnInit {
  newCustomer: iCustomer = {
    $key: "",
    nombreCompleto: "",
    genero: "",
    fecha_creacion: moment().format('DD/MM/YYYY'),
    fecha_nac: "",
    creditos: [],
    movil: "",
    extra: {
      montoCredito: 0,
      montoLiquidado: 0,
    }
  }

  @Input() typeScreen: string;
  @Input() clienteSeleccionado: iCustomer;
  tituloPagina: string;

  constructor(
    private modalController: ModalController,
    private customerService: CustomerService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    if (this.typeScreen == 'read') {
      this.tituloPagina = "Informacion del cliente"
      this.newCustomer = this.clienteSeleccionado;
    }
    else if (this.typeScreen == 'create') 
      this.tituloPagina = "Nuevo cliente"
  }

  async closeModal() {
    this.modalController.dismiss({
      "data": "this.numTicket"
    });
  }

  async addCustomer() {
    this.customerService.createCustomer(this.newCustomer).then(async (res) => {
      this.showAlert("CLiente agregado exitosamente", "")
      await this.espera(1000)
    })
  }

  async updateCustomer() {
    this.newCustomer.fecha_nac = moment(this.newCustomer.fecha_nac).format("DD/MM/YYYY")
    this.customerService.updateCustomer(this.newCustomer.$key, this.newCustomer).then(async (res) => {
      this.showAlert("CLiente actualizado exitosamente", "")
      await this.espera(1000)
    })
  }

  async espera(tiempoEspera: number) {
    return new Promise(resolve => setTimeout(resolve, tiempoEspera));
  }

  showAlert(title: string, message: string) {
    let alert = this.alertController.create({
      header: title,
      buttons: ['Aceptar']
    }).then(async (res) => {
      res.present();
      await this.espera(2000)
      await this.closeModal()
    });
  }

}
