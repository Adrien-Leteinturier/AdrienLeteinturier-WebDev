import { Component } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { Job } from "./job";
import { JobService } from "./job.service";

@Component({
  selector: "app-job",
  templateUrl: "./job.component.html",
  styleUrls: ["./job.component.css"],
})
export class JobComponent {
  jobs: Job[];

  constructor(public _jobService: JobService) {}

  ngOnInit() {
    this.callJobServiceFor();
  }

  clickLosangeElement(link: string) {
    if (link) {
      window.open(link, "_blank");
    }
  }

  private callJobServiceFor() {
    this._jobService.getJobsFromAPIwithCache().subscribe(
      (res) => (this.jobs = res),
      (err) => console.error(err.status)
    );
  }
}
