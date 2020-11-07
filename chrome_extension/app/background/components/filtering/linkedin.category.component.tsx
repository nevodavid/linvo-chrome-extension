import React, { Component } from 'react';
import { categories } from '../../background';
import { EventEmitter } from 'events';
import {current} from "./filters.component";
import {cloneDeep} from 'lodash';

interface LinkedinCategoryComponentInterface {
  indexDbValue: {
    id: number,
    linkedin_id: number,
    classify: string
  };
}

interface LinkedinCategoryComponentState {
  indexDbValue?: {
    id: number,
    linkedin_id: number,
    classify: string
  }
}

export const emitter = new EventEmitter();

class LinkedinCategoryComponent extends Component<
  LinkedinCategoryComponentInterface, LinkedinCategoryComponentState
> {
  state: LinkedinCategoryComponentState = {
    indexDbValue: undefined
  }
  componentDidMount() {
    this.setState({
      indexDbValue: cloneDeep(this.props.indexDbValue)
    });

    emitter.on('filter', (type) => {
      const selector = document.querySelector < HTMLDivElement > (`[data-urn="${this.props.indexDbValue.linkedin_id}"]`);
      if (!selector) {
        return;
      }

      console.log(this.state.indexDbValue.classify);

      selector.style.display = ((type === this.state.indexDbValue.classify)) ? 'block' : 'none';
    });
  }

  update = (val: any) => {
    const {indexDbValue} = this.state;
    this.setState({
      indexDbValue: {
        ...indexDbValue,
        classify: val.classify,
      }
    });

    if (val.classify && val.classify !== this.state.indexDbValue.classify) {
      document.querySelector < HTMLDivElement > (`[data-urn="${this.props.indexDbValue.linkedin_id}"]`).style.display = 'none';
    }
  };

  render() {
    if (!this.state.indexDbValue) {
      return <></>
    }
    const { indexDbValue: {classify: value} } = this.state;
    return (
      <div style={{ padding: '6px 4px' }}>
        {!value ? (
          'Loading'
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: 10 }}>Category:</div>
            <div style={{ width: 200 }}>
              <select>
                {categories.map((category) => (
                  <option
                    key={category.title}
                    selected={category.title === value}
                  >
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default LinkedinCategoryComponent;
