import {ApplicationInsights} from '@microsoft/applicationinsights-web'
import {autoinject, bindable, PLATFORM} from "aurelia-framework";
import {Router, RouterConfiguration} from "aurelia-router";
import {dispatchify} from "aurelia-store";
import {BaseRouter} from "./bases/base-router";
import environment from "./environment";

@autoinject
export class UnauthenticatedRouter extends BaseRouter {
    router: Router;

    @bindable
    value;

    constructor(private applicationInsights: ApplicationInsights, ...args) {
        super(...args);
        this.applicationInsights.clearAuthenticatedUserContext();
        this.applicationInsights.trackEvent({name: `${environment().appName} Unauthenticated Router Loaded`});
    }

    configureRouter(config: RouterConfiguration, router: Router): void {
        // Let's clear out the cache since we are hitting this route.
        this.cache.clear();

        this.router = router;

        config.title = "Enumis Online Account";
        let routes = [
            {
                route: ["", "login"],
                name: "login",
                moduleId: PLATFORM.moduleName("./routes/unauthenticated/auth/login"),
                nav: true,
                title: "Login",
                settings: {
                    icon: "fa-home"
                }
            },
            {
                route: "login/mfa",
                name: "login-mfa",
                moduleId: PLATFORM.moduleName("./routes/unauthenticated/auth/login-mfa"),
                nav: true,
                title: "Login",
                settings: {
                    icon: "fa-home"
                }
            },
            {
                route: "auth/change/password",
                name: "auth-change-password",
                moduleId: PLATFORM.moduleName(
                    "./routes/unauthenticated/auth/change-password"
                ),
                nav: false,
                title: "Change Password",
                settings: {
                    icon: "fa-home"
                }
            },
            {
                route: "start/password/reset",
                name: "start-password-reset",
                moduleId: PLATFORM.moduleName(
                    "./routes/unauthenticated/auth/start-password-reset"
                ),
                nav: false,
                title: "Start Reset Password",
                settings: {
                    icon: "fa-home"
                }
            },
            {
                route: "confirm/password/reset",
                name: "confirm-password-reset",
                moduleId: PLATFORM.moduleName(
                    "./routes/unauthenticated/auth/confirm-password-reset"
                ),
                nav: false,
                title: "Confirm Reset Password",
                settings: {
                    icon: "fa-home"
                }
            },
            {
                route: "finish/password/reset",
                name: "finish-password-reset",
                moduleId: PLATFORM.moduleName(
                    "./routes/unauthenticated/auth/finish-password-reset"
                ),
                nav: false,
                title: "Finish Reset Password",
                settings: {
                    icon: "fa-home"
                }
            },
            {
                route: "start/registration",
                name: "start-registration",
                moduleId: PLATFORM.moduleName(
                    "./routes/unauthenticated/registration/start-registration"
                ),
                nav: false,
                title: "Start Registration",
                settings: {
                    icon: "fa-home"
                }
            },
            {
                route: "confirm/registration",
                name: "confirm-registration",
                moduleId: PLATFORM.moduleName(
                    "./routes/unauthenticated/registration/confirm-registration"
                ),
                nav: false,
                title: "Confirm Registration",
                settings: {
                    icon: "fa-home"
                }
            },
            {
                route: "finish/registration",
                name: "finish-registration",
                moduleId: PLATFORM.moduleName(
                    "./routes/unauthenticated/registration/finish-registration"
                ),
                nav: false,
                title: "Finish Registration",
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
