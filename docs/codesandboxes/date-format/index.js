/* @flow */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Rifm } from 'rifm';

const parseDigits = string => (string.match(/\d+/g) || []).join('');

const formatDate = string => {
  const digits = parseDigits(string);
  const chars = digits.split('');
  return chars
    .reduce(
      (r, v, index) => (index === 2 || index === 4 ? `${r}-${v}` : `${r}${v}`),
      ''
    )
    .substr(0, 10);
};

const formatDateWithAppend = string => {
  const res = formatDate(string);

  if (string.endsWith('-')) {
    if (res.length === 2) {
      return `${res}-`;
    }

    if (res.length === 5) {
      return `${res}-`;
    }
  }
  return res;
};

const appendHyphen = v => (v.length === 2 || v.length === 5 ? `${v}-` : v);

const addMask = string => {
  const digits = parseDigits(string);
  const days = digits.slice(0, 2).padEnd(2, '_');
  const months = digits.slice(2, 4).padEnd(2, '_');
  const years = digits.slice(4, 8).padEnd(4, '_');
  return `${days}-${months}-${years}`;
};

const Example = () /*:React.Node*/ => {
  const [formatted, setFormatted] = React.useState('18-08-1978');
  const [formattedA, setFormattedA] = React.useState('');
  const [masked, setMasked] = React.useState('');

  return (
    <Grid>
      <div>
        <div>Date format with append</div>
        <Rifm
          accept={/\d+/g}
          mask={10 <= formattedA.length}
          format={formatDateWithAppend}
          append={appendHyphen}
          value={formattedA}
          onChange={setFormattedA}
        >
          {renderInput}
        </Rifm>
      </div>

      <div>
        <div>Date format</div>
        <Rifm
          accept={/\d/g}
          mask={10 <= formatted.length}
          format={formatDate}
          value={formatted}
          onChange={setFormatted}
        >
          {renderInput}
        </Rifm>
      </div>

      <div>
        <div>Date format with mask</div>
        <Rifm
          accept={/[\d]/g}
          mask={true}
          format={formatDate}
          replace={addMask}
          value={masked}
          onChange={setMasked}
        >
          {renderInput}
        </Rifm>
      </div>
    </Grid>
  );
};

const renderInput = ({ value, onChange }) => (
  <input
    type="tel"
    placeholder="dd-mm-yyyy"
    style={{
      width: '100%',
      height: 32,
      fontSize: 'inherit',
      boxSizing: 'border-box',
    }}
    value={value}
    onChange={onChange}
  />
);

const Grid = ({ children }) => {
  return (
    <div
      style={{
        display: 'grid',
        padding: 16,
        gap: 24,
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        alignItems: 'end',
      }}
    >
      {children}
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
