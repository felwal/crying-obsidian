import { App, PluginSettingTab, Setting } from "obsidian";
import CryingPlugin from "./main";

export interface CryingPluginSettings {
  // color scheme
  refreshOnStartup: boolean;

  // render sources
  italicClass: string;
  quotationMarkClass: string;

  // checkbox cycler
  states: Array<string>;
  previewModeEnabled: boolean;
}

export const DEFAULT_SETTINGS: CryingPluginSettings = {
  refreshOnStartup: false,
  italicClass: "source-work",
  quotationMarkClass: "source-work-partial",
  states: [" ", "/", "x", "-"],
  previewModeEnabled: true,
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

    this.displayColorSchemeSettings(containerEl);
    this.displayCheckboxCyclerSettings(containerEl);

  }

  displayColorSchemeSettings(containerEl: HTMLElement) {
    containerEl.createEl("h2", {text: "Color Scheme Toggler"});

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

  displayCheckboxCyclerSettings(containerEl: HTMLElement) {
    containerEl.createEl("h2", {text: "Checkbox Cycler"});

    // live preview click
    new Setting(containerEl)
      .setName("Enable interaction with live preview mode")
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.previewModeEnabled)
        .onChange(async value => {
          this.plugin.settings.previewModeEnabled = value;

          await this.plugin.saveSettings();
        })
      )

    containerEl.createEl("h3", {text: "States"});

    // states
    for (let i = 0; i < this.plugin.settings.states.length; i++) {
      let state = this.plugin.settings.states[i];

      new Setting(containerEl)
      .setName("- [" + state + "]")
      .addText(text => text
        .setPlaceholder("Any character")
        .setValue(state)
        .onChange(async (value) => {
          this.plugin.settings.states[i] = value ? value[0] : " ";

          await this.plugin.saveSettings();
        })
      )
      .addButton(button => {
        button.setIcon("up-chevron-glyph")
          .setTooltip("Move up")
          .onClick(async (callback) => {
            let temp = this.plugin.settings.states[i];
            this.plugin.settings.states[i] = this.plugin.settings.states[i - 1];
            this.plugin.settings.states[i - 1] = temp;

            await this.plugin.saveSettings();
            this.display();
          })

        if (i === 0) {
          button.setDisabled(true);
        }
      })
      .addButton(button => {
        button.setIcon("down-chevron-glyph")
          .setTooltip("Move down")
          .onClick(async (callback) => {
            let temp = this.plugin.settings.states[i];
            this.plugin.settings.states[i] = this.plugin.settings.states[i + 1];
            this.plugin.settings.states[i + 1] = temp;

            await this.plugin.saveSettings();
            this.display();
          })

        if (i === this.plugin.settings.states.length - 1) {
          button.setDisabled(true);
        }
      })
      .addButton(button => button
        .setIcon("trash")
        .setTooltip("Delete")
        .setWarning()
        .onClick(async (callback) => {
          this.plugin.settings.states.splice(i, 1);

          await this.plugin.saveSettings();
          this.display();
        })
      );

    }

    // add state
    new Setting(containerEl)
      .addButton(button => button
        .setButtonText("Add state")
        .onClick(async (callback) => {
          this.plugin.settings.states.push("");

          await this.plugin.saveSettings();
          this.display();
        })
      )
  }
}
