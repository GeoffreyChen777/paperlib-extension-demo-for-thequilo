import { PLAPI, PLExtAPI, PLExtension } from "paperlib-api/api";
import { PaperEntity } from "paperlib-api/model";

class PaperlibExtension extends PLExtension {
  disposeCallbacks: (() => void)[];

  constructor() {
    super({
      id: "paperlib-citationkey-modify-extension",
      defaultPreference: {},
    });

    this.disposeCallbacks = [];
  }

  async initialize() {
    await PLExtAPI.extensionPreferenceService.register(
      this.id,
      this.defaultPreference,
    );

    // NOTE: If you want to modify the citation key of bibitem or bibtex, you need to hook the `citeObjCreatedInExportBibTexKey`.
    this.disposeCallbacks.push(
      PLAPI.hookService.hookModify(
        "citeObjCreatedInExportBibTexKey",
        this.id, 
        "modifyInExportBibItem",
      )
    );
  }

  async dispose() {
    this.disposeCallbacks.forEach((dispose) => dispose());

    PLExtAPI.extensionPreferenceService.unregister(this.id);
  }

  async modifyInExportBibItem(cite, paperEntities: PaperEntity[]) {
    // You will see the log in the console of the Paperpile app.
    // To open it, for macOS, click menu-Window-Developer Tools.
    // For Windows, press F12.
    PLAPI.logService.log("info", `In modifyInExportBibItem:`);
    PLAPI.logService.log("info", `cite: ${JSON.stringify(cite)}`);
    PLAPI.logService.log("info", `paperEntities: ${JSON.stringify(paperEntities)}`);

    // Here we can modify the cite object.
    cite.data[0]['citation-key'] = `some-prefix-${cite.data[0]['citation-key']}`;

    // Now you can see that the citation key is modified.
    PLAPI.logService.log("info", `cite: ${JSON.stringify(cite)}`);

    // ModifyHook requires to return the modified cite object and paperEntities.
    // You can not leave it as undefined, otherwise, it will cause an error:
    // Failed to recover class of object with undefined
    return [cite, paperEntities];
    // Now I believe you should get a bibitem with a modified citation key.
  }
}

async function initialize() {
  const extension = new PaperlibExtension();
  await extension.initialize();

  return extension;
}

export { initialize };
