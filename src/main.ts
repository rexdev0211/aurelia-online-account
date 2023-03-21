/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
// @formatter:off
//import '@progress/kendo-theme-default';
import {ApplicationInsights} from '@microsoft/applicationinsights-web'
import '@progress/kendo-ui';
import '@progress/kendo-ui/js/cultures/kendo.culture.en-GB.min';
import '@progress/kendo-ui/js/cultures/kendo.culture.de-DE.min';
import {ApplicationState} from "applicationState";
import {Aurelia} from "aurelia-framework";
import "aurelia-kendoui-bridge";
import {PLATFORM} from "aurelia-pal";
import {CustomValidationRules} from "common/validation/custom-validation-rules";
import {CustomPrototypes} from "./custom-prototypes";

import "izitoast/dist/css/iziToast.min.css";

import "jquery";
import "nprogress/nprogress.css";

import "./assets/global/css/compatibility/fabric.css";
import "./assets/global/css/fabric.css";
import "./assets/global/css/fabric.custom.css";

import "./assets/global/css/icons/icomoon/styles.css";
import "./assets/global/js/main/bootstrap.bundle.min.js";

import "./assets/global/js/page/components_media.js";
import "./assets/global/js/page/extension_blockui.js";
import "./assets/global/js/page/login.js";
import "./assets/global/js/page/navbar_multiple.js";
import "./assets/global/js/plugins/forms/styling/switchery.min.js";
import "./assets/global/js/plugins/forms/styling/uniform.min.js";
import "./assets/global/js/plugins/loaders/blockui.min.js";
import "./assets/global/js/plugins/ui/fab.min.js";
import "./assets/global/js/plugins/ui/prism.min.js";
import "./assets/global/js/plugins/ui/slinky.min.js";
import "./assets/layout/css/bootstrap.min.css";
import "./assets/layout/css/bootstrap_theme.min.css";

import "./assets/layout/css/client.css";
import "./assets/layout/css/colors.min.css";
import "./assets/layout/css/components.min.css";
import "./assets/layout/css/layout.min.css";

import "./assets/layout/js/app.js";
import "./assets/layout/js/client.js";

import {DataStore} from "./common/data-stores/data-store";
import {AuthService} from "./common/services/auth-service";
import {Utils} from "./common/services/utils";
import environment from "./environment";
import "intl-tel-input/build/css/intlTelInput.css";

import './assets/layout/css/dropzone.basic.min.css';
import './assets/layout/css/dropzone.min.css';

import "@progress/kendo-ui/css/web/kendo.common.min.css";
import "./assets/layout/css/all.css";
import "./assets/layout/css/kendo.custom.css";
import "./assets/layout/css/kendo.custom.navbar.css";
import "./assets/layout/css/extra.css";

// @formatter:on

//Bluebird.config({warnings: {wForgottenReturn: false}});
interface String {
    replaceAll(input: string, output: string): any;
}


export async function configure(aurelia: Aurelia) {

    //#region Configuration

    let configuration, json, error;

    let currentState = JSON.parse(sessionStorage.getItem('aurelia-store-state'));
    let header = {headers: {'Content-Type': 'application/json', 'authorization': ''}};
    if (currentState?.authentication?.user?.bearerToken) header.headers.authorization = `bearer ${currentState.authentication.user.bearerToken}`;


            try {
               // let simResponse = await fetch('https://api.sim.enumis.co.uk/onlineaccount-api/site/configuration/onlineaccount', header);
                let simResponse = await fetch('https://sim-enumis-api-onlineaccount.sim.enumis.co.uk/site/configuration/onlineaccount', header);
                if (!simResponse.ok) throw new Error('Failed to receive site configuration')
                json = await simResponse.json();
            } catch {
            }
            configuration = {
                "debug": false,
                "testing": false,
                "region": "sim",
            };


    configuration.appName = "OnlineAccount";
    configuration.apiRoot = `https://sim-enumis-api-onlineaccount.sim.enumis.co.uk`;
    if (!configuration.wssRoot) configuration.wssRoot = `https://sim-enumis-api-events-signalr-server.sim.enumis.co.uk/hubs/onlineaccount`;
    configuration.features = {"showSpending": true};

    // Use GIT_VERSION build number in production
    configuration.buildNumber = '#{_APP_VER}#';

    if (json) {
        configuration.instrumentationKey = json.instrumentationKey;
        configuration.autoLogoffMinutes = json.autoLogoffMinutes;
        json.features.forEach(x => configuration.features[x] = true);
    }

    console.log('Configuration', configuration);
    aurelia.container.registerSingleton('config', () => configuration);

    //#endregion

    if (json) {
        aurelia.container.registerInstance(ApplicationInsights, new ApplicationInsights({
            config: {
                instrumentationKey: environment().instrumentationKey,
                appId: `Web:${environment().appName}`,
                enableAutoRouteTracking: true,
                enableCorsCorrelation: true,
                autoTrackPageVisitTime: true,
                enableRequestHeaderTracking: true,
                enableResponseHeaderTracking: true,
                loggingLevelTelemetry: 2,

                /* ...Other Configuration Options... */
            }
        }));

        aurelia.container.get(ApplicationInsights).loadAppInsights();
        aurelia.container.get(ApplicationInsights).trackPageView();
    }

    PLATFORM.moduleName("mfa");
    PLATFORM.moduleName("authenticated");
    PLATFORM.moduleName("unauthenticated");
    PLATFORM.moduleName("maintenance");

    CustomPrototypes.loadPrototypes();
    CustomValidationRules.loadRules();

    aurelia.use
        .standardConfiguration()
        .plugin(PLATFORM.moduleName('aurelia-cookie'))
        .plugin(PLATFORM.moduleName("aurelia-validation"))
        .plugin(PLATFORM.moduleName("aurelia-dialog"))
        .plugin(PLATFORM.moduleName('aurelia-kendoui-bridge'))
        .plugin(PLATFORM.moduleName('aurelia-bootstrap'), config => config.options.version = 4)
        .plugin(PLATFORM.moduleName("aurelia-store"), {
            initialState: new ApplicationState()
        })
        .feature(PLATFORM.moduleName("resources/index"));

    // Uncomment the line below to enable animation.
    aurelia.use.plugin(PLATFORM.moduleName("aurelia-animator-css"));
    // if the css animator is enabled, add swap-order="after" to all router-view elements

    // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
    // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));

    // Lets wire up the store and rehydrate the current state
    let dataStore = aurelia.container.get(DataStore);
    aurelia.container.registerSingleton(AuthService);

    if (environment().debug) {
        aurelia.use
            .developmentLogging()
            .plugin(PLATFORM.moduleName('aurelia-kendoui-bridge'));
    }

    if (environment().testing) {
        aurelia.use.plugin(PLATFORM.moduleName("aurelia-testing"));
    }

    await aurelia.start();

    let refreshToken = (aurelia.container.get(Utils) as Utils).getPropertyValue<string>(dataStore.state, "authentication.user.refreshToken");
    let bearerToken = null;
    if (refreshToken) {
        bearerToken = await (aurelia.container.get(AuthService) as AuthService).refreshBearerToken();
        if (!bearerToken) kendo.alert('Your token has expired!</br>Please log in again.');
    }

    if (!json) {
        await aurelia.setRoot(PLATFORM.moduleName("maintenance"));
    } else {
        await aurelia.setRoot(PLATFORM.moduleName(bearerToken ? "authenticated" : "unauthenticated"));
    }
}
