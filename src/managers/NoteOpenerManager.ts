import { Notice, TFile } from "obsidian";
import CryingPlugin from "../main";
import AbsManager from "./AbsManager";

export default class NoteOpenerManager extends AbsManager {
  ribbonIcons: Array<HTMLElement> = new Array();

  //

  load() {
    this.loadRibbon();
  }

  loadRibbon() {
    this.plugin.app.workspace.onLayoutReady(async () => {
      // remove previous icons before reloading
      for (var i = 0; i < this.ribbonIcons.length; i++) {
        this.ribbonIcons[i].remove();
      }

      for (var i = 0; i < this.plugin.settings.openerNotes.length; i++) {
        this.addOpenerNoteRibbonIcon(this.plugin.settings.openerNotes[i]);
      }
    });
  }

  addOpenerNoteRibbonIcon(openerNote: OpenerNote) {
    const file = this.getFile(openerNote.path);
    const displayName = file != null ? file?.basename : openerNote.path;
    const tooltip = "Open '" + displayName + "'";

    const ic = this.plugin.addRibbonIcon(openerNote.icon, tooltip, () => {
      if (file) {
        this.openNote(file);
      }
      else {
        new Notice("Could not find note '" + openerNote.path + "'");
      }
    });

    this.ribbonIcons.push(ic);
  }

  openNote(file: TFile) {
    this.plugin.app.workspace.getLeaf().openFile(file, {active: true});
  }

  getFile(path: string): TFile | null {
    return this.plugin.app.vault.getAbstractFileByPath(path + ".md") as TFile;
  }
}

export class OpenerNote {
  path: string;
  icon: string;

  constructor(path: string, icon: string) {
    this.path = path;
    this.icon = icon;
  }
}
