declare module "paperlib" {
  export namespace PLAPI {
    export var appService: {
      version(): Promise<string>;
    };

    export var logService: {
      log(
        level: "info" | "warn" | "error",
        msg: string,
        additional: string,
        notify: boolean = false,
        id?: string
      ): void;

      info(
        msg: string,
        additional: string,
        notify: boolean = false,
        id?: string
      ): void;

      warn(
        msg: string,
        additional: string,
        notify: boolean = false,
        id?: string
      ): void;

      error(
        msg: string,
        additional: string | Error,
        notify: boolean = false,
        id?: string
      ): void;

      progress(
        msg: string,
        value: number,
        notify: boolean = false,
        id?: string
      ): void;
    };

    export var commandService: {
      registerExternel: (command: {
        id: string;
        description: string;
        event?: string;
      }) => void;

      on(
        key: keyof T | (keyof T)[],
        callback: (newValues: { key: keyof T; value: any }) => void
      );
    };

    export var hookService: {
      hook: (
        hookName: string,
        extensionID: string,
        callbackName: string
      ) => () => void;
    };

    export var networkTool: {
      get: (
        url: string,
        headers?: Record<string, string>,
        retry?: number,
        safe?: boolean,
        timeout?: number,
        cache?: boolean
      ) => Promise<any>;

      post: (
        url: string,
        data: Record<string, any> | string,
        headers?: Record<string, string>,
        retry?: number,
        timeout?: number,
        compress?: boolean
      ) => Promise<any>;

      downloadPDFs: (
        urlList: string[],
        cookies?: CookieJar
      ) => Promise<string[]>;

      postForm: (
        url: string,
        data: FormData,
        headers?: Record<string, string>,
        retry = 1,
        timeout = 5000
      ) => Promise<any>;
    };
  }

  export namespace PLExtAPI {
    export var extensionPreferenceService: {
      register<T>(extensionID: string, defaultValues: T): Promise<void>;
      unregister(extensionID: string): void;

      get(extensionID: string, key: any): any;

      set(extensionID: string, patch: any): void;

      getPassword(extensionID: string, key: string): Promise<string>;

      setPassword(extensionID: string, key: string, pwd: string): Promise<void>;

      onChanged(
        extensionID: string,
        key: keyof T | (keyof T)[],
        callback: (newValues: { key: keyof T; value: any }) => void
      ): () => void;

      on(
        extensionID: string,
        key: keyof T | (keyof T)[],
        callback: (newValues: { key: keyof T; value: any }) => void
      ): () => void;
    };
  }
}
