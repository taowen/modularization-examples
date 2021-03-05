// serve static file
export interface ObjectStorage {
    putObject(path: string, content: string): Promise<void>;
}

export interface Serverless {
    createSharedLayer(layerCode: string): Promise<void>;
    // function always use same sharedLayer with same handler file
    createFunction(functionName: string): Promise<void>;
}

export interface ApiGateway {
    createRoute(options: {
        path: string;
        httpMethod: string;
        // reference Serverless function
        functionName: string;
    }): Promise<void>;
}

export interface Cloud {
    objectStorage: ObjectStorage;
    serverless: Serverless;
    apiGateway: ApiGateway;
}
