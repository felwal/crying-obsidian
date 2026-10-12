import { getLinkpath, MarkdownRenderChild } from "obsidian";
import AbsManager from "./AbsManager";

export default class RenderSourcesManager extends AbsManager {
  load() {
    this.registerPostProcessing();
  }

  registerPostProcessing() {
    this.plugin.registerMarkdownPostProcessor((element, context) => {
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
}

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
