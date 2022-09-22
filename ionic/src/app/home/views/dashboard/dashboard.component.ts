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

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

}
