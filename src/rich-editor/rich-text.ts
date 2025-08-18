import {css, html, LitElement} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import {fireEvent} from '../lib/utils/fire-custom-event';
import './rich-toolbar';
import './rich-viewer';
import DOMPurify from 'dompurify';

@customElement('rich-text')
export class RichText extends LitElement {
  static styles = css`
    :host {
      --rich-color: black;
      --rich-background: white;
      --rich-action-active-color: red;
      --icon-size: 24px;
      border: solid 1px var(--rich-border-color, #eeeeee);
      background-color: #ffffff;
      width: 100%;
    }
    main {
      height: 100%;
      width: 100%;
      display: grid;
      grid-template-rows: 1fr auto;
      grid-template-columns: 1fr;
      grid-template-areas:
        'viewer'
        'toolbar';
    }

    rich-toolbar {
      grid-area: toolbar;
      width: 100%;
      background-color: var(--rich-toolbar-background, #ffffff);
      color: var(--rich-color);
      border-bottom: 1px solid var(--rich-toolbar-border-color, #eeeeee);
    }

    rich-viewer {
      grid-area: viewer;
      flex: 1;
      width: 100%;
      min-height: 40px;
      overflow-y: auto;
      background-color: var(--rich-background);
      color: var(--rich-color);
    }
    main {
      grid-template-rows: auto 1fr;
      grid-template-areas:
        'toolbar'
        'viewer';
    }
    rich-toolbar {
      border-top: none;
      border-bottom: 1px solid var(--rich-color);
    }
  `;

  @property({type: Object, hasChanged: () => true}) selection: Selection | null = null;
  @property({type: Boolean}) readonly = false;
  @property({type: Object, hasChanged: () => true}) node: Element = document.createElement('div');
  @property({type: String}) value!: string | null | undefined;

  clean: any = {
    FORBID_TAGS: ['style', 'script'],
    FORBID_ATTR: [
      'class',
      'onauxclick',
      'onafterprint',
      'onbeforematch',
      'onbeforeprint',
      'onbeforeunload',
      'onbeforetoggle',
      'onblur',
      'oncancel',
      'oncanplay',
      'oncanplaythrough',
      'onchange',
      'onclick',
      'onclose',
      'oncontextlost',
      'oncontextmenu',
      'oncontextrestored',
      'oncopy',
      'oncuechange',
      'oncut',
      'ondblclick',
      'ondrag',
      'ondragend',
      'ondragenter',
      'ondragleave',
      'ondragover',
      'ondragstart',
      'ondrop',
      'ondurationchange',
      'onemptied',
      'onended',
      'onerror',
      'onfocus',
      'onformdata',
      'onhashchange',
      'oninput',
      'oninvalid',
      'onkeydown',
      'onkeypress',
      'onkeyup',
      'onlanguagechange',
      'onload',
      'onloadeddata',
      'onloadedmetadata',
      'onloadstart',
      'onmessage',
      'onmessageerror',
      'onmousedown',
      'onmouseenter',
      'onmouseleave',
      'onmousemove',
      'onmouseout',
      'onmouseover',
      'onmouseup',
      'onoffline',
      'ononline',
      'onpagehide',
      'onpageshow',
      'onpaste',
      'onpause',
      'onplay',
      'onplaying',
      'onpopstate',
      'onprogress',
      'onratechange',
      'onreset',
      'onresize',
      'onrejectionhandled',
      'onscroll',
      'onscrollend',
      'onsecuritypolicyviolation',
      'onseeked',
      'onseeking',
      'onselect',
      'onslotchange',
      'onstalled',
      'onstorage',
      'onsubmit',
      'onsuspend',
      'ontimeupdate',
      'ontoggle',
      'onunhandledrejection',
      'onunload',
      'onvolumechange',
      'onwaiting',
      'onwheel'
    ]
  };

  render() {
    const {selection, readonly, node} = this;
    return html`<main>
      <rich-toolbar
        part="rich-toolbar"
        ?hidden="${this.readonly}"
        .selection="${selection}"
        .node="${node}"
        @set-content=${(e: Event) => {
          const event = e as CustomEvent<string>;
          const parser = new DOMParser();
          const doc = parser.parseFromString(event.detail, 'text/html');
          const root = doc.querySelector('body');
          this.node.innerHTML = root?.innerHTML ?? '';
          this.requestUpdate();
        }}
      ></rich-toolbar>
      <rich-viewer
        part="rich-viewer"
        ?readonly="${readonly}"
        .value="${this.value}"
        @selection=${(e: Event) => {
          const event = e as CustomEvent;
          this.selection = event.detail.selection;
          let sanitizedHTML = event.detail.html || '';
          // remove all mso- from styling
          sanitizedHTML = sanitizedHTML.replace(/mso-[^:]+:[^;"]+;?/gi, '');
          // remove all comments
          sanitizedHTML = sanitizedHTML.replace(/<!--[\s\S]*?-->/g, '');
          sanitizedHTML = DOMPurify.sanitize(sanitizedHTML, this.clean);
          fireEvent(this, 'editor-changed', {value: sanitizedHTML});
        }}
        .node="${node}"
      >
      </rich-viewer>
    </main>`;
  }

  firstUpdated() {
    const children = this.children;
    if (children?.length > 0) {
      // Check if <template> is the first child
      const template = children[0];
      if (template.tagName === 'TEMPLATE') {
        const content = template.innerHTML.trim();
        if (content.length > 0) {
          this.node.innerHTML = content;
          this.requestUpdate();
        }
      }
    }
  }
}
