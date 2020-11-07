import React, { FunctionComponent } from 'react';
import { AppendComponent } from '../../../global.components/append.component';
import { config } from '../../../config/config';
import store from '../../store/configure.store';

interface LookForMyProfileProps {
  id: string;
}

const Icon = (params: any) => React.createElement('li-icon', { children: params.children });

const LockForMyProfile: FunctionComponent<LookForMyProfileProps> = (params) => {
  const onClick = () => {
    window.open(`${config.control_panel_url}/share/${params.id}`);
  };
  return (
    <div data-control-name="message" id="ember292" className="ember-view">
      <button
        className="message-anywhere-button send-privately-button artdeco-button artdeco-button--4 artdeco-button--tertiary  artdeco-button--muted "
        aria-label="Send in a private message" type="button" onClick={onClick}
      >

        <Icon>
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor"
            className="mercado-match" width="24" height="24" focusable="false"
          >
            <path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z" />
          </svg>
        </Icon>

        <span className="artdeco-button__text">Linvo Send</span>

      </button>
    </div>
  );
};

export const lookForProfile = () => {
  const MyCard = Array.from(document.querySelectorAll('.feed-shared-actor__name')).filter(s => s.textContent.trim() === 'Nevo David');
  MyCard.forEach(card => {
    const parent = card.closest('.feed-shared-update-v2');
    if (!parent) {
      return;
    }

    const id = parent.getAttribute('data-urn');

    AppendComponent.add({
      appendTo: parent.querySelector('.feed-shared-social-actions'),
      component: (<LockForMyProfile id={id} />)
    });
  });
};
