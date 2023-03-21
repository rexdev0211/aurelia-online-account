import {ApplicationState} from 'applicationState';
import {observable} from "aurelia-framework";
import {dispatchify} from 'aurelia-store';
import * as changeCase from 'change-case';
import * as Humanizer from 'humanize-string';
import {BaseElement} from "../../../bases/base-element";
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";
import Job = OnlineAccountApi.Job;
import JobTask = OnlineAccountApi.JobTask;
import JobState = OnlineAccountApi.JobState;
import {bindable} from "aurelia-templating";


export class JobViewerCustomElement extends BaseElement {
    @observable job: OnlineAccountApi.Job;
    currentState: number;
    private statusType: string;
    private parentERN: string;
    private isConsumer: boolean;
    private isConsumerRunning: boolean;
    private transactionHeld: boolean;
    private scrollBoxDiv: HTMLDivElement;
    private currentIndex: number;
    @bindable overrideSubmit:Function;
    @bindable disablePageContent:boolean = false;

    constructor(...args) {
        super(...args);
    }

    attached() {
        this.statusType = `${changeCase.titleCase(Humanizer(this.state.currentJob.type))} Status`;
        this.setScrollTop();
    }

    humanize(value: string, stringCase?: string) {
        let response = Humanizer(value);
        if (stringCase) response = changeCase[stringCase](response);

        response = response.replace('bka', '').replace('for', '').replace('execute', '').trim();

        return response;
    }

    getJobCss(job: Job) {
        let css = 'fa fa-fw fa-spinner fa-pulse';

        if (job && job.tasks && job.tasks[0].state !== JobState.New)
            css = 'fa fa-fw fa-check text-success';

        return css;
    }

    getTaskCss(task: JobTask) {
        let css = 'fa fa-fw fa-spinner fa-pulse';
        switch (task.state) {
            case JobState.New:
                css = 'far fa-fw fa-square';
                break;
            case JobState.Succeeded:
                css = 'fa fa-fw fa-check text-success';
                break;
            case JobState.Failed:
                css = 'fa fa-fw fa-times text-danger';
                break;
        }

        return css;
    }


    stateChanged(state: ApplicationState) {
        if (state.jobViewerERN?.length == null) this.job = state.currentJob;
        if (state.jobViewerERN && state.currentJob && state.jobViewerERN == state.currentJob.jobERN) this.job = state.currentJob;
    }

    jobChanged(job: OnlineAccountApi.Job) {
        if (job) {
            this.utils.rehydrateMeta(job);
            let taskRemaining = job.tasks.filter(x => !x.hasOwnProperty('state'));
            this.currentIndex = job.tasks.length - taskRemaining.length;
            this.setScrollTop();
        }
    }

    setScrollTop() {
        if (this.scrollBoxDiv) {
            if (this.scrollBoxDiv.children && this.scrollBoxDiv.children.length > 0) {
                if (this.currentIndex < 5) this.scrollBoxDiv.children[0]?.scrollIntoView();
                else this.scrollBoxDiv.children[this.currentIndex - 5]?.scrollIntoView();
            }
        }
    }

    submit() {
        if (this.overrideSubmit) return this.overrideSubmit();

        dispatchify('clearCurrentJob')();
        dispatchify('setJobViewerERN')();
        location.hash = "#/";
    }

    // private parseTitle() {
    //     if (this.state.currentJob) {
    //         if (this.state.currentJob.jobChain && this.state.currentJob.jobChain.length)
    //             this.statusType = 'Send Funds Status';
    //         else
    //             this.statusType = 'Transfer Funds Status';
    //     } else {
    //         this.statusType = 'Status';
    //     }
    // }

    // private reloadJobs() {
    // let activeJobs = this.state.jobs.filter(x => x.parentERN === this.parentERN);
    //
    // activeJobs.forEach(job => this.currentJobMap.set(job.ern, job));
    // }

    // private parseConsumerRunning() {
    //     if (this.state.currentJob && this.state.currentJob.jobChain && this.state.currentJob.jobChain.length) {
    //         this.isConsumerRunning = (this.state.currentJob.chainIndex != this.state.currentJob.jobChain.length - 1 && this.state.currentJob.currentState !== 2) || (this.state.currentJob.chainIndex == this.state.currentJob.jobChain.length - 1 && this.state.currentJob.currentState <= 1);
    //     } else {
    //         this.isConsumerRunning = this.state.currentJob && this.state.currentJob.currentState <= 1;
    //     }
    //
    // }
}


