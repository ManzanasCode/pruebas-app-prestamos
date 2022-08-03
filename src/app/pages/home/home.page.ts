import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CustomerService } from '../../services/customer-service.service'
import { iCustomer } from '../../models/iCustomer';
import { CreditosService } from '../../services/creditos/creditos-service.service'
import { iCredito, iPagos } from '../../models/iCredito';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  flagCargando: any;
  listaCreditos: iCredito[];
  listaClientes: iCustomer[];
  totalClientes: number;
  totalCreditos: number;
  totalCreditosAbiertos: number;
  totalCreditosLiquidados: number;
  totalCredito: number;
  totalAbiertos: number;
  totalLiquidacion: number;
  creditoRestante: number;

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private modalController: ModalController,
    private customerService: CustomerService,
    private creditosService: CreditosService

  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.showLoading()
    await this.cargaDatos()
    await this.espera(500)
    await this.hideLoading()
  }

  async cargaDatos() {
    
    this.customerService.getCustomerList().subscribe(async (clientes) => {
      this.listaClientes = clientes;
      this.totalClientes = clientes.length
    });

    this.creditosService.getCreditList().subscribe(async (creditos) => {
      this.listaCreditos = creditos;
      let abiertos = this.listaCreditos.filter(credito => credito.estado == 'abierto')
      let liquidados = this.listaCreditos.filter(credito => credito.estado == 'liquidado')
      this.totalCreditos = this.listaCreditos.length
      this.totalCreditosAbiertos = abiertos.length;
      this.totalCreditosLiquidados = liquidados.length;
      await this.analizaDatos()
    });
  }

  async analizaDatos() {
    this.totalCredito = 0;
    this.totalLiquidacion = 0;
    this.totalAbiertos = 0
    this.listaCreditos.forEach((credito: iCredito, indice, array) => {
      console.log('credito: ', credito)
      this.totalCredito += credito.utilidad
      this.totalLiquidacion += credito.montoLiquidado
      if (credito.estado == 'abierto') { this.totalAbiertos++ }
    })
    this.creditoRestante = this.totalCredito - this.totalLiquidacion
  }

  async showLoading() {
    this.flagCargando = await this.loadingController.create({
      message: 'Espere por favor...',
    });
    await this.flagCargando.present();
  }

  async hideLoading() {
    this.flagCargando.dismiss();
  }

  showAlert(title: string, message: string) {
    let alert = this.alertController.create({
      header: title,
      message: message,
      buttons: ['Aceptar']
    }).then(async (res) => {
      res.present();
    });
  }

  async espera(tiempoEspera: number) {
    return new Promise(resolve => setTimeout(resolve, tiempoEspera));
  }

}
