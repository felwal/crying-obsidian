import { MarkdownView, setIcon } from "obsidian";
import AbsManager from "./AbsManager";

export default class NavbarManager extends AbsManager {
  load() {
    this.loadNavbar();
  }

  unload() {
    this.unloadNavbar();
  }

  loadNavbar() {
    const navbar = document.querySelector(".mobile-navbar-actions");
    if (!navbar) return;

    // clean up previously added
    this.unloadNavbar();

    const action = navbar.createDiv({cls: "mobile-navbar-action mobile-navbar-action-mode"});
    const clickable = action.createSpan({cls: "clickable-icon"});
    this.updateIcon(clickable, this.isSourceMode())

    clickable.onClickEvent(ev => {
      var wasSourceMode = this.isSourceMode();
      this.plugin.app.commands.executeCommandById('markdown:toggle-preview');
      this.updateIcon(clickable, !wasSourceMode)
    });
  }

  unloadNavbar() {
    const navbar = document.querySelector(".mobile-navbar-actions");
    const actionPrev = document.querySelector(".mobile-navbar-action-mode");
    if (actionPrev) navbar?.removeChild(actionPrev);
  }

  updateIcon(el: HTMLSpanElement, sourceMode: boolean) {
    setIcon(el, sourceMode ? "lucide-book-open" : "lucide-edit-3");
  }

  isSourceMode() {
    return this.plugin.app.workspace.getActiveViewOfType(MarkdownView)?.getMode() === "source";
  }
}
