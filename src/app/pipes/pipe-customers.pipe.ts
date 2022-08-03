import { Pipe, PipeTransform } from '@angular/core';
import { iCustomer } from '../models/iCustomer';

@Pipe({
  name: 'pipeCustomers'
})
export class CustomersPipe implements PipeTransform {

  transform(array: any[], textFilter: string): any[] {
    let arrayCustomers: any = [];
    if (textFilter === '') {
      return arrayCustomers = array;
    }
    else{
      array.forEach((element: iCustomer) => {
        let nombreCompleto = element.nombreCompleto.toLowerCase()
        if (nombreCompleto.includes(textFilter)) {
          let temp: any = element 
          arrayCustomers.push(temp)
        }
      })
      return arrayCustomers;
    }
  }
}
