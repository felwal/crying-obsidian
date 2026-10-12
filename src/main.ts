import { Plugin } from "obsidian";
import { CryingPluginSettings, DEFAULT_SETTINGS, CryingSettingTab } from "./settings"
import NoteOpenerManager from "./managers/NoteOpenerManager";
import ColorSchemeManager from "./managers/ColorSchemeManager";
import CheckboxCyclerManager from "./managers/CheckboxCyclerManager";
import AbsManager from "./managers/AbsManager";
import NavbarManager from "./managers/NavbarManager";

export default class CryingPlugin extends Plugin {
  settings: CryingPluginSettings;

  managers: AbsManager[] = [
    new NoteOpenerManager(this),
    new NavbarManager(this),
    new ColorSchemeManager(this),
    new CheckboxCyclerManager(this),
  ];

  async onload() {
    await this.loadSettings();
    this.managers.forEach(manager => manager.load());
    this.addSettingTab(new CryingSettingTab(this.app, this));
  }

  onunload() {
    this.managers.forEach(manager => manager.unload());
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
