import { Component, Input, OnInit } from '@angular/core';

import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {

  @Input() title = 'Sin titulo';

  // tslint:disable-next-line: no-input-rename
  @Input('labels') doughnutChartLabels: Label[] = ['Label 1', 'Label 2', 'Label 3'];

  // tslint:disable-next-line: no-input-rename
  @Input('data') doughnutChartData: MultiDataSet = [
    [350, 450, 20]
  ];


  public colors: Color[] = [
    {backgroundColor: ['#6857E6', '#009FEE', '#F02059']}
  ];


}
