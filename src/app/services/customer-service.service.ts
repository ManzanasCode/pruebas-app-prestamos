import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { iCustomer } from '../models/iCustomer';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid';
import { element } from 'protractor';
import { iCredito, iPagos } from '../models/iCredito';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  urlFirebase = "/CLIENTES/"
  customerListRef: AngularFireList<any>;
  customerRef: AngularFireObject<any>;

  constructor(
    private ngFirestore: AngularFirestore,
    private db: AngularFireDatabase
  ) { }

  createCustomer(customer: iCustomer) {
    return this.db.list(`/CLIENTES/`).push({
      nombreCompleto: customer.nombreCompleto,
      genero: customer.genero,
      fecha_nac: customer.fecha_nac,
      extra: {
        montoCredito: 0,
        montoLiquidado: 0
      }
    })
  }

  getCustomer(id: string) {
    this.customerRef = this.db.object(this.urlFirebase + id);
    return this.customerRef;
  }

  test() {
    this.customerListRef = this.db.list(this.urlFirebase)
    return this.customerListRef;
  }

 

  getCustomerList(): Observable<any[]> {
    return this.db.list(this.urlFirebase).snapshotChanges()
    .pipe(map(res =>{ 
      return res.map(element => {
        const data: any = element.payload.toJSON()
        let id = data["$key"] = element.key;
        return { id, ...data };
      })
    }))
    
  }

  // para actualizar mas datos se necesitan agrgar en el update object
  updateCustomer(id, customer: iCustomer) {
    //return this.db.list(this.urlFirebase).update(id, customer)
    return this.db.object(`/CLIENTES/${id}`).update({
      genero: customer.genero,
      movil: customer.movil,
      fecha_nac: customer.fecha_nac
    })
  }

  updateCredits(id, customer: iCustomer) {
    console.log(`/CLIENTES/${id} =>`, customer)
    return this.db.object(`/CLIENTES/${id}`).update({
      creditos: customer.creditos,
      extra: customer.extra
    })
    
  }

  deleteCustomer(id: string) {
    this.customerRef = this.db.object(this.urlFirebase + id);
    this.customerRef.remove();
  }

}
