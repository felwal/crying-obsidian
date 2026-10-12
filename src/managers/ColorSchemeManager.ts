import AbsManager from "./AbsManager";

export default class ColorSchemeManager extends AbsManager {
  COLOR_SCHEME_DARK = "obsidian";
  COLOR_SCHEME_LIGHT = "moonstone";
  COLOR_SCHEME_SYSTEM = "system";

  //

  load() {
    this.loadCommands();

    if (this.plugin.settings.refreshOnStartup) {
      this.refreshColorScheme();
    }
  }

  loadCommands() {
    this.plugin.addCommand({
      id: "refresh-color-scheme",
      name: "Refresh color scheme",
      callback: () => {
        this.refreshColorScheme();
      }
    });

    this.plugin.addCommand({
      id: "toggle-color-scheme",
      name: "Toggle color scheme",
      callback: () => {
        this.toggleColorScheme();
      }
    });

    this.plugin.addCommand({
      id: "adapt-to-system",
      name: "Use system color scheme",
      callback: () => {
        this.adaptToSystem();
      }
    });
  }

  adaptToSystem() {
    this.plugin.app.changeTheme(this.COLOR_SCHEME_SYSTEM);
  }

  refreshColorScheme() {
    const current = this.getColorScheme();
    const inverted = this.getInvertedColorScheme();

    this.plugin.app.changeTheme(inverted);
    this.plugin.app.changeTheme(current);
  }

  toggleColorScheme() {
    this.plugin.app.changeTheme(this.getInvertedColorScheme());
  }

  getInvertedColorScheme() {
    return this.getColorScheme() === this.COLOR_SCHEME_LIGHT
      ? this.COLOR_SCHEME_DARK
      : this.COLOR_SCHEME_LIGHT;
  }

  getColorScheme() {
    return this.plugin.app.vault.getConfig("theme");
  }
}
