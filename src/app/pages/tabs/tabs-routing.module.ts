import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [{
      path: 'home',
      loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
    },
    {
      path: 'prestamos',
      loadChildren: () => import('../prestamos/prestamos.module').then(m => m.PrestamosPageModule)
    },
    {
      path: 'clientes',
      loadChildren: () => import('../clientes/clientes.module').then(m => m.ClientesPageModule)
    },
    {
      path: 'pagos',
      loadChildren: () => import('../pagos/pagos.module').then(m => m.PagosPageModule)
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
