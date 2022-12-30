import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './modals.component.html',
    styleUrls: ['./modals.component.css']
})
export class ModalComponent implements OnInit, OnChanges {
  @Input() arrayModal: any;
  data: any;

  ngOnInit() {
  }

  ngOnChanges() {
    this.doSomething(this.arrayModal);
  }

  private doSomething(input: any) {
    if(input){
      this.data = input;
    }
  }

  showModal(){
  }
}