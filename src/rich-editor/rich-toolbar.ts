import {css, html, LitElement} from 'lit';
import {property, customElement, query, state} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';
import './rich-action';
import {editorCommand} from './rich-action';
import {getTranslation} from '../lib/utils/translate';

@customElement('rich-toolbar')
export class RichToolbar extends LitElement {
  static styles = css`
    header {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: flex-start;
      padding-inline-start: 12px;
      flex-wrap: wrap;
    }
    input[type='color'] {
      -webkit-appearance: none;
      border: none;
      width: 0;
      height: 0;
    }
    input[type='color']::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    input[type='color']::-webkit-color-swatch {
      border: none;
    }
    rich-action {
      margin: 2px 4px 2px 2px;
    }
    rich-action[active] {
      background-color: #e8e8e8;
    }
    .arrow-icon {
      margin-left: -6px;
    }
  `;

  @query('#fg-color') fgColorInput!: HTMLInputElement;
  @query('#bd-color') bdColorInput!: HTMLInputElement;
  @state() fileHandle?: any;
  @property({type: Object, hasChanged: () => true}) node!: Element;
  @property({type: String}) formatColor = '#000000';
  @property({type: String}) backgroundColor = '#000000';
  @property({type: String}) selectedFormatBlock?: string;
  @property({type: String}) selectedFontSize?: string;
  @property({type: Object, hasChanged: () => true}) selection: Selection | null = null;
  @property() language!: string;
  formatBlocks = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre'];
  fontSizes = ['1', '2', '3', '4', '5', '6', '7'];

  render() {
    const tags = this.getTags();
    return html`<header>
      <rich-action icon="editor:format-bold" command="bold" ?active=${tags.includes('b')}></rich-action>
      <rich-action icon="editor:format-italic" command="italic" ?active=${tags.includes('i')}></rich-action>
      <rich-action icon="editor:format-underlined" command="underline" ?active=${tags.includes('u')}></rich-action>
      <rich-action
        icon="editor:format-align-left"
        command="justifyleft"
        ?active=${tags.includes('text-align-left')}
      ></rich-action>
      <rich-action
        icon="editor:format-align-center"
        command="justifycenter"
        ?active=${tags.includes('text-align-center')}
      ></rich-action>
      <rich-action
        icon="editor:format-align-right"
        command="justifyright"
        ?active=${tags.includes('text-align-right')}
      ></rich-action>
      <rich-action
        icon="editor:format-list-numbered"
        command="insertorderedlist"
        ?active=${tags.includes('ol')}
      ></rich-action>
      <rich-action
        icon="editor:format-list-bulleted"
        command="insertunorderedlist"
        ?active=${tags.includes('ul')}
      ></rich-action>
      <rich-action
        icon="format_quote"
        command="formatblock"
        value="blockquote"
        ?active=${tags.includes('blockquote')}
      ></rich-action>
      <!-- <rich-action icon="format_indent_decrease" command="outdent"></rich-action>
      <rich-action icon="format_indent_increase" command="indent"></rich-action> -->
      <rich-action
        icon="editor:add-link"
        ?active=${tags.includes('a')}
        @action=${() => {
          const newLink = prompt('Write the URL here', 'https://');
          // Check if valid url
          if (newLink && newLink.match(/^(http|https):\/\/[^ "]+$/)) {
            editorCommand('createlink', newLink);
          }
        }}
      >
      </rich-action>
      <rich-action icon="editor:unlink" command="unlink"></rich-action>
      <rich-action
        icon="editor:format-color-text"
        .color="${this.formatColor}"
        @action=${() => editorCommand('forecolor', this.formatColor)}
      >
        <etools-icon-button
          class="arrow-icon"
          name="arrow-drop-down"
          @click="${() => this.fgColorInput.click()}"
        ></etools-icon-button>
        <input
          type="color"
          id="fg-color"
          @input=${(e: Event) => {
            const input = e.target as HTMLInputElement;
            this.formatColor = input.value;
            editorCommand('forecolor', input.value);
          }}
        />
      </rich-action>
      <rich-action
        icon="editor:background-color"
        .color="${this.backgroundColor}"
        @action=${() => editorCommand('backcolor', this.backgroundColor)}
      >
        <etools-icon-button
          class="arrow-icon"
          name="arrow-drop-down"
          @click="${() => this.bdColorInput.click()}"
        ></etools-icon-button>
        <input
          type="color"
          id="bd-color"
          @input=${(e: Event) => {
            const input = e.target as HTMLInputElement;
            this.backgroundColor = input.value;
            editorCommand('backcolor', input.value);
          }}
        />
      </rich-action>
      <rich-action
        icon="title"
        command="formatblock"
        .selectedValue="${this.selectedFormatBlock}"
        .values=${[
          {name: getTranslation(this.language, 'NORMAL_TEXT'), value: '--'},
          {name: getTranslation(this.language, 'HEADING1'), value: 'h1'},
          {name: getTranslation(this.language, 'HEADING2'), value: 'h2'},
          {name: getTranslation(this.language, 'HEADING3'), value: 'h3'},
          {name: getTranslation(this.language, 'HEADING4'), value: 'h4'},
          {name: getTranslation(this.language, 'HEADING5'), value: 'h5'},
          {name: getTranslation(this.language, 'HEADING6'), value: 'h6'},
          {name: getTranslation(this.language, 'PARAGRAPH'), value: 'p'},
          {name: getTranslation(this.language, 'PRE_FORMATTED'), value: 'pre'}
        ]}
      ></rich-action>
      <rich-action
        icon="editor:format-size"
        command="fontsize"
        .selectedValue="${this.selectedFontSize}"
        .values=${[
          {name: getTranslation(this.language, 'FONT_SIZE'), value: '--'},
          {name: getTranslation(this.language, 'VERY_SMALL'), value: '1'},
          {name: getTranslation(this.language, 'SMALL'), value: '2'},
          {name: getTranslation(this.language, 'NORMAL'), value: '3'},
          {name: getTranslation(this.language, 'MEDIUM_LARGE'), value: '4'},
          {name: getTranslation(this.language, 'LARGE'), value: '5'},
          {name: getTranslation(this.language, 'VERY_LARGE'), value: '6'},
          {name: getTranslation(this.language, 'MAXIMUM'), value: '7'}
        ]}
      ></rich-action>
      <rich-action icon="undo" command="undo"></rich-action>
      <rich-action icon="redo" command="redo"></rich-action>
      <rich-action icon="editor:format-clear" command="removeFormat"></rich-action>
      <!-- <rich-action icon="content_cut" command="cut"></rich-action> -->
      <!-- <rich-action icon="content_copy" command="copy"></rich-action>
      <rich-action icon="content_paste" command="paste"></rich-action> -->
    </header>`;
  }

  constructor() {
    super();

    if (!this.language) {
      this.language = (window as any).EtoolsLanguage || 'en';
    }
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('language-changed', this.handleLanguageChange.bind(this) as any);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('language-changed', this.handleLanguageChange.bind(this) as any);
  }

  handleLanguageChange(e: CustomEvent): void {
    this.language = e.detail.language;
  }

  getTags() {
    let tags: string[] = [];
    if (this.selection) {
      this.selectedFontSize = this.selectedFormatBlock = '';
      if (this.selection.type === 'Range' || this.selection.type === 'Caret') {
        // @ts-ignore
        let parentNode = this.selection.baseNode;
        if (parentNode) {
          const checkNode = () => {
            const tag = parentNode?.tagName?.toLowerCase()?.trim();
            if (tag) {
              tags.push(tag);
              const textAlign = parentNode.style?.textAlign;
              if (textAlign) {
                tags.push(`text-align-${textAlign}`);
              }
              const backgroundColor = parentNode.style?.backgroundColor;
              if (backgroundColor) {
                tags.push(`background-color`);
                this.backgroundColor = backgroundColor;
              }
              const fontColor = parentNode.style?.fontColor || parentNode.attributes.getNamedItem('color')?.value;
              if (fontColor) {
                tags.push(`font-color`);
                this.formatColor = fontColor;
              }
              const fontSize = parentNode.style?.fontSize || parentNode.attributes.getNamedItem('size')?.value;
              if (fontSize && this.fontSizes.includes(fontSize)) {
                this.selectedFontSize = fontSize;
              }
              if (this.formatBlocks.includes(tag)) {
                this.selectedFormatBlock = tag;
              }
            }
          };
          while (parentNode != null) {
            checkNode();
            parentNode = parentNode?.parentNode;
          }
        }
        // Remove root tag
        tags.pop();
      } else {
        const content = this.selection?.toString() || '';
        tags = (content.match(/<[^>]+>/g) || [])
          .filter((tag) => !tag.startsWith('</'))
          .map((tag) => tag.replace(/<|>/g, ''));
      }
    }
    if (!tags.includes('background-color')) {
      this.backgroundColor = '#000000';
    }
    if (!tags.includes('font-color')) {
      this.formatColor = '#000000';
    }
    return tags;
  }
}
