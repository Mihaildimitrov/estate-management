import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  public loading = true;

  constructor() { }

  ngOnInit() {
    // https://www.chartjs.org/docs/latest/api/enums/UpdateModeEnum.html
    // https://javascript.plainenglish.io/ionic-5-charts-graphs-using-chartjs-library-5ce69b83b2a9
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

}
