import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { WindowElementService } from '../windowElement/window-element.service';

@Component({
  selector: 'app-scroll-back-button',
  templateUrl: './scroll-back-button.component.html',
  styleUrls: ['./scroll-back-button.component.css']
})
export class ScrollBackButtonComponent {
  @Input() bgColorButton: string;
  @Input() show: boolean;
  @Output() onClickScrollBackButton = new EventEmitter();

  window:any = this._WindowElementService.nativeWindow;
  
  constructor(public _elementRef:ElementRef, public _WindowElementService : WindowElementService) {}
  
  public scrollTop(){
    this.onClickScrollBackButton.emit();
  }
  
}
