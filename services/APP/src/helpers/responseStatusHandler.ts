class StatusResponse {
    constructor() {}

    public get ok(): string {
        return 'OK';
    }

    public get notOk(): string {
        return 'NOT OK';
    }
}

export const status = new StatusResponse();