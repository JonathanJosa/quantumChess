import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  multiplayer: boolean = false;
  reglas: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  buscar(){}

  crearLink(){}

  showReglas(){}

}
