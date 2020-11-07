import store from '../../store/configure.store';
import { CONNECTIONS_ACTION } from '../../store/actions/connections.action';

const fetchResults = () => {
  const values = document.evaluate('//button[contains(. , "Connect")]', document, null, XPathResult.ANY_TYPE, null);
  const nodes = [];
  let node;
  // eslint-disable-next-line no-cond-assign
  while (node = values.iterateNext()) {
    // @ts-ignore
    node.textContent.trim() === 'Connect' && nodes.push(node);
  }
  return nodes;
};

let url = window.location.href;
export const batchListener = () => {
  const values = fetchResults();
  if (url !== window.location.href) {
    CONNECTIONS_ACTION.removeAll();
    url = window.location.href;
  }
  if (!values.length) {
    return store.dispatch(CONNECTIONS_ACTION.removeAll());
  }

  const list = Array.from(values).map(value => {
    // @ts-ignore
    const parent = value.closest('.search-result__wrapper') || value.closest('.discover-entity-card');
    const nameElement = parent.querySelector('.actor-name') || parent.querySelector('.discover-person-card__name');
    const descriptionElement = parent.querySelector('.search-result__info > p') || parent.querySelector('.discover-person-card__occupation');
    const imgElement = parent.querySelector('img.discover-entity-type-card__image-circle') || parent.querySelector('img');
    const name = nameElement.textContent.trim();
    const link = parent.querySelector('a[href*="/in/"]').getAttribute('href');
    const description = descriptionElement.textContent.trim();
    return {
      name,
      link,
      image: imgElement ? imgElement.getAttribute('src') : '',
      description
    };
  });

  store.dispatch(CONNECTIONS_ACTION.addConnections(list));
};
