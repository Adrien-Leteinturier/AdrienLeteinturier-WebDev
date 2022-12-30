import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  @ViewChild("mainContent") mainContent: ElementRef;
  isShowScrollBackButton = false;
  
  constructor(@Inject(DOCUMENT) private document: Document) {}
  
  onScrollInAnchor(elementId: string) {
    this.document.defaultView.document
    .getElementById(elementId)
    .scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
  
  scrollTop() {
    this.mainContent.nativeElement
      .scrollTo({ top: 0, behavior: "smooth" })
      const timeout = setTimeout(() => {
        this.isShowScrollBackButton = false;
        clearTimeout(timeout);
      }, 800);
  }
}
