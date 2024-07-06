import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <p>
    <a routerLink="/dice-tools"> Dice Tools </a>
    <a routerLink="/lobby"> Game Test </a>
    </p>
  `,
  styles: ``
})
export class HomeComponent {

}
