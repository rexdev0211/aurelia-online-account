import {autoinject, bindable, PLATFORM} from "aurelia-framework";
import {Router, RouterConfiguration} from "aurelia-router";
import {dispatchify} from "aurelia-store";
import {BaseRouter} from "./bases/base-router";

@autoinject
export class MaintenanceRouter extends BaseRouter {
  router: Router;

  constructor(...args) {
    super(...args);
  }

  configureRouter(config: RouterConfiguration, router: Router): void {
    // Let's clear out the cache since we are hitting this route.
    this.cache.clear();

    this.router = router;

    config.title = "Enumis Online Account";
    let routes = [
      {
        route: ["", "maintenance"],
        name: "maintenance",
        moduleId: PLATFORM.moduleName("./routes/maintenance/page"),
        nav: true,
        title: "System Maintenance",
        settings: {
          icon: "fa-home"
        }
      }
    ];

    if (!this.utils.isSecureHost) {
      routes = [routes[0]];
    }

    dispatchify("showNavbar")(false);
    config.mapUnknownRoutes(routes[0]).map(routes);
  }
}
