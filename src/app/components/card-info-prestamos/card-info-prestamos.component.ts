import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { iCredito, iPagos } from '../../models/iCredito';
import { ActionSheetController } from '@ionic/angular';
import { LoadingController, AlertController } from '@ionic/angular';
import { CreditosService } from '../../services/creditos/creditos-service.service'
import { ModalPrestamosPage } from '../../pages/modal-prestamos/modal-prestamos.page'



@Component({
  selector: 'app-card-info-prestamos',
  templateUrl: './card-info-prestamos.component.html',
  styleUrls: ['./card-info-prestamos.component.scss'],
})
export class CardInfoPrestamosComponent implements OnInit {

  @Input() credito: iCredito
  flagCargando: any;
  listaPagos: iPagos[];
  listaEstadosPagos = ["INCOMPLETO", "PENDIENTE", "COMPLETO"];
  selectValue: string;
  messageWhatsapp = '';

  constructor(
    public actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private creditosService: CreditosService,
    private modalController: ModalController,
  ) { }

  async ngOnInit() {
    console.error("init CardInfoPrestamosComponent")
    this.listaPagos = this.mapObjectToArray(this.credito.listaPagos)
  }

  async renderOptionValues() {
    await this.sleep(500)

    const arraySelects = document.querySelectorAll('ion-select.custom-options');

    //Array.from(activeRoom.querySelectorAll<HTMLElement>('ion-select.custom-options'));
    arraySelects.forEach((element: any) => {
      if (element.ariaLabel.includes("INCOMPLETO")) {
        element.style.color = "#eb445a";
      }
      else if (element.ariaLabel.includes("PENDIENTE")) {
        element.style.color = "#92949c";
      }
      else if (element.ariaLabel.includes("COMPLETO")) {
        element.style.color = "#2dd36f";
      }
    })
  }


  selectChange(event: any) {
    const valueEvent = event.detail.value
    console.log("selectChange: ", valueEvent)
  }

  async presentActionSheet(creditoKey: string) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Acciones',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Enviar información',
          icon: 'mail-outline',
          handler: () => {
            console.log('Enviar información');
          },
        },
        
      ],
    });
    await actionSheet.present();

    //const { role } = await actionSheet.onDidDismiss();
    //console.log('onDidDismiss resolved with role', role);
  }

  toArray(pago: iPagos) {
    return Object.keys(pago).map(key => pago[key])
  }

  async showListPays(creditoKey: string) {
    console.log("this.credito: ", this.credito)
    console.table(this.listaPagos)
    this.credito.flagDetail = !this.credito.flagDetail;
    if (this.credito.flagDetail) this.renderOptionValues()
  }



  async changeSelect(event: any, idx: number) {
    const valueEvent = event.detail.value
    console.log("valueEvent: ", valueEvent)
    console.log("idx: ", idx)

    console.log("credito: ", this.credito)
    if (valueEvent == "COMPLETO") {

      if (idx == this.credito.numeroPagos - 1) {
        this.listaPagos.forEach((pago => pago.estado = "COMPLETO"))
        this.credito.pagoActual = this.credito.numeroPagos
        this.credito.listaPagos = this.listaPagos
        this.credito.montoLiquidado = this.credito.utilidad

        this.creditosService.liquidarCredito(this.credito).then(async (res) => {
          console.log("Credito liquidado")
          this.renderOptionValues();
          this.alertWhatsPay(idx)
          
        })

      }
      else {
        //this.listaPagos.forEach(((pago, index) => { if (index <= idx) pago.estado = "COMPLETO" }))
        this.listaPagos[idx].estado = valueEvent
        this.credito.listaPagos = this.listaPagos
        this.credito.pagoActual = this.listaPagos.filter(pago => pago.estado == 'COMPLETO').length
        this.credito.montoLiquidado = this.credito.pagoActual * this.credito.montoPago

        this.creditosService.realizarPago(this.credito).then(async (res) => {
          console.log("Pago liquidado")
          this.renderOptionValues();
          this.alertWhatsPay(idx)
        })

      }
    }
    else {
      this.listaPagos[idx].estado = valueEvent
      this.credito.listaPagos = this.listaPagos

      this.creditosService.updateListaPagos(this.credito.$key, idx, valueEvent).then(async (res) => {
        console.log("Pago registrado")
        this.renderOptionValues();
      })

    }


    console.log("credito updated: ", this.credito)
  }



  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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


  mapObjectToArray = (obj: any) => {
    const mappedDatas = [];
    for (const key in obj)
      if (Object.prototype.hasOwnProperty.call(obj, key)) mappedDatas.push({ ...obj[key], id: key });
    return mappedDatas;
  };


  async alertWhatsCredit(credito: iCredito) {
    const nombreFinanciera = 'Circulo de confianza'
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MXN',
    });

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Notificación crédito",
      subHeader: credito.$key,
      inputs: [
        {
          name: 'numberWhatsapp',
          id: 'numberWhatsapp',
          type: 'tel',
          value: ''
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Enviar Whatsapp',
          handler: (alert) => {
            console.log('Confirm Ok');

            const formatWhatsapp = `https://wa.me/${alert.numberWhatsapp}?text=`
            
            
            const message = `${formatWhatsapp}
              ID crédito: *${credito.$key}* %0a
              Cliente: *${credito.nombreCliente}* %0a
              Fecha asignación: *${credito.fechaPrestamo}* %0a
              Día de pago: *${credito.diaPago}* %0a
              Crédito solicitado: *${formatter.format(credito.montoCredito)}* %0a
              Monto pago: *${formatter.format(credito.montoPago)}* %0a
              Crédito real: *${formatter.format(credito.utilidad)}* %0a
              Total de pagos: *${credito.numeroPagos}* %0a
              Pagos liquidados: *${credito.pagoActual}* %0a %0a
            `

            let templateListaPagos = ""
            this.listaPagos.forEach((pago, idx) => {
              templateListaPagos += `${idx+1}) ${pago.fechaPago} - *${pago.estado}* %0a`
            })

            const messageWhatsapp = message + templateListaPagos



            // let ahrefItem: HTMLElement = document.getElementById('whatsappLink') as HTMLElement
            let ahrefItem = document.createElement('a') as HTMLElement
            ahrefItem.setAttribute('href', messageWhatsapp)
            console.log("ahrefItem: ", ahrefItem)
            ahrefItem.click()
          }
        }
      ]
    });

    await alert.present();
  }


  async alertWhatsPay(idx) {
    const nombreFinanciera = 'Circulo de confianza'
    let formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });
    let options:any = { year: 'numeric', month: 'long', day: 'numeric' , hour: "numeric", minute: "numeric", second: "numeric"};
    let today = new Date();
    let currentDate = today.toLocaleDateString("es-MX", options)
    const pagoInfo: iPagos = this.listaPagos[idx]
    const differenceDayPay = this.calculateDiff(pagoInfo.fechaPago)
    let self = this

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Notificación del pago",
      message: `Pago ${idx+1}) ${pagoInfo.fechaPago}`,
      subHeader: self.credito.$key,
      inputs: [
        {
          name: 'numberWhatsapp',
          id: 'numberWhatsapp',
          type: 'tel',
          value: ''
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Enviar Whatsapp',
          handler: (alert) => {
            console.log('Confirm Ok');
            const formatWhatsapp = `https://wa.me/${alert.numberWhatsapp}?text=`

            const messageWhatsapp = `${formatWhatsapp}
              Quedo registrado tu pago con fecha de  *${currentDate}* %0a %0a
              ID crédito: *${self.credito.$key}* %0a %0a
              *${idx+1}) ${pagoInfo.fechaPago} - ${'COMPLETO'}* %0a %0a
              Dias de retraso: *${differenceDayPay}* %0a
            `
            // let ahrefItem: HTMLElement = document.getElementById('whatsappLink') as HTMLElement
            let ahrefItem = document.createElement('a') as HTMLElement
            ahrefItem.setAttribute('href', messageWhatsapp)
            console.log("ahrefItem: ", ahrefItem)
            ahrefItem.click()
          }
        }
      ]
    });

    await alert.present();
  }


  calculateDiff(dateSent) {
    const date1:any = new Date();
    const date2:any = new Date(dateSent);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    console.log(diffTime + " milliseconds");
    console.log(diffDays + " days");
    return diffDays

  }

  


}
