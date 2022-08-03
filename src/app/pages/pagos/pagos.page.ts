import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { iCredito, iPagos, iCreditoVencido } from '../../models/iCredito';
import { CreditosService } from '../../services/creditos/creditos-service.service'
import { CustomerService } from '../../services/customer-service.service'
import { iCustomer } from '../../models/iCustomer';

import * as moment from 'moment';
import { ModalPrestamosPage } from '../modal-prestamos/modal-prestamos.page'

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.page.html',
  styleUrls: ['./pagos.page.scss'],
})
export class PagosPage implements OnInit {

  fechaActual = moment().format('DD/MM/YYYY')
  flagCargando: any;
  listaCreditos: iCredito[] = [];
  listaClientes: iCustomer[] = [];
  totalCredito: number;
  totalAbiertos: number;
  totalLiquidacion: number;
  caja: number;
  filterCredit: string;
  arrayFilters: any[] = [{ value: 'Fecha', key: 'Fecha' }, { value: 'Monto crédito', key: 'Monto crédito' }, { value: 'Tipo', key: 'Tipo' }]
  longitudCreditos: number;
  listaCreditosVencidos: iCredito[] = []; //lista de creditos donde los pagos se encuentran vencidos
  listaCreditosVigentes: iCredito[] = []; //lista de creditos donde los pagos son del dia actual
  tipoVista = "vencidos";

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private modalController: ModalController,
    private creditosService: CreditosService,
    private customerService: CustomerService,
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    console.error("fechaActual: ", this.fechaActual)
    await this.showLoading()
    await this.cargaClientes()
    await this.loadListCredits()

    await this.espera(500)
    await this.hideLoading()
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
    })
  }

  async loadListCredits() {
    this.listaCreditos = []
    this.creditosService.getCreditList().subscribe(async (creditos) => {
      this.listaCreditos = creditos;
      this.longitudCreditos = this.listaCreditos.length
      this.listaCreditos = this.listaCreditos.filter(credito => credito.estado == 'abierto')
      await this.filtrarCreditosPorFecha()
      
    });
  }

  
  filtrarCreditosPersonasVisibles(listaCreditos: iCredito[]): iCredito[] {
    let newListaCreditos = []
    this.listaClientes.forEach((cliente) => {
      var temp = listaCreditos.filter(creditoVencido => creditoVencido.idCliente == cliente.$key)
      if (temp.length > 0) {
        temp.forEach((creditoVencido) => {
          newListaCreditos.push(creditoVencido)
        })
      }
    })
    return newListaCreditos;
  }

  cargaClientes() {
    this.customerService.getCustomerList().subscribe(async (clientes) => {
      var clientesVisibles = clientes.filter(cliente => cliente.visible)
      this.listaClientes = clientesVisibles;
    });



  }

  async filtrarCreditosPorFecha() {
    this.listaCreditosVencidos = []
    this.listaCreditosVigentes = []
    var tempVencidos: iCredito[] = []
    var tempVigentes: iCredito[] = []


    this.listaCreditos.forEach(async (credito) => {
      credito.diaPago = moment(credito.fechaPrestamo, 'DD/MM/YYYY').format('dd');
      let flagPagoVencido = false // si se encuentra un pago vencido se activa la bandera para guardarlo
      let flatPagoActual = false // si se encuentra un pago que coincide con el dia de hoy, se activa la bandera para guardar
      //console.log("CREDITO: ", credito.$key)
      //console.log("CLIENTE: ", credito.nombreCliente)
      let creditoVencido: any = credito
      let creditoVigente: any = credito

      let listPagos = Object.values(credito.listaPagos);
      creditoVencido.listaPagos = []
      listPagos.forEach((pago, idx) => {
        //console.log("fechaPago: ", moment(pago.fechaPago, 'DD/MM/YYYY').format('DD/MM/YYYY') + " < " + moment(this.fechaActual, 'DD/MM/YYYY').format('DD/MM/YYYY') + " == " + (moment(pago.fechaPago, 'DD/MM/YYYY') < moment(this.fechaActual, 'DD/MM/YYYY')))
        //console.log("fechaPago: ", moment(pago.fechaPago, 'DD/MM/YYYY').format('DD/MM/YYYY') + " == " + moment(this.fechaActual, 'DD/MM/YYYY').format('DD/MM/YYYY') + " => " + (moment(pago.fechaPago, 'DD/MM/YYYY') === moment(this.fechaActual, 'DD/MM/YYYY')))
        if ((moment(pago.fechaPago, 'DD/MM/YYYY') < moment(this.fechaActual, 'DD/MM/YYYY')) && pago.estado.toLowerCase() != 'completo') {
          creditoVencido.listaPagos.push(pago)
          flagPagoVencido = true
        }
        else if ((moment(pago.fechaPago, 'DD/MM/YYYY').format('DD/MM/YYYY') === moment(this.fechaActual, 'DD/MM/YYYY').format('DD/MM/YYYY')) && pago.estado.toLowerCase() != 'completo') {
          creditoVigente.listaPagos.push(pago)
          flatPagoActual = true
        }
      })
      console.log(" -- ")
      if (flagPagoVencido) {
        tempVencidos.push(creditoVencido)
      }
      else if (flatPagoActual) {
        tempVigentes.push(creditoVencido)
      }
    
    })
    this.listaCreditosVencidos = this.filtrarCreditosPersonasVisibles(tempVencidos)
    this.listaCreditosVigentes = this.filtrarCreditosPersonasVisibles(tempVigentes)
    //await this.filtrarCreditosPersonasVisibles()
    console.log("this.listaCreditosVencidos total: ", this.listaCreditosVencidos)
    console.log("this.listaCreditosVigentes total: ", this.listaCreditosVigentes)

  }

  async espera(tiempoEspera: number) {
    return new Promise(resolve => setTimeout(resolve, tiempoEspera));
  }

  showDetail(indice: number) {
    console.log("indice: ", indice)
    this.listaCreditosVencidos[indice].flagDetail = !this.listaCreditosVencidos[indice].flagDetail
    //console.log("this.listaCreditosVencidos[indice]: ", this.listaCreditosVencidos[indice])
  }

  async showCredits(creditoSeleccionado: iCredito) {
    console.log("creditoSeleccionado: ", creditoSeleccionado)
    await this.openModal('read', creditoSeleccionado);
  }

  async openModal(typeScreen: string, creditoSeleccionado: any) {
    const modal = await this.modalController.create({
      component: ModalPrestamosPage,
      cssClass: 'dynamicModalCss',
      componentProps: {
        'typeScreen': typeScreen,
        'creditoSeleccionado': creditoSeleccionado
      }
    });
    await modal.present();
  }

  cambioDeVista(event: any) {
    console.log("tipoVista: ", this.tipoVista)
  }

}


