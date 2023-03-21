"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRAApi = void 0;
var CRAApi;
(function (CRAApi) {
    // Servicestack
    class ResponseStatus {
        constructor(init) {
            Object.assign(this, init);
        }
    }
    CRAApi.ResponseStatus = ResponseStatus;
    class ResponseError {
        constructor(init) {
            Object.assign(this, init);
        }
    }
    CRAApi.ResponseError = ResponseError;
    // Interfaces
    let RiskAnswerType;
    (function (RiskAnswerType) {
        RiskAnswerType["Answer"] = "Answer";
        RiskAnswerType["Country"] = "Country";
        RiskAnswerType["Date"] = "Date";
        RiskAnswerType["Industry"] = "Industry";
    })(RiskAnswerType = CRAApi.RiskAnswerType || (CRAApi.RiskAnswerType = {}));
    let RiskAnswerProbability;
    (function (RiskAnswerProbability) {
        RiskAnswerProbability["NotSet"] = "NotSet";
        RiskAnswerProbability["VeryLow"] = "VeryLow";
        RiskAnswerProbability["Low"] = "Low";
        RiskAnswerProbability["Medium"] = "Medium";
        RiskAnswerProbability["High"] = "High";
        RiskAnswerProbability["VeryHigh"] = "VeryHigh";
    })(RiskAnswerProbability = CRAApi.RiskAnswerProbability || (CRAApi.RiskAnswerProbability = {}));
    // Models
    class RiskAnswer {
        constructor(init) {
            Object.assign(this, init);
        }
    }
    CRAApi.RiskAnswer = RiskAnswer;
    class RiskFactor {
        constructor(init) {
            Object.assign(this, init);
        }
    }
    CRAApi.RiskFactor = RiskFactor;
    class RiskComponent {
        constructor(init) {
            Object.assign(this, init);
        }
    }
    CRAApi.RiskComponent = RiskComponent;
    class RiskCategory {
        constructor(init) {
            Object.assign(this, init);
        }
    }
    CRAApi.RiskCategory = RiskCategory;
    class RiskModel {
        constructor(init) {
            Object.assign(this, init);
        }
    }
    CRAApi.RiskModel = RiskModel;
    class CRAModel extends RiskModel {
        constructor(init) {
            super(init);
            Object.assign(this, init);
        }
    }
    CRAApi.CRAModel = CRAModel;
    class CRAProfileRecord {
        constructor(init) {
            Object.assign(this, init);
        }
    }
    CRAApi.CRAProfileRecord = CRAProfileRecord;
    // DTOS
    class CRAProfileResponse {
        constructor(init) {
            Object.assign(this, init);
        }
    }
    CRAApi.CRAProfileResponse = CRAProfileResponse;
    // @Route("/cra", "POST,PUT,DELETE")
    // @Route("/cra/profile/{ERN}", "GET")
    class CRAProfileRequest extends CRAProfileRecord {
        constructor(init) {
            super(init);
            Object.assign(this, init);
        }
        getTypeName() {
            return 'CRAProfileRequest';
        }
        getMethod() {
            return 'GET';
        }
        createResponse() {
            return new CRAProfileResponse();
        }
    }
    CRAApi.CRAProfileRequest = CRAProfileRequest;
})(CRAApi = exports.CRAApi || (exports.CRAApi = {}));
//# sourceMappingURL=cra-api.dtos.js.map