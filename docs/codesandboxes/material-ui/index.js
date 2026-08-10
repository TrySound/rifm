/* @flow */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Rifm } from 'rifm';
import { TextField } from '@material-ui/core';

const integerAccept = /\d+/g;

const parseInteger = string => (string.match(integerAccept) || []).join('');

const formatInteger = string => {
  const parsed = parseInteger(string);
  const number = Number.parseInt(parsed, 10);
  if (Number.isNaN(number)) {
    return '';
  }
  return number.toLocaleString('en');
};

const Example = () => {
  const [number, setNumber] = React.useState('');

  return (
    <div style={{ padding: 16 }}>
      <div>Number format with material-ui text field</div>
      <Rifm format={formatInteger} value={number} onChange={setNumber}>
        {({ value, onChange }) => (
          <TextField
            type="tel"
            variant="filled"
            label="Number input"
            placeholder="Enter number..."
            value={value}
            onChange={onChange}
          />
        )}
      </Rifm>
    </div>
  );
};

if (typeof document !== 'undefined') {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.render(<Example />, root);
  }
}

export default Example;
