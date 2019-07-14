import { Component, OnInit } from '@angular/core';
import { HttpHelperService } from '../httphelper/http-helper.service';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent implements OnInit {

  constructor(private httpHelper: HttpHelperService) { }

  ngOnInit() {
    this.readSummary();
    this.timer = setInterval(() => {
      this.readSummary();
    }, 10000);
  }
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  private timer;
  myType = 'PieChart';
  myData = [
    ['Work', 11],
    ['Eat', 2],
    ['Commute', 2],
    ['Watch TV', 2],
    ['Sleep', 7]
  ];
  myTitle = "Activity Summary";
  myOptions = {
    is3D: true,
    animation: {
      duration: 1000,
      easing: 'out',
    },
  };
  myColumnNames = ['Activity', 'Time (hours)'];
  width = 900;
  height = 580;

  readSummary() {
    this.httpHelper.get("summary").subscribe((summary: []) => {
      this.myData = [];
      summary.forEach(element => {
        this.myData.push([element["Activity"], element["Duration"]]);
      })
    })
  }
}
