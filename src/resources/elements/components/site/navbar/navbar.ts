import {RouteConfig} from "aurelia-router";
import {BaseElement} from '../../../../../bases/base-element';
import {observable} from "aurelia-framework";

export class NavbarCustomElement extends BaseElement {

    @observable mailbox;
    private routes: kendo.data.HierarchicalDataSource;
    private akMenu: any;
    private dataSource: kendo.data.DataSource;

    constructor(...args) {
        super(...args);
        this.buildKendoUIMenu();
    }

    stateChanged(newValue) {
        this.mailbox = newValue.messaging.selectedMailbox;
    }

    mailboxChanged(newValue) {
        this.buildMenu();
    }

    public toggleMenu() {
        $('.nav-bar').toggleClass('collapse');
    }


    public buildMenu() {
        this.buildKendoUIMenu();
    }

    private buildKendoUIMenu() {
        let routes: Array<KendoMenuItem> = [];
        this.router.routes
            .filter(route => !route.settings.parent && route.nav)
            .forEach(route => {
                routes.push(this.buildMenuItem(route));
            });

        this.routes = new kendo.data.HierarchicalDataSource({
            data: routes
        });

        if (this.akMenu) {
            this.akMenu.kWidget.dataSource.data(routes);
        }
    }

    private buildMenuItem(routeConfig: RouteConfig): KendoMenuItem {
        return [routeConfig].map(x => this.mapRouteConfig(x))[0];
    }

    private mapRouteConfig(route: RouteConfig) {
        let menuItem = new KendoMenuItem({
            name: route.name,
            text: route.title,
            url: route.name.endsWith('-menu')
                ? ''
                : `#/${route.route}`,
            spriteCssClass: route.settings.icon
        });

        if (route.name === 'mailbox' && this.state.messaging.totalUnread > 0) {
            menuItem.text = `Mailbox (${this.state.messaging.totalUnread})`;
            menuItem.spriteCssClass = `${menuItem.spriteCssClass} shadow-pulse-gold gold`;
        }

        if (route.name.endsWith('-menu')) {
            menuItem.items = this.router.routes
                .filter(value => value.settings.parent == route.name)
                .map(x => this.mapRouteConfig(x))
        }

        return menuItem;
    }
}

export class KendoMenuItem {
    name: string;
    text: string;
    spriteCssClass: string;
    icon: string;
    url: string;
    items: Array<KendoMenuItem>;

    constructor(init?: Partial<KendoMenuItem>) {
        (<any>Object).assign(this, init);
    }
}

