import { App, PluginSettingTab, Setting } from "obsidian";
import CryingPlugin from "./main";

export interface CryingPluginSettings {
  refreshOnStartup: boolean;
}

export const DEFAULT_SETTINGS: CryingPluginSettings = {
  refreshOnStartup: false
}

export class CryingSettingTab extends PluginSettingTab {
  plugin: CryingPlugin;

  constructor(app: App, plugin: CryingPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const {containerEl} = this;

    containerEl.empty();
    containerEl.createEl("h1", {text: "Color Scheme Toggler"});

    new Setting(containerEl)
      .setName("Refresh color scheme on startup")
      .setDesc("Fixes Android status bar color")
      .addToggle(toggle => { toggle
        .setValue(this.plugin.settings.refreshOnStartup)
        .onChange(async (value) => {
          this.plugin.settings.refreshOnStartup = value;
          await this.plugin.saveSettings();
        });
      });
  }
}
