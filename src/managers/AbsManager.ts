import CryingPlugin from "../main";

export default abstract class AbsManager {
  plugin: CryingPlugin;

  //

  constructor(plugin: CryingPlugin) {
    this.plugin = plugin;
  }

  abstract load(): void;

  unload() {}
}
