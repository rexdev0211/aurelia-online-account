interface IEnvironment {
    debug: boolean,
    testing: boolean,
    instrumentationKey: string,
    webRoot: string,
    apiRoot: string,
    wssRoot: string,
    autoLogoffMinutes: number,
    appName: string,
    buildNumber: string,
    region: string,
    features: Record<string, boolean>[],
}
