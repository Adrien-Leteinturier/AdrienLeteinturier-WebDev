import { Component } from '@angular/core';
import { Job } from './job';
import { JobService } from './job.service';

@Component({
    selector: 'app-job',
    templateUrl: './job.component.html',
    styleUrls: ['./job.component.css']
})

export class JobComponent{
    jobs: Job[];
    
    constructor(public _jobService: JobService){ 
    }
    
    ngOnInit() { // pour initialiser les données du servcice
        this.callJobServiceFor(); 
    }
    
    private callJobServiceFor() {
        this._jobService.getJobsFromAPIwithCache()
        .subscribe(res => this.jobs = res, err => console.error(err.status));
    }

    clickLosangeElement(link:string){
        if(link){
            window.open(link, '_blank');
        }
    }
}




