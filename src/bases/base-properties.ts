import {ApplicationState} from "applicationState";
import {Container} from 'aurelia-dependency-injection';
import {DialogController, DialogService} from "aurelia-dialog";
import {Aurelia, BindingEngine, inject, observable, TaskQueue, TemplatingEngine, transient} from "aurelia-framework";
import {Router} from "aurelia-router";
import {Store} from "aurelia-store";
import {ValidationController, ValidationControllerFactory} from "aurelia-validation";
import {DataStore} from "common/data-stores/data-store";
import {NotificationService} from "common/services/notification-service";
import {ProgressService} from "common/services/progress-service";
import {StorageService} from "common/services/storage-service";
import {BootstrapFormRenderer} from "common/validation/bootstrap-form-renderer";
// import * as exceptionless from 'exceptionless';
import {Subscription} from "rxjs";
import {AuthService} from "../common/services/auth-service";
import {ServiceClients} from "../common/services/clients/service-clients";
import {EventService} from "../common/services/event-service";
import {Utils} from "../common/services/utils";

@transient()
@inject(
    BindingEngine,
    TemplatingEngine,
    Router,
    ValidationControllerFactory,
    ProgressService,
    StorageService,
    NotificationService,
    DialogService,
    DialogController,
    Store,
    Aurelia,
    Utils,
    EventService,
    DataStore,
    TaskQueue,
    ServiceClients,
    AuthService
)
export class BaseProperties {
    public validationController: ValidationController;
    public validationControllerFactory: ValidationControllerFactory;
    public router: Router;
    public progressService: ProgressService;
    public store: Store<ApplicationState>;
    @observable public state: ApplicationState;
    public cache: StorageService;
    public notificationService: NotificationService;
    public dialogService: DialogService;
    public dialogController: DialogController;
    public subscription: Subscription;
    public aurelia: Aurelia;
    public utils: Utils;
    public parent: any;
    public eventService: EventService;
    public dataStore: DataStore;
    public bindingEngine: BindingEngine;
    public templateingEngine: TemplatingEngine;
    public taskQueue: TaskQueue;
    public serviceClients: ServiceClients;
    // public exceptionless: exceptionless.ExceptionlessClient;
    public container: Container;
    public auth: AuthService
    public publishEvent: (event, data) => void;
    public addSubscription: (event, callback) => void;
    public removeSubscription: (subscription) => Promise<void>;
    public clearSubscriptions: () => void;
    public subscriptions: (Array<({ dispose(): void; }) | { unsubscribe(): void; }>) = [];
    public viewAttached: boolean;

    constructor(...args) {
        this.container = Container.instance;
        this.templateingEngine = args.find(x => x instanceof TemplatingEngine);
        this.bindingEngine = args.find(x => x instanceof BindingEngine);
        this.router = args.find(x => x instanceof Router);
        this.validationControllerFactory = args.find(x => x instanceof ValidationControllerFactory);
        this.progressService = args.find(x => x instanceof ProgressService);
        this.cache = args.find(x => x instanceof StorageService);
        this.notificationService = args.find(x => x instanceof NotificationService);
        this.dialogService = args.find(x => x instanceof DialogService);
        this.dialogController = args.find(x => x instanceof DialogController);
        this.store = args.find(x => x instanceof Store);
        this.aurelia = args.find(x => x instanceof Aurelia);
        this.utils = args.find(x => x instanceof Utils);
        this.eventService = args.find(x => x instanceof EventService);
        this.dataStore = args.find(x => x instanceof DataStore);
        this.taskQueue = args.find(x => x instanceof TaskQueue);
        this.serviceClients = args.find(x => x instanceof ServiceClients);
        this.auth = args.find(x => x instanceof AuthService);

        // this.exceptionless = exceptionless.ExceptionlessClient.default;
        // this.exceptionless.config.apiKey = environment().exceptionlessKey;
        // this.exceptionless.config.serverUrl = environment().exceptionlessUrl;
        // this.exceptionless.config.includeCookies = true;
        // this.exceptionless.config.setVersion(environment().buildNumber);
        // this.exceptionless.config.useReferenceIds();
        // this.exceptionless.config.defaultTags = [environment().appName];
        //
        // if (window.localStorage) this.exceptionless.config.useLocalStorage();
        // if (environment().debug) this.exceptionless.config.useDebugLogger();

        this.validationController = this.getValidationController();

        this.publishEvent = (event, data) => {
            this.eventService.publish(event, data);
        };

        this.addSubscription = (event, callback) => {
            this.subscriptions.push(this.eventService.subscribe(event, callback));
        };

        this.removeSubscription = async subscription => {
            this.eventService.unsubscribe(subscription);
        };

        this.clearSubscriptions = () => {
            this.eventService.unsubscribe(this.subscriptions);
        };

        this.subscriptions.push(this.store.state.subscribe(
            state => (this.state = state)
        ));
    }

    getValidationController = () => {
        let validationController = this.validationControllerFactory.createForCurrentScope();
        validationController.addRenderer(new BootstrapFormRenderer());
        return validationController;
    };

    bind(bindingContext?: any, overrideContext?: any): any {
        this.parent = bindingContext;
    }

    unbind() {
        this.clearSubscriptions();
    }
}
