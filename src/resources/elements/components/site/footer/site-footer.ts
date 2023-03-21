import {BaseElement} from "../../../../../bases/base-element";
import environment from "environment";

export class SiteFooterCustomElement extends BaseElement {
    currentBuild: string;
    copyrightYear: number;
    private isEquaze: boolean;
    private isGluu: boolean;

    constructor(...args) {
        super(...args);
        this.currentBuild = `${environment().buildNumber}`;
        this.copyrightYear = new Date().getFullYear();
        this.isEquaze = location.hostname === 'account.equaze.com';
        this.isGluu = location.hostname === 'account.gluu.co.uk';
    }
}
