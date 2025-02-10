import {css, html, LitElement} from 'lit';
import {property, customElement, query, state} from 'lit/decorators.js';
import './rich-action';
import {editorCommand} from './rich-action';

@customElement('rich-toolbar')
export class RichToolbar extends LitElement {
  static styles = css`
    header {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
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
  `;

  @query('#fg-color') fgColorInput!: HTMLInputElement;
  @query('#bd-color') bdColorInput!: HTMLInputElement;
  @state() fileHandle?: any;
  @property({type: Object, hasChanged: () => true}) node!: Element;
  @property({type: String}) formatColor = '#000000';
  @property({type: String}) backgroundColor = '#000000';
  @property({type: Object, hasChanged: () => true}) selection: Selection | null = null;

  render() {
    const tags = this.getTags();
    return html`<header>
      <rich-action icon="editor:format-clear" command="removeFormat"></rich-action>
      <rich-action icon="editor:format-bold" command="bold" ?active=${tags.includes('b')}></rich-action>
      <rich-action icon="editor:format-italic" command="italic" ?active=${tags.includes('i')}></rich-action>
      <rich-action icon="editor:format-underlined" command="underline" ?active=${tags.includes('u')}></rich-action>
      <rich-action icon="editor:format-align-left" command="justifyleft"></rich-action>
      <rich-action icon="editor:format-align-center" command="justifycenter"></rich-action>
      <rich-action icon="editor:format-align-right" command="justifyright"></rich-action>
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
      <rich-action icon="format_quote" command="formatblock" value="blockquote"></rich-action>
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
      <rich-action icon="editor:unlink" ?active=${tags.includes('a')} command="unlink"></rich-action>
      <rich-action
        icon="editor:format-color-text"
        .color="${this.formatColor}"
        @action=${() => this.fgColorInput.click()}
      >
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
        icon="editor:border-color"
        .color="${this.backgroundColor}"
        @action=${() => this.bdColorInput.click()}
      >
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
        .values=${[
          {name: 'Normal Text', value: '--'},
          {name: 'Heading 1', value: 'h1'},
          {name: 'Heading 2', value: 'h2'},
          {name: 'Heading 3', value: 'h3'},
          {name: 'Heading 4', value: 'h4'},
          {name: 'Heading 5', value: 'h5'},
          {name: 'Heading 6', value: 'h6'},
          {name: 'Paragraph', value: 'p'},
          {name: 'Pre-Formatted', value: 'pre'}
        ]}
      ></rich-action>
      <rich-action
        icon="editor:format-size"
        command="fontsize"
        .values=${[
          {name: 'Font Size', value: '--'},
          {name: 'Very Small', value: '1'},
          {name: 'Small', value: '2'},
          {name: 'Normal', value: '3'},
          {name: 'Medium Large', value: '4'},
          {name: 'Large', value: '5'},
          {name: 'Very Large', value: '6'},
          {name: 'Maximum', value: '7'}
        ]}
      ></rich-action>
      <rich-action icon="undo" command="undo"></rich-action>
      <rich-action icon="redo" command="redo"></rich-action>
      <!-- <rich-action icon="content_cut" command="cut"></rich-action> -->
      <!-- <rich-action icon="content_copy" command="copy"></rich-action>
      <rich-action icon="content_paste" command="paste"></rich-action> -->
    </header>`;
  }

  getTags() {
    let tags: string[] = [];
    if (this.selection) {
      if (this.selection.type === 'Range') {
        // @ts-ignore
        let parentNode = this.selection.baseNode;
        if (parentNode) {
          const checkNode = () => {
            const tag = parentNode?.tagName?.toLowerCase()?.trim();
            if (tag) tags.push(tag);
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
    return tags;
  }
}
