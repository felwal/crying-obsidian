import { MarkdownRenderChild } from "obsidian";

export class SourceLink extends MarkdownRenderChild {
  basename: string;
  text: string;
  partialWork: boolean;

  constructor(containerEl: HTMLElement, basename: string, text: string, partialWork: boolean) {
    super(containerEl);

    this.basename = basename;
    this.text = text;
    this.partialWork = partialWork;
  }

  onload() {
    if (this.partialWork) {
      this.containerEl.innerText = '"' + this.text + '"';
      return;
    }

    const cite = document.createElement("cite");
    const containerClone = this.containerEl.cloneNode();

    containerClone.innerText = this.text;
    cite.appendChild(containerClone);
    this.containerEl.replaceWith(cite);
  }
}
