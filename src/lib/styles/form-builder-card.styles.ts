import {css, CSSResult} from 'lit-element';
// language=CSS
export const FormBuilderCardStyles: CSSResult = css`
  .overall-finding {
    padding: 15px 25px 20px 45px;
    background-color: var(--secondary-background-color);
  }
  field-renderer {
    position: relative;
    display: block;
    border-bottom: 1px solid var(--light-divider-color);
  }
  field-renderer:last-of-type {
    border-bottom: none;
  }
  .attachments-button {
    color: var(--primary-color);
    font-weight: 500;
  }
  .attachments-button:focus {
    outline: 0;
    box-shadow: 0 0 5px 5px rgb(170 165 165 / 20%);
    background-color: rgba(170, 165, 165, 0.2);
  }
  .attachments-button iron-icon {
    margin-right: 8px;
  }
  .question-container {
    padding: 7px 0;
    width: 100%;
    min-height: 57px;
    box-sizing: border-box;
    justify-content: center;
  }
  .question-text {
    font-weight: 500;
    font-size: 13px;
    color: var(--primary-text-color);
  }
  .question-details {
    font-size: 9px;
  }

  @media (max-width: 380px) {
    .overall-finding {
      padding: 5px;
    }
  }
`;
