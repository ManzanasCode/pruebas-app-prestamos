import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario = "";
  clave = "";
  flagCargando: any;

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async login2() {
    await this.showLoading()
    
    if(this.usuario == 'marcelo' , this.clave == 'marcelo1234'){
      this.router.navigateByUrl('/tabs/home');
    }
    else if(this.usuario == 'ines' , this.clave == '123456'){
      this.router.navigateByUrl('/tabs/home');
    }
    else{
      this.showAlert("Error", "Credenciales incorrectas")
    }
    await this.hideLoading()
    //await this.espera(3000)
  }

  async login() {
    await this.showLoading()
    this.router.navigateByUrl('/tabs/home');
    await this.hideLoading()
    //await this.espera(3000)
  }

  async showLoading() {
    this.flagCargando = await this.loadingController.create({
      message: 'Espere por favor...',
    });
    await this.flagCargando.present();
  }

  async hideLoading(){
    this.flagCargando.dismiss();
  }

  async espera(tiempoEspera: number){
    return new Promise( resolve => setTimeout(resolve, tiempoEspera) );
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

}
