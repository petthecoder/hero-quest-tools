import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dice-tools',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dice-tools.component.html',
  styleUrl: './dice-tools.component.css'
})
export class DiceToolsComponent implements OnInit {

  labels: string[] = [];
  data: any;
  config: any;
  chart: Chart | undefined;
  ctx: HTMLCanvasElement;
  totalRolls = 100000;
  damages: Record<number, number> = {};
  totalDamage = 0;

  averageDamage = 0;
  medianDamage = "";
  critCap10 = 0;
  critCap20 = 0;
  critCap30 = 0;

  loading = false;

  constructor() {
    this.ctx = document.getElementById('myChart') as HTMLCanvasElement;
  }


  ngOnInit(): void {
    this.ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.updateChart();
  }

  calculate() {
    this.loading = true;

    setTimeout(() => {
      this.generateThrows();
      this.loading = false;
    }, 100);
  }

  generateThrows() {

    this.damages = {};
    this.totalDamage = 0;

    for (let i = 0; i < this.totalRolls; i++) {
      this.dice.forEach((die, index) => {
        if(this.diceCounts[index] > 0) {
          let value = this.throwDices(die.value, this.diceCounts[index]);
          this.totalDamage += value;
          if (this.damages[value]) {
            this.damages[value]++;
          } else {
            this.damages[value] = 1;
          }
        }
      });
    }

    this.updateChart();

  }

  updateChart() {

    this.labels = []
    var dataArray = []
    var lastMedianValue = 0;
    let stats: Record<number, number> = {};

    for (let key in this.damages) {
      
      let frequency = this.damages[key];
      stats[key] = (frequency / this.totalRolls) * 100;

      this.labels.push(key);
      dataArray.push(this.damages[key]);

      if(lastMedianValue < this.damages[key]) {
        lastMedianValue = this.damages[key];
        this.medianDamage = key;
      }
    }

    this.calculateCrits(stats);
    this.averageDamage = this.totalDamage/this.totalRolls;

    this.data = {
      labels: this.labels,
      datasets: [
      {
        label: 'Dice Rolls',
        data: dataArray,
        borderWidth: 1
      }
    ]
    };

    this.chart?.destroy();

    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: this.data,
      options: this.config
    });

  }

  calculateCrits(stats: Record<number, number>) {
    var total = 0;
    this.critCap30 = 0;
    this.critCap20 = 0;
    this.critCap10 = 0;
    for (let key in stats) {
        total += stats[key]
        if(total > 70 && this.critCap30 == 0){
          this.critCap30 = parseInt(key);
        }
        if(total > 80 &&  this.critCap20  == 0){
          this.critCap20 = parseInt(key);
        }
        if(total > 90 && this.critCap10 == 0){
            this.critCap10 = parseInt(key);
        }
    }
  }

  throwDices(dice:number, times:number) {
    let value = 0;
    for (let i = 0; i < times; i++) {
      value += this.randomIntFromInterval(1, dice);
    }
    return value;
  }

  randomIntFromInterval(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  dice = [
    { type: 'D4', shape: 'triangle', value: 4 },
    { type: 'D6', shape: 'square', value: 6 },
    { type: 'D8', shape: 'diamond', value: 8 },
    { type: 'D10', shape: 'pentagon', value: 10 },
    { type: 'D12', shape: 'hexagon', value: 12 },
    { type: 'D20', shape: 'octagon', value: 20 },
    { type: 'D100', shape: 'circle', value: 100 }
  ];

  diceCounts: number[] = new Array(this.dice.length).fill(0);

}
