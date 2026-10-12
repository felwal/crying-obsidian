import { Plugin, TFile, getLinkpath } from "obsidian";
import { CryingPluginSettings, DEFAULT_SETTINGS, CryingSettingTab } from "./settings"
import { SourceLink } from "./sourceLink";

export default class CryingPlugin extends Plugin {
  settings: CryingPluginSettings;

  COLOR_SCHEME_DARK = "obsidian";
  COLOR_SCHEME_LIGHT = "moonstone";
  COLOR_SCHEME_SYSTEM = "system";

  async onload() {
    await this.loadSettings();
    this.loadCommands();
    this.registerPostProcessing();

    if (this.settings.refreshOnStartup) {
      this.refreshColorScheme();
    }

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

  loadCommands() {
    this.addCommand({
      id: "refresh-color-scheme",
      name: "Refresh color scheme",
      callback: () => {
        this.refreshColorScheme();
      }
    });

    this.addCommand({
      id: "toggle-color-scheme",
      name: "Toggle color scheme",
      callback: () => {
        this.toggleColorScheme();
      }
    });

    this.addCommand({
      id: "adapt-to-system",
      name: "Use system color scheme",
      callback: () => {
        this.adaptToSystem();
      }
    });
  }

  // render sources

  registerPostProcessing() {
    this.registerMarkdownPostProcessor((element, context) => {
      const linkEls = element.querySelectorAll("a.internal-link");

      for (let i = 0; i < linkEls.length; i++) {
        const linkEl = linkEls.item(i);

        console.log(linkEl.parentNode.parentNode)

        const linkBasename = getLinkpath(linkEl.childNodes[0].parentNode.dataset.href);
        const linkText = linkEl.innerText.trim();

        // TODO: get class of linked file

        const isSourceLink = true;
        const isPartialWork = false;

        if (isSourceLink) {
          context.addChild(new SourceLink(linkEl, linkBasename, linkText, isPartialWork));
        }
      }
    });
  }

  // color scheme

  adaptToSystem() {
    this.app.changeTheme(this.COLOR_SCHEME_SYSTEM);
  }

  refreshColorScheme() {
    const current = this.getColorScheme();
    const inverted = this.getInvertedColorScheme();

    this.app.changeTheme(inverted);
    this.app.changeTheme(current);
  }

  toggleColorScheme() {
    this.app.changeTheme(this.getInvertedColorScheme());
  }

  getInvertedColorScheme() {
    return this.getColorScheme() === this.COLOR_SCHEME_LIGHT
      ? this.COLOR_SCHEME_DARK
      : this.COLOR_SCHEME_LIGHT;
  }

  getColorScheme() {
    return this.app.vault.getConfig("theme");
  }
}
