import { PLATFORM } from "aurelia-pal";
import { Router, RouterConfiguration } from "aurelia-router";
import { bindable, inject } from "aurelia-framework";
import { BaseRouter } from "./bases/base-router";
import { dispatchify } from "aurelia-store";

export class MfaRouter extends BaseRouter {
  router: Router;

  @bindable
  value;

  constructor(...args) {
    super(...args);
  }

  async configureRouter(config: RouterConfiguration, router: Router): Promise<any> {
    this.router = router;

    let routes = [
      {
        route: ["", "mfa"],
        name: "mfa",
        moduleId: PLATFORM.moduleName("./routes/mfa/mfa"),
        nav: true,
        title: "Multi-Factor Authentication",
        settings: {
          icon: "fa-home"
        }
      },
      {
        route: "mfa/select",
        name: "mfa-select",
        moduleId: PLATFORM.moduleName("./routes/mfa/select"),
        nav: true,
        title: "Select MFA",
        settings: {
          icon: "fa-home"
        }
      },
      {
        route: "mfa/setup",
        name: "mfa-setup",
        moduleId: PLATFORM.moduleName("./routes/mfa/setup"),
        nav: false,
        title: "Setup MFA",
        settings: {
          icon: "fa-home"
        }
      },
      {
        route: "mfa/sms",
        name: "mfa-sms",
        moduleId: PLATFORM.moduleName("./routes/mfa/sms"),
        nav: true,
        title: "SMS MFA",
        settings: {
          icon: "fa-home"
        }
      },
      {
        route: "mfa/totp",
        name: "mfa-totp",
        moduleId: PLATFORM.moduleName("./routes/mfa/totp"),
        nav: true,
        title: "TOTP MFA",
        settings: {
          icon: "fa-home"
        }
      },
      {
        route: "login/mfa",
        name: "login-mfa",
        moduleId: PLATFORM.moduleName("./routes/unauthenticated/auth/login-mfa"),
        nav: false,
        title: "Login",
        settings: {
          icon: "fa-home"
        }
      }
    ];

    dispatchify("showNavbar")(false);
    config.mapUnknownRoutes(routes[0]).map(routes);
  }
}
