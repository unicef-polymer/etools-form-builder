import {css, CSSResult} from 'lit';

// language=CSS
export const SharedStyles: CSSResult = css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  *[hidden] {
    display: none !important;
  }

  h1,
  h2 {
    color: var(--primary-text-color);
    margin: 0;
    font-weight: normal;
  }

  h1 {
    text-transform: capitalize;
    font-size: var(--etools-font-size-24, 24px);
  }

  h2 {
    font-size: var(--etools-font-size-20, 20px);
  }

  a {
    color: var(--primary-color);
    text-underline: none;
  }

  section {
    padding: 18px 24px;
    background-color: var(--primary-background-color);
  }

  .toggle-button-control {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 16px;
    align-self: center;
    padding: 18px 0 18px 10px;
  }

  .toggle-button-control span {
    padding: 0 12px;
    font-size: var(--etools-font-size-16, 16px);
  }

  .readonly {
    pointer-events: none;
  }

  pages-header-element {
    box-shadow: 1px -3px 9px 0 #000000;
  }

  .filters-section {
    padding: 0 30px;
  }
`;
