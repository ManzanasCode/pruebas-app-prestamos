import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalClientesPage } from '../modal-clientes/modal-clientes.page';
import { CustomerService } from '../../services/customer-service.service'
import { iCustomer } from '../../models/iCustomer';
import { CreditosService } from '../../services/creditos/creditos-service.service'
import { iCredito, iPagos } from '../../models/iCredito';
import { ModalClientesPrestamosPage } from '../modal-clientes-prestamos/modal-clientes-prestamos.page'


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {

  flagCargando: any;
  
  listaClientesPantalla: iCustomer[] = [];// este es el arreglo que se muesta en pantalla
  totalClientes: number;
  customerSelected: iCustomer;
  textSearchBar: string = '';
  listaCreditos: iCredito[];
  listaClientes: iCustomer[];
  
  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private modalController: ModalController,
    private customerService: CustomerService,
    private creditosService: CreditosService
  ) { }

  async ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.showLoading()
    await this.cargaDatos()
    await this.espera(500)
    await this.filtraCreditosClientes()
    
    
    await this.hideLoading()
  }

  async newCustomer() {
    await this.openModal('create')
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

  async espera(tiempoEspera: number) {
    return new Promise(resolve => setTimeout(resolve, tiempoEspera));
  }

  async deleteCustomer(customer: iCustomer) {
    await this.showAlertDrop(customer)
  }

  async editCustomer(customer: iCustomer) {
    this.customerSelected = customer;
    await this.openModal('read')
  }

  async showCredits(customer: iCustomer) {
    await this.openModalCreditos(customer)
  }

  showAlert(title: string, message: string) {
    let alert = this.alertController.create({
      header: title,
      message: message,
      buttons: ['Aceptar']
    }).then(res => {
      res.present();
    });
  }

  async showAlertDrop(customer: iCustomer) {
    const alert = await this.alertController.create({
      header: "Eliminar cliente",
      message: "Estas seguro de eliminar este cliente: " + customer.nombreCompleto,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Aceptar',
        handler: async () => {
          let tt = this.customerService.deleteCustomer(customer.$key)
        }
      }]
    })
    await alert.present();
  }

  async openModal(typeScreen: string) {
    const modal = await this.modalController.create({
      component: ModalClientesPage,
      cssClass: 'dynamicModalCss',
      componentProps: {
        'typeScreen': typeScreen,
        clienteSeleccionado: this.customerSelected
      }
    });
    await modal.present();
  }

  async openModalCreditos(customer: iCustomer) {
    const modal = await this.modalController.create({
      component: ModalClientesPrestamosPage,
      cssClass: 'dynamicModalCss',
      componentProps: {
        clienteSeleccionado: customer
      }
    });
    await modal.present();
  }

  async cargaDatos() {
    this.listaClientes = []
    this.listaCreditos = []

    this.customerService.getCustomerList().subscribe(async (clientes) => {
      this.listaClientes = clientes;
      this.totalClientes = clientes.length
    });
    this.creditosService.getCreditList().subscribe(async (creditos) => {
      this.listaCreditos = creditos;
    });
  }

  // se debe cambiar la regla de busqueda, en lugar de nombre que sea por id
  // ************************************************************************************************
  // ************************************************************************************************
  // ************************************************************************************************
  // este metodo es para filtrar cuantos creditos tiene un cliente
  async filtraCreditosClientes() {
    this.listaClientes.forEach(async (cliente: iCustomer, indice, array) => {
      
      let creditFound:any[] = this.listaCreditos.filter(credito => credito.idCliente === cliente.$key && credito.estado === 'abierto')
      
      let tempArray = []
      let montoCredito = 0;
      let montoLiquidado = 0;

      creditFound.forEach(async (item:iCredito) => {
        cliente.extra.montoCredito += item.montoCredito
        montoCredito += item.montoCredito
        cliente.extra.montoLiquidado += item.montoLiquidado
        montoLiquidado += item.montoLiquidado
        tempArray.push({ idCredito: item.$key, montoCredito: item.montoCredito, montoLiquidado: item.montoLiquidado})
      })
      
      cliente.creditos = tempArray;
      cliente.extra.montoCredito = montoCredito;
      cliente.extra.montoLiquidado = montoLiquidado;
      cliente.totalCreditos = creditFound.length
      
      //await this.updateCustomer(cliente.$key, cliente)

    })
    

  }

  async updateCustomer(keyCustomer: string, credito: any) {
    this.customerService.updateCredits(keyCustomer, credito).then(async (res) => {
      console.log("CLiente actualizado exitosamente")
    })
    
  }

}
