import React, { Component } from 'react';
import { categories } from '../../background';
import { emitter } from './linkedin.category.component';

export let current = '';

class FiltersComponent extends Component {
  filter = (event: any) => {
    current = event.target.value;
    emitter.emit('filter', event.target.value);
  }
  render() {
    return (
      <select name="filterz" onChange={this.filter}>
        <option value="">--Select Category--</option>
        {categories.map((category) => (
          <option
            value={category.title}
            key={category.title}
          >
            {category.title}
          </option>
          ))}
      </select>
    );
  }
}

export default FiltersComponent;
