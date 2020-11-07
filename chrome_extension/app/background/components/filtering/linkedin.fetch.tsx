import React from 'react';
import { AppendComponent } from '../../../global.components/append.component';
import FiltersComponent from './filters.component';
import { sendRequest } from '../../background';
import { config } from '../../../config/config';
import LinvoDB from '../../../dbs/posts.db';
import LinkedinCategoryComponent from './linkedin.category.component';

export const refs: any = {};

export class LinkedinFetch {
  static updateValues = () => {
    const fetch: any = document.querySelector('#linkedinFetch');
    if (!fetch || !fetch.value) {
      return '';
    }
    // @ts-ignore
    (JSON.parse(fetch.value)).map(val => refs[val.id].update(val));
    fetch.value = '[]';
  }

  static linkedinPostInPage = () => Array.from(document.querySelectorAll('[data-urn]')).map(urn => {
    const id = urn.getAttribute('data-urn');
        // @ts-ignore
    const feed = urn.querySelector('.feed-shared-text');
    const profilePicture = urn.querySelector('.feed-shared-actor__avatar-image');
    const isAd = urn.querySelector('.feed-shared-actor__sub-description');
    const profileDescription = urn.querySelector('.feed-shared-actor__description');
    const name = urn.querySelector('.feed-shared-actor__name');
    const likes = urn.querySelector('.social-details-social-counts__reactions-count');
    const comments = urn.querySelector('[data-control-name="comments_count"]');
        // @ts-ignore
    const value = (feed && feed.innerText && feed.innerText.trim()) || '';
    return {
      id,
      urn,
      value,
            // @ts-ignore
      profilePicture: (profilePicture && profilePicture.src) || '',
            // @ts-ignore
      name: (name && name.innerText && name.innerText.trim()) || '',
            // @ts-ignore
      isAd: Boolean(isAd && isAd.innerText && isAd.innerText.trim() === 'Promoted'),          // @ts-ignore
            // @ts-ignore
      profileDescription: (profileDescription && profileDescription.innerText && profileDescription.innerText.trim()) || '',
            // @ts-ignore
      likes: (likes && likes.innerText && +likes.innerText.trim().replace(/,/g, '')) || 0,
            // @ts-ignore
      comments: (comments && comments.innerText && +comments.innerText.trim().replace(/,/g, '').match(/\d+/)) || 0,
    };
  })

  static newComponent = async () => {
    // getting all values from page
    const values = LinkedinFetch.linkedinPostInPage();

    // checking if values exist in db
    const map = (await LinvoDB.posts.where('linkedin_id').anyOf(values.map(v => v.id)).toArray());

    // linkedin id from db
    const linkedinIdFromDB = map.map(a => a.linkedin_id);

    // filter id from values where exists in db
    const toFetch = values.filter(t => linkedinIdFromDB.indexOf(t.id) === -1);

    // adding all values that are not in db
    if (toFetch.length) {
      await LinvoDB.posts.bulkAdd(toFetch.map((c: any) => ({
        date: new Date(),
        finished: 0,
        linkedin_id: c.id,
        classify: c.classify
      })));
    }

    // sending request to get values from classifier or returning the values from the db
    const clasi = !toFetch.length ? map : await sendRequest(`${config.api_url}/login/tags`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toFetch.map(f => ({ id: f.id, value: f.value })))
    });

    // getting the post from the db that we saved before
    const find = await LinvoDB.posts.where('linkedin_id').anyOf(clasi.map((c: any) => c.linkedin_id)).toArray();

    // merging the results and adding the classify
    const newC = clasi.map((c: any) => ({
      ...find.find(f => f.linkedin_id === c.linkedin_id),
      finished: 1,
      classify: c.classify,
    }));

    // updating the results
    await LinvoDB.posts.bulkPut(newC);

    newC.forEach((val: any) => {
      const newId = (val.linkedin_id || val.id).replace(/:/g, '').replace(/,/g, '');
      if (document.querySelector(`#id-${newId}`)) {
        return;
      }

      const div = document.createElement('div');
      div.setAttribute('id', `id-${newId}`);
      div.style.clear = 'both';
      div.style.width = '100%';
      div.style.height = '45px';
      div.style.borderTop = '1px solid var(--warm-gray-30,#e6e9ec)';

      const refr = document.querySelector(`[data-urn="${val.linkedin_id}"]`).querySelector('.feed-shared-social-actions');
      refr.parentNode.insertBefore(div, refr.nextSibling);


      AppendComponent.add({
        component: (<LinkedinCategoryComponent indexDbValue={val} />),
        appendTo: div,
        identifier: 'react2'
      });
    });
  }

  static addFilterComponent() {
    if (document.querySelector('#filterz')) {
      return;
    }

    const div = document.createElement('div');
    div.setAttribute('id', 'filterz');

    const refr = document.querySelector('[data-control-name="feed_sort_dropdown_trigger"]');
    refr.parentNode.insertBefore(div, refr.nextSibling);

    AppendComponent.add({
      component: (<FiltersComponent />),
      appendTo: div
    });
  }

  static addValue = (value: any) => {
    // @ts-ignore
    const element = document.querySelector('#linkedinInfo');
    // @ts-ignore
    const parse = JSON.parse(element.value);
    parse.push(value);

      // @ts-ignore
    element.value = JSON.stringify(parse);
  }
}
