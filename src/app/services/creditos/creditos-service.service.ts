import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { iCredito, iPagos } from '../../models/iCredito';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class CreditosService {

  urlFirebase = "/CREDITOS/"
  creditListRef: AngularFireList<any>;
  creditRef: AngularFireObject<any>;

  constructor(
    private ngFirestore: AngularFirestore,
    private db: AngularFireDatabase
  ) { }

  createCredit(credito: iCredito, fechaPrestamo: string) {

    return this.db.list(`${this.urlFirebase}`).push({
      montoCredito: credito.montoCredito,
      utilidad: credito.utilidad,
      interes: credito.interes,
      tipoCredito: credito.tipoCredito,
      numeroPagos: credito.numeroPagos,
      fechaPrestamo: fechaPrestamo,
      idCliente: credito.idCliente,
      nombreCliente: credito.nombreCliente,
      montoLiquidado: credito.montoLiquidado,
      montoPago: credito.montoPago,
      estado: credito.estado,
      listaPagos: credito.listaPagos
    })
  }

  getCredit(id: string) {
    this.creditRef = this.db.object(this.urlFirebase + id);
    return this.creditRef;
  }

  getCredit2(id: string) {
    return this.db.object(this.urlFirebase + id).snapshotChanges()
      .pipe(map(res => {
        const data: any = res.payload.toJSON()
        console.log("data: ", data)
        let id = data["$key"] = res.key;
        return { id, ...data };
      }))
  }

  getCreditList(): Observable<any[]> {
    return this.db.list(this.urlFirebase).snapshotChanges()
      .pipe(map(res => {
        return res.map(element => {
          const data: any = element.payload.toJSON()
          let id = data["$key"] = element.key;
          //let id = element.key //= element.key;
          return { id, ...data };
        })
      }))
  }

  getCreditListValueChanges()  {
    return this.db.list(`/CREDITOS/`).valueChanges()
  }

  // para actualizar mas datos se necesitan agrgar en el update object
  updateCredit(id, credito: iCredito) {
    //return this.db.list(this.urlFirebase).update(id, customer)
    return this.db.object(`/CREDITOS/${id}`).update({
      evidencias: credito.evidencias
    })
  }

  updateCredito(id, credito: iCredito) {
    return this.db.object(`/CREDITOS/${id}`).update({
      montoLiquidado: credito.montoLiquidado,
      pagoActual: credito.pagoActual
    })
  }

  cambiarEstadoCredtio(id){
    return this.db.object(`/CREDITOS/${id}`).update({
      estado: 'liquidado',
    })
  }

  liquidarCredito(credito: iCredito){
    return this.db.object(`/CREDITOS/${credito.$key}`).update({
      estado: 'liquidado',
      listaPagos: credito.listaPagos,
      pagoActual: credito.pagoActual,
      montoLiquidado: credito.montoLiquidado
    })
  }

  realizarPago(credito: iCredito) {
    return this.db.object(`/CREDITOS/${credito.$key}`).update({
      listaPagos: credito.listaPagos,
      pagoActual: credito.pagoActual,
      montoLiquidado: credito.montoLiquidado
    })
  }
  

  updateListaPagos(idCredito, indiceListaPagos: number, pagoEstado: any) {
    return this.db.object(`/CREDITOS/${idCredito}/listaPagos/${indiceListaPagos}`).update({
      estado: pagoEstado
    })
  }

  

  updateEstadoPagoCredito2(idCredito, estado: string) {
    return this.db.object(`/CREDITOS/${idCredito}`).update({
      estado: estado
    })
  }

  getListaPagos(idCredito: string) {
    return this.db.object(`/CREDITOS/${idCredito}/listaPagos/`)
  }

  async getListaPagos2(idCredito: string): Promise<any> {
    const eventref = this.db.database.ref(`/CREDITOS/${idCredito}/listaPagos/`)
    const snapshot = await eventref.once('value');
    const dataArray = snapshot.toJSON()
    return dataArray 
  }
}
