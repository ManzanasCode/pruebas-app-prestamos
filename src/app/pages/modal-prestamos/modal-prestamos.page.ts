import { Component, OnInit, Input } from '@angular/core';
import { CustomerService } from '../../services/customer-service.service'
import { iCustomer } from '../../models/iCustomer';
import { iCredito, iPagos } from '../../models/iCredito';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { LoadingController, AlertController } from '@ionic/angular';
import { v4 as uuidv4 } from 'uuid';
import { CreditosService } from '../../services/creditos/creditos-service.service'

@Component({
  selector: 'app-modal-prestamos',
  templateUrl: './modal-prestamos.page.html',
  styleUrls: ['./modal-prestamos.page.scss'],
})
export class ModalPrestamosPage implements OnInit {

  @Input() typeScreen: string;
  buttonState: boolean = false;
  @Input() creditoSeleccionado: iCredito;
  @Input() idCredito: string;

  tituloPagina = ""
  listaClientes: iCustomer[];
  credito: iCredito = {
    $key: '',
    montoCredito: 0,
    utilidad: 0,
    interes: 0,
    tipoCredito: '',
    numeroPagos: 0,
    fechaPrestamo: '',
    idCliente: '',
    nombreCliente: '',
    montoLiquidado: 0,
    montoPago: 0,
    estado: 'abierto',
    listaPagos: [],
    pagoActual: 0
  }
  flagCargando: any;
  listaPagos: iPagos[];
  creditComplete: boolean = true;
  inputDateTimePicker: string = moment().toISOString();

  constructor(
    private customerService: CustomerService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private creditosService: CreditosService,
  ) { }

  async ngOnInit() {

    if (this.typeScreen == 'read') {
      console.log('Credito seleccionado: ', this.creditoSeleccionado)
      this.buttonState = true;
      await this.showLoading()
      await this.loadListCustomers();
      await this.espera(500)
      await this.hideLoading()
      this.tituloPagina = "Detalle del crédito"
      const creditoTemporal: any = 0;
      this.creditosService.getCredit(this.creditoSeleccionado.$key).valueChanges().subscribe(async (item) => {
        this.credito = item
        this.credito.$key = this.creditoSeleccionado.$key
        this.inputDateTimePicker = moment(this.credito.fechaPrestamo, "DD/MM/YYYY").toISOString()

        await this.obtenerMontoLiquidado()
      });
    }
    else if (this.typeScreen == 'create') {
      this.buttonState = false;
      await this.showLoading()
      await this.loadListCustomers();
      await this.espera(1000)
      await this.hideLoading()
      this.tituloPagina = "Nuevo Crédito"
    }
  }

  ajustaPago() {
    if (this.credito.interes == 15) {
      if (this.credito.montoCredito == 2000)
        this.credito.montoPago = 144;
      else if (this.credito.montoCredito == 2500)
        this.credito.montoPago = 180;
      else if (this.credito.montoCredito == 3000)
        this.credito.montoPago = 216;
      else if (this.credito.montoCredito == 5000)
        this.credito.montoPago = 360;
      else if (this.credito.montoCredito == 10000)
        this.credito.montoPago = 720;
      else if (this.credito.montoCredito == 20000)
        this.credito.montoPago = 1440;
    }
  }

  loadListCustomers() {
    this.customerService.getCustomerList().subscribe(clientes => {
      this.listaClientes = clientes;
    });
  }

  async closeModal() {
    this.modalController.dismiss({
      "data": "this.numTicket"
    });
  }


  async generaListaPagos() {
    const interes = this.credito.interes < 10 ? parseFloat('0.0' + this.credito.interes) : parseFloat('0.' + this.credito.interes);
    this.credito.utilidad = this.credito.montoCredito + (this.credito.montoCredito * (interes))
    this.credito.montoPago = Math.round(this.credito.utilidad / this.credito.numeroPagos) 
    this.ajustaPago()
    let temporalArray = [];
    temporalArray.length = this.credito.numeroPagos
    temporalArray.fill('')
    //let fechaPuntero: any = this.credito.fechaPrestamo
    let temp: any = this.inputDateTimePicker.split('T')[0].split('-')
    let fechaPuntero: any = temp[2] + "/" + temp[1] + "/" + temp[0]
    this.creditoSeleccionado.fechaPrestamo = fechaPuntero

    const factorTipoCredito = this.credito.tipoCredito == 'Semanal' ? 'days' : 'months'
    const multiplicador = this.credito.tipoCredito == 'Semanal' ? 7 : 1
    
    temporalArray.forEach((valor, indice, array) => {

      fechaPuntero = moment(fechaPuntero, "DD/MM/YYYY").add(multiplicador, factorTipoCredito).format('DD/MM/YYYY')
      let pago: iPagos = {
        id: uuidv4(),
        fechaPago: fechaPuntero,
        monto: this.credito.montoPago,
        estado: 'PENDIENTE'
      }
      this.creditComplete = false;
      this.credito.listaPagos.push(pago)
    });
    //await this.ajustaPago()
  }



  async validaFormulario() {
    this.credito.listaPagos = []
    if (this.credito.montoCredito <  2000)
      await this.showAlert('Error', 'El monto del crédito debe ser mayor o igual a $3,000')
    else {
      if (this.credito.interes == 0 || this.credito.tipoCredito == '' || this.credito.idCliente == '')
        await this.showAlert('Error', 'Para generar una lista de pagos es necesario completar todos los campos')
      else {
        await this.showLoading()
        await this.espera(500)
        await this.generaListaPagos()
        await this.hideLoading()
      }
    }
  }

  async actualizaInteres(event: Event) {
    const interes = this.credito.interes < 10 ? parseFloat('0.0' + this.credito.interes) : parseFloat('0.' + this.credito.interes);
    this.credito.utilidad = this.credito.montoCredito + (this.credito.montoCredito * interes)
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

  successAlet(title: string, message: string) {
    let alert = this.alertController.create({
      header: title,
      message: message,
      buttons: ['Aceptar']
    }).then(async (res) => {
      res.present();
      this.closeModal()
    });
  }

  async confirm() {
    const alert = await this.alertController.create({
      header: "Confirmación",
      message: `¿Estas seguro de asignar este crédito($${this.credito.montoCredito}) a ${this.credito.nombreCliente}?`,
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

          console.log("***** this.inputDateTimePicker: ", this.inputDateTimePicker)
          let fechaParsed: any = this.inputDateTimePicker.split('T')[0].split('-')
          let fechaPrestamo = fechaParsed[2] + "/" + fechaParsed[1] + "/" + fechaParsed[0]

          this.creditosService.createCredit(this.credito, fechaPrestamo).then(async (res) => {
            await this.showLoading()
            await this.espera(3000)
            await this.hideLoading()
            this.successAlet("Credito asignado exitosamente", "")
          })

        }
      }]
    })
    await alert.present()
  }

  async actualizaCliente(event: Event) {
    console.log(this.listaClientes)

    let cliente = this.listaClientes.find(el => el.$key === this.credito.idCliente)
    this.credito.nombreCliente = cliente.nombreCompleto
  }

  async espera(tiempoEspera: number) {
    return new Promise(resolve => setTimeout(resolve, tiempoEspera));
  }

  async createCredit() {
    await this.confirm()
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

  async obtenerMontoLiquidado() {
    this.credito.montoLiquidado = 0;
    this.credito.pagoActual = 0
    this.credito.listaPagos.forEach((pago, indice, array) => {
      if (pago.estado == 'COMPLETO') {
        this.credito.montoLiquidado += pago.monto
        this.credito.pagoActual++;
      }
    })
  }

  async pagoPendiente(creditoSeleccionado: iCredito, pagoSeleccionado: iPagos) {
    const idxPago = creditoSeleccionado.listaPagos.findIndex(pago => pago.id === pagoSeleccionado.id)
    pagoSeleccionado.estado = "INCOMPLETO"
    this.creditosService.updateListaPagos(this.credito.$key, idxPago, pagoSeleccionado).then(async (res) => {
      await this.espera(1000)
      this.showAlert("Pago actualizado correctamente", "")
    })
  }

  async pagoCompleto(creditoSeleccionado: iCredito, pagoSeleccionado: iPagos) {
    const idxPago = creditoSeleccionado.listaPagos.findIndex(pago => pago.id === pagoSeleccionado.id)
    pagoSeleccionado.estado = "COMPLETO";
    creditoSeleccionado.pagoActual = creditoSeleccionado.pagoActual + 1;
    creditoSeleccionado.montoLiquidado = creditoSeleccionado.montoLiquidado + creditoSeleccionado.montoPago
    let listaPagos = Object.values(creditoSeleccionado.listaPagos);


    if (idxPago == listaPagos.length - 1) {
      console.error('LIQUIDADO')
      creditoSeleccionado.estado = "liquidado"
      this.creditosService.cambiarEstadoCredtio(this.credito.$key).then(async (res) => {
        console.log("Credito liquidado: ",)
      });
    }

    this.creditosService.updateListaPagos(this.credito.$key, idxPago, pagoSeleccionado).then(async (res) => {
      await this.espera(1000)
      this.showAlert("Pago actualizado correctamente", "")
      this.creditosService.updateCredito(this.credito.$key, creditoSeleccionado).then(async (res) => {
        console.log("creditoActualizadoUtilidad: ", res)
      });
    })

  }

  async cambioFecha(event: Event) {

    console.log("this.event: ", event)
    console.log("this.inputDateTimePicker: ", this.inputDateTimePicker)
    let temp: any = this.inputDateTimePicker.split('T')[0].split('-')
    this.creditoSeleccionado.fechaPrestamo = temp[2] + "/" + temp[1] + "/" + temp[0]

    console.log("this.creditoSeleccionado: ", this.creditoSeleccionado.fechaPrestamo)

  }
}
