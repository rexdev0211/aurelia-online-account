import { Fee } from './fee';
import { Other } from './amount';

export class Fees {
    fx: Fee;
    fee: Fee;
    domestic: Fee;
    nonDomestic: Fee;
    other: Other;

    constructor(fx: Fee, fee: Fee, domestic: Fee, nonDomestic: Fee, other: Other) {
        this.fx = fx;
        this.fee = fee;
        this.domestic = domestic;
        this.nonDomestic = nonDomestic;
        this.other = other;
    }
}
