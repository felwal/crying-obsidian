import { Plugin } from "obsidian";
import { CryingPluginSettings, DEFAULT_SETTINGS, CryingSettingTab } from "./settings"
import RenderSourcesManager from "./managers/RenderSourcesManager";
import NoteOpenerManager from "./managers/NoteOpenerManager";
import ColorSchemeManager from "./managers/ColorSchemeManager";
import ChecboxCyclerManager from "./managers/CheckboxCyclerManager";

export default class CryingPlugin extends Plugin {
  settings: CryingPluginSettings;

  noteOpenerManager = new NoteOpenerManager(this);
  colorSchemeManager = new ColorSchemeManager(this);
  checkboxCyclerManager = new ChecboxCyclerManager(this);
  renderSourcesManager = new RenderSourcesManager(this);

  async onload() {
    await this.loadSettings();

    this.noteOpenerManager.load();
    this.colorSchemeManager.load();
    this.checkboxCyclerManager.load();
    this.renderSourcesManager.load();

    this.addSettingTab(new CryingSettingTab(this.app, this));
  }

  onunload() {
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
