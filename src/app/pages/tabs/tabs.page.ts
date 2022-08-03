import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  flagEnviroment: boolean

  constructor() { }

  ngOnInit() {
    this.flagEnviroment =  environment.production

    console.error("flagEnviroment: ", this.flagEnviroment)
    
  }

}
