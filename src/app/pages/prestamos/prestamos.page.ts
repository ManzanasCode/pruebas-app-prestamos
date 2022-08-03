import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalPrestamosPage } from '../modal-prestamos/modal-prestamos.page'
import { iCredito, iPagos } from '../../models/iCredito';
import { CreditosService } from '../../services/creditos/creditos-service.service'
import * as moment from 'moment';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.page.html',
  styleUrls: ['./prestamos.page.scss'],
})

export class PrestamosPage implements OnInit {

  flagCargando: any;
  listaCreditos: iCredito[] = [];
  totalCredito: number;
  totalAbiertos: number;
  totalLiquidacion: number;
  caja: number;
  filterCredit: string;
  arrayFilters: any[] = [{ value: 'Fecha', key: 'Fecha' }, { value: 'Monto crédito', key: 'Monto crédito' }, { value: 'Tipo', key: 'Tipo' }]
  longitudCreditos: number;
  currentDate: Date = new Date()

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private modalController: ModalController,
    private creditosService: CreditosService,
  ) { }

  async ngOnInit() {
    
  }

  async ionViewWillEnter() {
    await this.showLoading()
    await this.loadListCredits()
    await this.espera(500)
    await this.hideLoading()
  }

  async showCredits(creditoSeleccionado: iCredito) {
    await this.openModal('read', creditoSeleccionado);
  }

  async newCredit() {
    await this.openModal('create', {});
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

  async loadListCredits() {
    this.creditosService.getCreditList().subscribe(async (creditos) => {
      this.listaCreditos = creditos;
      this.longitudCreditos = this.listaCreditos.length
      this.listaCreditos = this.listaCreditos.filter(credito => credito.estado == 'abierto')
      this.listaCreditos = this.listaCreditos.filter(credito => credito.idCliente != '-MjQOaQCNDVTYa5jYfR7' && credito.idCliente != '-MjQO5Iv9A9aFJZGFUUr' )
      console.log(this.listaCreditos)
      await this.analizaDatos()
    });
  }

  async analizaDatos() {
    this.totalCredito = 0;
    this.totalLiquidacion = 0;
    this.totalAbiertos = 0
    this.listaCreditos.forEach((credito: iCredito, indice, array) => {
      credito.diaPago = moment(credito.fechaPrestamo,'DD/MM/YYYY').format('dd');
      //console.log('Dia de pago: ', moment(credito.fechaPrestamo,'DD/MM/YYYY').format('dd'))
      this.totalCredito += credito.utilidad
      this.totalLiquidacion += credito.montoLiquidado
      if (credito.estado == 'abierto') { this.totalAbiertos++ }
    })
    //this.caja = this.totalCredito - this.totalLiquidacion
  }

  async espera(tiempoEspera: number) {
    return new Promise(resolve => setTimeout(resolve, tiempoEspera));
  }
  
}
