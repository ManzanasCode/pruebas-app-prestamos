import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersPipe } from './pipe-customers.pipe'



@NgModule({
  declarations: [CustomersPipe],
  exports: [CustomersPipe],
  imports: []
})
export class PipesModule { }
