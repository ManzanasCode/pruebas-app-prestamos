import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalPrestamosPage } from '../modal-prestamos/modal-prestamos.page'
import { iCredito, iPagos } from '../../models/iCredito';
import { CreditosService } from '../../services/creditos/creditos-service.service'
import { iCustomer } from '../../models/iCustomer';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-clientes-prestamos',
  templateUrl: './modal-clientes-prestamos.page.html',
  styleUrls: ['./modal-clientes-prestamos.page.scss'],
})
export class ModalClientesPrestamosPage implements OnInit {


  @Input() clienteSeleccionado: iCustomer;
  flagCargando: any;
  listaCreditos: iCredito[] = [];
  masterListaCreditos: iCredito[] = [];

  totalLiquidados: number = 0;
  totalAbiertos: number = 0;
  totalVencidos: number = 0;

  totalCredito: number;
  caja: number;
  filterCredit: string;
  arrayFilters: any[] = [
    { total:0, value: 'Liquidado', key: 'Liquidado' }, 
    { total:0, value: 'Abierto', key: 'Abierto' }, 
    { total:0, value: 'Vencido', key: 'Vencido' }
  ]
  longitudCreditos: number;

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private modalController: ModalController,
    private creditosService: CreditosService,
  ) { }

  ngOnInit() {
    console.error("ngOnInit")
    this.filterCredit = 'Abierto'
  }

  async closeModal() {
    this.modalController.dismiss({
      "data": "this.numTicket"
    });
  }

  async ionViewWillEnter() {
    console.log("ionViewWillEnter ModalClientesPrestamosPage")
    await this.showLoading()
    console.log("Paso 1: Cargar creditos")
    await this.loadListCredits()
    await this.espera(500)
    console.log("Paso 2: Filtrar creditos")
    await this.filtrarCreditos()
    await this.hideLoading()
  }

  async filtrarCreditos() {
    this.totalLiquidados = 0
    this.totalAbiertos = 0
    this.totalVencidos = 0
    this.listaCreditos = []
    this.listaCreditos = this.masterListaCreditos
    this.totalLiquidados = this.listaCreditos.filter(credito => credito.estado == 'liquidado').length
    this.totalAbiertos = this.listaCreditos.filter(credito => credito.estado == 'abierto').length
    this.totalVencidos = this.listaCreditos.filter(credito => credito.estado == 'vencido').length
    this.arrayFilters.forEach((filter)=> {
      if(filter.value == "Liquidado") filter.total = this.totalLiquidados
      else if(filter.value == "Abierto") filter.total = this.totalAbiertos
      else if(filter.value == "Vencido") filter.total = this.totalVencidos
    })

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

  async loadListCredits() {
    this.listaCreditos = []
    this.masterListaCreditos = []
    this.creditosService.getCreditList().subscribe(async (creditos) => {
      creditos.forEach((credit: iCredito) => {
        credit.diaPago = moment(credit.fechaPrestamo, 'DD/MM/YYYY').format('dd');
        //if(this.clienteSeleccionado.$key == credit.idCliente)
        if (this.clienteSeleccionado.nombreCompleto == credit.nombreCliente) {
          //console.log("credit founded: ", credit)
          this.masterListaCreditos.push(credit)
        }
      })
    });
  }

  async showCredits(creditoSeleccionado: iCredito) {
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

  filstrosChange(event: any) {
    const valueEvent = event.detail.value.toLowerCase()
    this.listaCreditos = this.masterListaCreditos
    this.listaCreditos = this.listaCreditos.filter((credito: iCredito) => credito.estado == valueEvent)
  }

}