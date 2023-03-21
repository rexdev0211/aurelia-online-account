import {inject, LogManager} from "aurelia-framework";
import {default as iziToast} from "izitoast";
import environment from "../../environment";

export class NotificationService {
  public logger: any;
  public defaultOptions: any;

  constructor() {
    this.logger = LogManager.getLogger("notification-service");

    this.defaultOptions = {
      closeButton: false,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: "toast-top-right",
      preventDuplicates: false,
      onclick: null,
      showDuration: "0",
      hideDuration: "0",
      timeOut: "5000",
      extendedTimeOut: "0",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut"
    };
  }

  async showMessage(
    type: string,
    title: string,
    message: string,
    options?: any
  ) {

    if (!options) options = {};

    switch (type) {
      case "error":
        options.timeout = false;
        options.position = "topRight";
        break;
      case "warning":
        options.position = "topLeft";
        break;
      case "info":
        options.position = "bottomLeft";
        break;
      case "success":
        options.position = "bottomRight";
        this.closeAll();
        break;
    }
    let defaultTitle = `${type.charAt(0).toUpperCase()}${type.substr(1)}`;
    let izitoastOptions = Object.assign(
      {
        title: title || defaultTitle,
        message: message || "",
        layout: 2
      },
      options
    );
    if (environment().debug) this.logger.debug("toast =>", izitoastOptions);
    iziToast[type](izitoastOptions);
  }

  async showDebugMessage(title, message, options) {
    if (environment().debug) {
      let izitoastOptions = Object.assign(
        {
          title: title || "Debug",
          message: message || "",
          position: "bottomLeft",
          layout: 2
        },
        options
      );
      this.logger.debug("toast =>", izitoastOptions);
      //izitoast.info(izitoastOptions);
    }
  }

  closeAll() {
    document.querySelectorAll('.iziToast').forEach((x: HTMLDivElement) => {
      iziToast.hide({}, x);
    })
  }
}
