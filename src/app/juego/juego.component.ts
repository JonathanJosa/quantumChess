import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ElementRef } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.sass']
})
export class JuegoComponent implements OnInit {
  arreglo: ficha[] = [
    new ficha("torre", false), new ficha("caballo", false), new ficha("alfil", false), new ficha("rey", false), new ficha("reyna", false), new ficha("alfil", false), new ficha("caballo", false), new ficha("torre", false),
    new ficha("peon", false), new ficha("peon", false), new ficha("peon", false), new ficha("peon", false), new ficha("peon", false), new ficha("peon", false), new ficha("peon", false), new ficha("peon", false),
    new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null),
    new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null),
    new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null),
    new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null), new ficha("libre", null),
    new ficha("peon", true), new ficha("peon", true), new ficha("peon", true), new ficha("peon", true), new ficha("peon", true), new ficha("peon", true), new ficha("peon", true), new ficha("peon", true),
    new ficha("torre", true), new ficha("caballo", true), new ficha("alfil", true), new ficha("reyna", true), new ficha("rey", true), new ficha("alfil", true), new ficha("caballo", true), new ficha("torre", true)
  ];

  movimientos: number[] = null;
  movimientosC: number[] = null;
  turno: boolean = true;
  coronar: boolean = false;
  endGame: boolean = false;
  champion: string = "";
  superposicion: number = 0;
  jugadasC:number = 0;
  movimientoCuentico: number = null;
  team:boolean = true;
  multiplayer: boolean = false;
  enemy: string = "";
  conexion: string = "";

  constructor(private route: ActivatedRoute, private elementRef: ElementRef, private rutas: Router) {
    this.route.params.subscribe(res => {
      if(res.color == "Amarillo"){this.team = false;}
      this.elementRef.nativeElement.style.setProperty('--turno', "0deg");
      if(!this.team)
        this.elementRef.nativeElement.style.setProperty('--turno', "180deg");
      if(res.nombre == "bot"){
        this.multiplayer = true;
        if(res.team){
          this.enemy = "Azul";
        }else{
          this.enemy = "Amarillo";
        }
      }else if(res.nombre="local"){
        this.enemy = "Amarillo";
      }else{
        this.conexion = res.id;
        this.enemy = res.nombre;
        this.multiplayer = true;
      }
    });
  }

  ngOnInit(): void { }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  cambioTurno(){
    this.turno = !this.turno;
    if(!this.multiplayer){
      this.elementRef.nativeElement.style.setProperty('--turno', "0deg");
      if(!this.turno)
        this.elementRef.nativeElement.style.setProperty('--turno', "180deg");
    }
    
  }

  ganador(){
    this.champion = "amarillo";
    if(this.turno){this.champion = "azul";}
  }

  regresar(){
    this.rutas.navigate(['']);
  }

  revisar(){
    let activo: boolean = false;
    let numeros: number[] = [];
    for (let i = 0; i < 64; i++) {
      if(this.arreglo[i].equipo == this.turno){
        let tipo: string = this.arreglo[i].tipo;
        if(tipo == "peon") {numeros = this.peon(i, (i%8), ((i/8) - ((i/8)%1)));}
        else if(tipo == "torre") {numeros = this.torre(i, (i%8), ((i/8) - ((i/8)%1)));}
        else if(tipo == "alfil") {numeros = this.alfil(i, (i%8), ((i/8) - ((i/8)%1)));}
        else if(tipo == "caballo") {numeros = this.caballo(i, (i%8), ((i/8) - ((i/8)%1)));}
        else if(tipo == "reyna") {numeros = this.reyna(i, (i%8), ((i/8) - ((i/8)%1)));}
        else if(tipo == "rey") {numeros = this.rey(i, (i%8), ((i/8) - ((i/8)%1)));}
        if(numeros.length > 1){
          activo = true;
          break;
        }
      }
    }
    if(!activo){
      this.turno = !this.turno;
      this.ganador();
    }
  }

  coronarP(name){
    for (let pos = 0; pos < 8; pos++) {
      if(this.arreglo[56+pos].tipo == "peon"){
        this.arreglo[56+pos].tipo = name;
        this.arreglo[56+pos].actualizarC();
        break;
      }else if(this.arreglo[pos].tipo == "peon"){
        this.arreglo[pos].tipo = name;
        this.arreglo[pos].actualizarC();
        break;
      }
    }

    this.coronar = false;
  }

  comer(a, b){
    if(this.arreglo[a].cuantica || this.arreglo[b].cuantica){
      if(this.arreglo[a].cuantica && this.arreglo[b].cuantica){

        //A puede comer
        if(this.getRandomInt(this.arreglo[a].posibilidad) == 0){
          alert("Talvez puedas comerte al "+this.arreglo[b].tipo);

          //B es comido
          if(this.getRandomInt(this.arreglo[b].posibilidad) != 0){
            alert("La ficha "+this.arreglo[b].tipo+" morirá");
            let temp:ficha = this.arreglo[a];
            let temp2:ficha = this.arreglo[b];
            this.arreglo[a] = new ficha("libre", null);
            this.arreglo[b] = new ficha("libre", null);
            for (let i = 0; i < 64; i++) {
              if(this.arreglo[i].identificador == temp.identificador){
                this.arreglo[i] = new ficha("libre", null);
              }
            }

            for (let i = 0; i < 64; i++) {
              if(this.arreglo[i].identificador == temp2.identificador){
                this.arreglo[i] = new ficha("libre", null);
              }
            }


            this.arreglo[b] = temp;
            this.arreglo[b].cuantica = false;
            this.arreglo[b].actualizarC();
            this.arreglo[b].hijo = 0;
            this.arreglo[b].posibilidad = 1;

          //B no es comido
          }else{

            alert("La superposicion cuantica ha dejado viviar al "+this.arreglo[b].tipo);

            let temp:ficha = this.arreglo[b];
            this.arreglo[b] = this.arreglo[a];
            this.arreglo[a] = new ficha("libre", null);
            for (let i = 0; i < 64; i++){
              if(this.arreglo[i].identificador == temp.identificador && this.arreglo[i].hijo == temp.hijo){
                this.arreglo[i].hijo -= 1;
                this.arreglo[i].posibilidad /= 2;
                if(this.arreglo[i].hijo == 0){
                  this.arreglo[i].cuantica = false;
                  this.arreglo[i].actualizarC();
                }
                break;
              }
            }

          }








          //A no puede comer
        }else{
          alert("El "+this.arreglo[b].tipo+" no sera comido hoy");
          let temp:ficha = this.arreglo[a];
          this.arreglo[a] = new ficha("libre", null);
          for (let i = 0; i < 64; i++) {
            if(this.arreglo[i].identificador == temp.identificador && this.arreglo[i].hijo == temp.hijo && i != a){
              this.arreglo[i].hijo -= 1;
              this.arreglo[i].posibilidad /= 2;
              if(this.arreglo[i].hijo == 0){
                this.arreglo[i].cuantica = false;
                this.arreglo[i].actualizarC();
              }
              break;
            }
          }
        }
      }else if(this.arreglo[a].cuantica){
          if(this.getRandomInt(this.arreglo[a].posibilidad) == 0){
            alert("La superposicion cuantica ha dejado comerse al "+this.arreglo[b].tipo);
            let temp:ficha = this.arreglo[a];
            this.arreglo[a] = new ficha("libre", null);
            for (let i = 0; i < 64; i++) {
              if(this.arreglo[i].identificador == temp.identificador){
                this.arreglo[i] = new ficha("libre", null);
              }
            }
            this.arreglo[b] = temp;
            this.arreglo[b].cuantica = false;
            this.arreglo[b].actualizarC();
            this.arreglo[b].hijo = 0;
            this.arreglo[b].posibilidad = 1;
          }else{
            alert("El "+this.arreglo[b].tipo+" no sera comido hoy");
            let temp:ficha = this.arreglo[a];
            this.arreglo[a] = new ficha("libre", null);
            for (let i = 0; i < 64; i++) {
              if(this.arreglo[i].identificador == temp.identificador && this.arreglo[i].hijo == temp.hijo && i != a){
                this.arreglo[i].hijo -= 1;
                this.arreglo[i].posibilidad /= 2;
                if(this.arreglo[i].hijo == 0){
                  this.arreglo[i].cuantica = false;
                  this.arreglo[i].actualizarC();
                }
                break;
              }
            }
          }
      }else{

        //Ser comido
        if(this.getRandomInt(this.arreglo[b].posibilidad) != 0){
          alert("La ficha "+this.arreglo[b].tipo+" morirá");
          let temp:ficha = this.arreglo[b];
          this.arreglo[b] = this.arreglo[a];
          this.arreglo[a] = new ficha("libre", null);
          for (let i = 0; i < 64; i++) {
            if(this.arreglo[i].identificador == temp.identificador){
              this.arreglo[i] = new ficha("libre", null);
            }
          }
        }else{
          alert("La superposicion cuantica ha dejado viviar al "+this.arreglo[b].tipo);
          let temp:ficha = this.arreglo[b];
          this.arreglo[b] = this.arreglo[a];
          this.arreglo[a] = new ficha("libre", null);
          for (let i = 0; i < 64; i++){
            if(this.arreglo[i].identificador == temp.identificador && this.arreglo[i].hijo == temp.hijo){
              this.arreglo[i].hijo -= 1;
              this.arreglo[i].posibilidad /= 2;
              if(this.arreglo[i].hijo == 0){
                this.arreglo[i].cuantica = false;
                this.arreglo[i].actualizarC();
              }
              break;
            }
          }
        }
      }
    }else{
      if(this.arreglo[b].tipo == "rey"){
        this.ganador();
        this.endGame = true;
      }
      this.arreglo[b] = this.arreglo[a];
      this.arreglo[a] = new ficha("libre", null);
    }
    if(!this.arreglo.some(e => e.tipo == "rey" && e.equipo != this.turno)){
      this.ganador();
      this.endGame = true;
    }
  }



    torre(num, x, y){
    let vec: number[] = [];
    // abajo en Y+
    for (let pos = y+1; pos < 8; pos++) {
      if(this.arreglo[(pos*8)+x].tipo == "libre"){
        vec.push((pos*8)+x);
      }else if(this.arreglo[(pos*8)+x].equipo == !this.turno){
        vec.push((pos*8)+x);
        break;
      }else{
        break;
      }
    }
    // arriba en Y-
    for (let pos = y-1; pos >= 0; pos--) {
      if(this.arreglo[(pos*8)+x].tipo == "libre"){
        vec.push((pos*8)+x);
      }else if(this.arreglo[(pos*8)+x].equipo == !this.turno){
        vec.push((pos*8)+x);
        break;
      }else{
        break;
      }
    }

    // izquierda en X-
    for (let pos = x-1; pos >= 0; pos--) {
      if(this.arreglo[(y*8)+pos].tipo == "libre"){
        vec.push((y*8)+pos);
      }else if(this.arreglo[(y*8)+pos].equipo == !this.turno){
        vec.push((y*8)+pos);
        break;
      }else{
        break;
      }
    }
    // Derecha en X+
    for (let pos = x+1; pos < 8; pos++) {
      if(this.arreglo[(y*8)+pos].tipo == "libre"){
        vec.push((y*8)+pos);
      }else if(this.arreglo[(y*8)+pos].equipo == !this.turno){
        vec.push((y*8)+pos);
        break;
      }else{
        break;
      }
    }
    vec.push(num);
    return vec;
  }

  peon(num, x, y){
    let vec: number[] = [];
    if(this.arreglo[num].jugado == false){
      if(this.turno){
        if(this.arreglo[((y-2)*8)+x].tipo == "libre" && this.arreglo[((y-1)*8)+x].tipo == "libre") vec.push(((y-2)*8)+x);
      }else{
        if(this.arreglo[((y+2)*8)+x].tipo == "libre"  && this.arreglo[((y+1)*8)+x].tipo == "libre") vec.push(((y+2)*8)+x);
      }
    }
    if(this.turno){
      y -= 1;
    }else{
      y += 1;
    }
    if(this.arreglo[((y)*8)+x].tipo == "libre")
      vec.push(((y)*8)+x);
    if(x+1 <= 7 && this.arreglo[((y)*8)+x+1].equipo == !this.turno)
      vec.push(((y)*8)+x+1);
    if(x-1 >= 0 && this.arreglo[((y)*8)+x-1].equipo == !this.turno)
      vec.push(((y)*8)+x-1);
    vec.push(num);
    return vec;
  }

  caballo(num, x, y){
    let vec: number[] = [];
    if(y+2 < 8){
      if(x+1 < 8 && this.arreglo[((y+2)*8)+x+1].equipo != this.turno)
        vec.push(((y+2)*8)+x+1);
      if(x-1 >= 0 && this.arreglo[((y+2)*8)+x-1].equipo != this.turno)
        vec.push(((y+2)*8)+x-1);
    }

    if(y-2 >= 0){
      if(x+1 < 8 && this.arreglo[((y-2)*8)+x+1].equipo != this.turno)
        vec.push(((y-2)*8)+x+1);
      if(x-1 >= 0 && this.arreglo[((y-2)*8)+x-1].equipo != this.turno)
        vec.push(((y-2)*8)+x-1);
    }
    if(x+2 < 8){
      if(y+1 < 8 && this.arreglo[((y+1)*8)+x+2].equipo != this.turno)
        vec.push(((y+1)*8)+x+2);
      if(y-1 >= 0 && this.arreglo[((y-1)*8)+x+2].equipo != this.turno)
        vec.push(((y-1)*8)+x+2);
    }
    if(x-2 >= 0){
      if(y+1 < 8 && this.arreglo[((y+1)*8)+x-2].equipo != this.turno)
        vec.push(((y+1)*8)+x-2);
      if(y-1 >= 0 && this.arreglo[((y-1)*8)+x-2].equipo != this.turno)
        vec.push(((y-1)*8)+x-2);
    }
    vec.push(num);
    return vec;
  }

  alfil(num, x, y){
    let vec: number[] = [];
    //Diagonal derecha bottom
    for (let pos = 1; x+pos < 8 && y+pos < 8; pos++){
      if(this.arreglo[((pos + y)*8) + pos + x].tipo == "libre"){
        vec.push(((pos + y) * 8) + pos + x)
      }else if(this.arreglo[((pos + y)*8) + pos + x].equipo == !this.turno){
        vec.push(((pos + y) * 8) + pos + x)
        break;
      }else{
        break;
      }
    }

    //diagonal izquierda bottom
    for (let pos = 1; x-pos >= 0 && y+pos < 8; pos++){
      if(this.arreglo[((pos + y)*8) - pos + x].tipo == "libre"){
        vec.push(((pos + y) * 8) - pos + x)
      }else if(this.arreglo[((pos + y)*8) - pos + x].equipo == !this.turno){
        vec.push(((pos + y) * 8) - pos + x)
        break;
      }else{
        break;
      }
    }

    //Diagonal derecha bottom
    for (let pos = 1; x+pos < 8 && y-pos >= 0; pos++){
      if(this.arreglo[((-pos + y)*8) + pos + x].tipo == "libre"){
        vec.push(((-pos + y) * 8) + pos + x)
      }else if(this.arreglo[((-pos + y)*8) + pos + x].equipo == !this.turno){
        vec.push(((-pos + y) * 8) + pos + x)
        break;
      }else{
        break;
      }
    }

    //diagonal izquierda bottom
    for (let pos = 1; x-pos >= 0 && y-pos >= 0; pos++){
      if(this.arreglo[((-pos + y)*8) - pos + x].tipo == "libre"){
        vec.push(((-pos + y) * 8) - pos + x)
      }else if(this.arreglo[((-pos + y)*8) - pos + x].equipo == !this.turno){
        vec.push(((-pos + y) * 8) - pos + x)
        break;
      }else{
        break;
      }
    }
    vec.push(num);
    return vec;
  }

  reyna(num, x, y){
    let vec: number[] = [];
    vec = vec.concat(this.torre(num, x, y));
    vec.pop()
    vec = vec.concat(this.alfil(num, x, y));
    return vec;
  }

  rey2(num, x, y){
    let vec: number[] = [];
    if(this.arreglo[num].jugado == false){
      let enro:boolean = true;
      for (let i = x+1; i < 7; i++) {
        if(this.arreglo[(y*8)+i].tipo != "libre"){
          enro = false;
          break;
        }
      }
      if(enro && this.arreglo[(y*8)+7].tipo == "torre" && this.arreglo[(y*8)+7].jugado == false){
        vec.push((y*8)+6);
      }
      enro = true;
      for (let i = x-1; i > 0; i--) {
        if(this.arreglo[(y*8)+i].tipo != "libre"){
          enro = false;
          break;
        }
      }
      if(enro && this.arreglo[(y*8)].tipo == "torre" && this.arreglo[(y*8)].jugado == false){
        vec.push((y*8)+1);
      }
    }
    if((x + 1 <= 7)  && (this.arreglo[(y*8)+x+1].equipo != this.turno)){vec.push((y*8)+x+1);}
    if((x-1 >= 0) && (this.arreglo[(y*8)+x-1].equipo != this.turno)){vec.push((y*8)+x-1);}
    if(y-1 >= 0 && (this.arreglo[((y-1)*8)+x].equipo != this.turno)){vec.push(((y-1)*8)+x);}
    if(y+1 <= 7 && this.arreglo[((y+1)*8)+x].equipo != this.turno){vec.push(((y+1)*8)+x);}
    if(y+1 <= 7 && x+1 <= 7 && this.arreglo[((y+1)*8)+x+1].equipo != this.turno){vec.push(((y+1)*8)+x+1);}
    if(y+1 <= 7 && x-1 >= 0 && this.arreglo[((y+1)*8)+x-1].equipo != this.turno){vec.push(((y+1)*8)+x-1);}
    if(y-1 >= 0 && x+1 <= 7 && this.arreglo[((y-1)*8)+x+1].equipo != this.turno){vec.push(((y-1)*8)+x+1);}
    if(y-1 >= 0 && x-1 >= 0 && this.arreglo[((y-1)*8)+x-1].equipo != this.turno){vec.push(((y-1)*8)+x-1);}

    return vec;
  }

  rey(num, x, y){
    let vec: number[] = this.rey2(num, x, y);
    let vec2:number[] = [];
    for (let i = 0; i < 64; i++) {
      if(this.arreglo[i].tipo == "rey" && this.arreglo[i].equipo != this.turno){
        vec2 = vec2.concat(this.rey2(i, (i%8),((i/8) - ((i/8)%1))));
      }
    }
    let vec3: number[] = [];
    vec.forEach(element => {
      if(!vec2.some(e => e == element)){
        vec3.push(element);
      }
    });
    vec3.push(num);
    return vec3;
  }

  estadoS(au: boolean){
    this.movimientos.forEach(element => {
      this.arreglo[element].seleccionado = au;
    });
  }

  estadoSC(au: boolean){
    this.movimientosC.forEach(element => {
      this.arreglo[element].seleccionado = au;
    });
  }

  disponiblesNormal(num, ejeX, ejeY, tipo, color){
      if(tipo == "peon") {this.movimientos = this.peon(num, ejeX, ejeY);}
      else if(tipo == "torre") {this.movimientos = this.torre(num, ejeX, ejeY);}
      else if(tipo == "alfil") {this.movimientos = this.alfil(num, ejeX, ejeY);}
      else if(tipo == "caballo") {this.movimientos = this.caballo(num, ejeX, ejeY);}
      else if(tipo == "reyna") {this.movimientos = this.reyna(num, ejeX, ejeY);}
      else if(tipo == "rey") {this.movimientos = this.rey(num, ejeX, ejeY);}
      let tmp:number = this.movimientos.pop();
      this.estadoS(true);
      this.movimientos.push(tmp);
  }

  normal(num){
    let ejeX: number = (num%8); //0-7
    let ejeY: number = ((num/8) - ((num/8)%1)); //0-7
    let tipo: string = this.arreglo[num].tipo;
    let color: boolean = this.arreglo[num].equipo;
    let revisarEjecutar:boolean = false;
    if( this.movimientos != null){
      this.movimientosC = null;
      let efecto: number = this.movimientos.pop();
      if(this.movimientos.some(e => e == num )){
        if(tipo == "libre"){
          this.arreglo[num] = this.arreglo[efecto];
          this.arreglo[efecto] = new ficha("libre", null);
        }else{
          this.comer(efecto, num);
        }
        if(this.arreglo[num].tipo=="peon" && (ejeY == 0 || ejeY == 7)){
            this.coronar = true;
        }else if(this.arreglo[num].tipo=="rey" && (ejeX == 6 || ejeX == 1) && this.arreglo[num].jugado == false){
          let control:number = -1;
          if(ejeX == 6){control = 1;}
          this.arreglo[(ejeY*8)-control+ejeX] = this.arreglo[(ejeY*8)];
          this.arreglo[(ejeY*8)+control+ejeX] = new ficha("libre", null);
          this.arreglo[(ejeY*8)-control+ejeX].jugado = true;
        }
        this.arreglo[num].jugado = true;
        this.cambioTurno();
        this.movimientos.push(efecto);
        this.estadoS(false);
        this.movimientos = null;
        revisarEjecutar = true;
      }else{
        this.movimientos.push(efecto);
        this.estadoS(false);
        this.movimientos = null;
        this.normal(num);
      }
    }else{
      if(this.movimientosC != null){
        this.estadoSC(false);
        this.movimientosC = null;
      }
      if(this.turno == color){
        this.disponiblesNormal(num, ejeX, ejeY, tipo, color);
      }
    }
    if(revisarEjecutar)
      this.revisar();
  }

  disponiblesC(num, ejeX, ejeY, tipo, color){
    if(this.movimientos != null){
      this.estadoS(false);
      this.movimientos = null;
    }

    if(this.movimientosC != null){
      this.estadoSC(false);
      this.movimientosC = null;
    }

    this.turno = !this.turno;
    this.disponiblesNormal(num, ejeX, ejeY, tipo, color);
    this.estadoS(false);
    this.turno = !this.turno;

    this.movimientosC = this.movimientos;
    this.movimientos = null;
    let relo: number[] = [];
    this.movimientosC.forEach(e => {
      if(this.arreglo[e].tipo == "libre"){
        relo.push(e);
      }else if(this.arreglo[e].identificador == this.arreglo[num].identificador && this.arreglo[e].hijo == this.arreglo[num].hijo && this.arreglo[e].identificador != 0 && this.arreglo[e].tipo == this.arreglo[num].tipo && e != num){
        relo.push(e);
      }
    });
    this.movimientosC = relo;
    this.estadoSC(true);
    this.movimientosC.push(num);
  }


  cuantico(num){
    let ejeX: number = (num%8); //0-7
    let ejeY: number = ((num/8) - ((num/8)%1)); //0-7
    let tipo: string = this.arreglo[num].tipo;
    let color: boolean = this.arreglo[num].equipo;
    if(tipo == "peon"){
      return false;
    }
    if(this.movimientosC != null){
      let back:number = this.movimientosC.pop();
      if(this.movimientosC.some(e => e == num) || this.superposicion > 0 && back != num){
        if(this.arreglo[num].tipo == "libre"){
          if(this.superposicion == 0){
            this.arreglo[back].cuantica = true;
            this.arreglo[back].actualizarC();
            if(this.arreglo[back].identificador == 0){
              this.jugadasC += 1;
              this.arreglo[back].identificador = this.jugadasC;
            }
            this.arreglo[back].posibilidad *= 2;
            this.arreglo[back].hijo += 1;
            this.arreglo[num] = this.arreglo[back];
            this.superposicion += 1;
            let temp:number[] = this.movimientosC;
            this.movimientosC.forEach(e => {
              if(e != num){
                temp.push(e);
              }
            });
            this.movimientosC = temp;
            this.movimientoCuentico = num;
          }else{
            if(this.movimientosC.some(e => e == num)){
              this.arreglo[num] = this.arreglo[back];
              this.arreglo[back] = new ficha("libre", null);
              this.superposicion += 1;
            }else{
              this.movimientosC.push(back);
              return false;
            }
          }
        }else{
          if(this.superposicion == 0){
            this.arreglo[back].posibilidad /= 2;
            this.arreglo[back].hijo -= 1;
            if(this.arreglo[back].hijo == 0){
              this.arreglo[back].cuantica = false;
              this.arreglo[back].actualizarC();
            }
            this.arreglo[num] = this.arreglo[back];
            this.arreglo[back] = new ficha("libre", null);
            this.superposicion = 2;
          }else{
            if(this.movimientosC.some(e => e == num)){
              this.arreglo[back].posibilidad /= 2;
              this.arreglo[back].hijo -= 1;
              if(this.arreglo[back].hijo == 0){
                this.arreglo[back].cuantica = false;
                this.arreglo[back].actualizarC();
              }
              this.arreglo[num] = this.arreglo[back];
              this.arreglo[back] = new ficha("libre", null);
              this.superposicion = 2;
            }else{
              let temporal:number[] = this.movimientosC;
              this.estadoSC(false);
              this.movimientosC = null;
              this.disponiblesC(num, ejeX, ejeY, tipo, color);
              this.estadoSC(false);
              if(this.movimientosC.some(e => e == this.movimientoCuentico)){
                this.movimientosC = [this.movimientoCuentico, num];
                this.movimientoCuentico = null;
                return false;
              }else{
                this.movimientosC = temporal;
                this.movimientosC.push(back);
                return false;
              }
            }
          }
        }
        this.movimientosC.push(back);
        if(this.superposicion == 2){
          this.cambioTurno();
          this.superposicion = 0;
          this.estadoSC(false);
          this.movimientosC = null;
          this.movimientoCuentico = null;
        }
      }else{
        if(num != back && color == this.turno){
          this.disponiblesC(num, ejeX, ejeY, tipo, color);
        }else{
          this.movimientosC.push(back);
          return false;
        }
      }
    }else{
      if(color == this.turno)
        this.disponiblesC(num, ejeX, ejeY, tipo, color);
    }
    return false;
  }











}


class ficha{
  tipo: string;
  equipo: boolean;
  clase: string;
  cuantica: boolean;
  seleccionado: boolean;
  jugado: boolean;
  identificador: number;
  posibilidad: number;
  hijo:number;

  constructor(tp, tm){
    this.tipo = tp;
    this.equipo = tm;
    this.clase = this.tipo + " " + this.equipo;
    if(this.tipo == "libre") this.clase = this.tipo;
    this.cuantica = false;
    this.seleccionado = false;
    this.jugado = false;
    this.identificador = 0;
    this.hijo = 0;
    this.posibilidad = 1;
  }

  actualizarC(){
    this.clase = this.tipo + " " + this.equipo;
    if(this.tipo == "libre") this.clase = this.tipo;
    if(this.cuantica) this.clase += " cuantico";
  }
}
