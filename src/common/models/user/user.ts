export class User {
    id: string;
    emailAddress: string;

    firstName: string;
    lastName: string;
    birthDate: string;

    phoneCountryCode: string;
    phoneNumber: string;

    securityQuestion: string;
    securityAnswer: string;
    password: string;
    passwordRep: string;

    // Not needed?
    country: string;
    street: string;
    city: string;
    postalCode: string;

    // Only used for registration
    accountCode: string;
    accessCode: string;
    emailVerificationCode: string;
    emailVerifiyAttempted: boolean;
    emailVerified: boolean;
    passwordUpdated: boolean;
    phoneVerificationCode: string;
    agreeTermsConditions: boolean;
    agreePricingFees: boolean;
    confirmationCode:string;
}