// serve static file
export interface ObjectStorage {
    putObject(path: string, content: string): Promise<void>;
}

export interface Cloud {
    objectStorage: ObjectStorage;
};