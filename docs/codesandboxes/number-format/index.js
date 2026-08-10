/* @flow */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Rifm } from 'rifm';

// To prevent parseInt overflow you can use `maxLength` on input field
// or write your own numberFormat.

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

const negativeAccept = /[\d-]+/g;

const parseNegative = string => (string.match(negativeAccept) || []).join('');

const formatNegative = string => {
  const parsed = parseNegative(string);
  if (parsed === '-') {
    return '-';
  }
  const number = Number.parseInt(parsed, 10);
  if (Number.isNaN(number)) {
    return '';
  }
  return number.toLocaleString('en');
};

const numberAccept = /[\d.]+/g;

const parseNumber = string => (string.match(numberAccept) || []).join('');

const formatFixedPointNumber = (value, digits) => {
  const parsed = parseNumber(value);
  const [head, tail] = parsed.split('.');
  // Avoid rounding errors at toLocaleString as when user enters 1.239 and maxDigits=2 we
  // must not to convert it to 1.24, it must stay 1.23
  const scaledTail = tail != null ? tail.slice(0, digits) : '';

  let number = Number.parseFloat(`${head}.${scaledTail}`);

  // For fixed format numbers deleting "." must be no-op
  // as imagine u have 123.45 then delete "." and get 12345.00 looks bad in UI
  // so we transform here 12345 into 123.45 instead of 12345.00.
  // The main disadvantage of this, that you need carefully check input value
  // that it always has fractional part
  if (digits > 0 && tail == null) {
    const paddedHead = head.padStart(digits + 1 - head.length, '0');
    number = Number.parseFloat(
      `${paddedHead.slice(0, -digits)}.${paddedHead.slice(-digits)}`
    );
  }

  if (Number.isNaN(number)) {
    return '';
  }

  const formatted = number.toLocaleString('de-CH', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  return formatted;
};

const formatFloatingPointNumber = (value, maxDigits) => {
  const parsed = parseNumber(value);
  const [head, tail] = parsed.split('.');
  // Avoid rounding errors at toLocaleString as when user enters 1.239 and maxDigits=2 we
  // must not to convert it to 1.24, it must stay 1.23
  const scaledTail = tail != null ? tail.slice(0, maxDigits) : '';

  const number = Number.parseFloat(`${head}.${scaledTail}`);

  if (Number.isNaN(number)) {
    return '';
  }

  const formatted = number.toLocaleString('de-CH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDigits,
  });

  if (parsed.includes('.')) {
    const [formattedHead] = formatted.split('.');

    // skip zero at digits position for non fixed floats
    // as at digits 2 for non fixed floats numbers like 1.50 has no sense, just 1.5 allowed
    // but 1.0 has sense as otherwise you will not be able to enter 1.05 for example
    const formattedTail =
      scaledTail !== '' && scaledTail[maxDigits - 1] === '0'
        ? scaledTail.slice(0, -1)
        : scaledTail;

    return `${formattedHead}.${formattedTail}`;
  }
  return formatted;
};

// 2 in m^2 should not be a number to not match regexp
const formatMeters = string =>
  formatFloatingPointNumber(string, 2) + ' m\u00B2';

const formatCurrency = string => '$' + formatFloatingPointNumber(string, 2);

const Example = () /*:React.Node*/ => {
  const [integer, setInteger] = React.useState('12345');
  const [negative, setNegative] = React.useState('12345');
  const [variableFloat, setVariableFloat] = React.useState('12345');
  const [fixedFloat, setFixedFloat] = React.useState('12345');

  return (
    <Grid>
      <div>
        <div>Integer number format: {integer}</div>
        <Rifm
          accept={/\d/g}
          format={formatInteger}
          value={integer}
          onChange={value => setInteger(parseInteger(value))}
        >
          {renderInput}
        </Rifm>
      </div>

      <div>
        <div>Negative number format: {negative}</div>
        <Rifm
          accept={/[\d-]/g}
          format={formatNegative}
          value={negative}
          onChange={value => setNegative(parseNegative(value))}
        >
          {renderInput}
        </Rifm>
      </div>

      <div>
        <div>Number with fractional part: {fixedFloat}</div>
        <Rifm
          accept={/[\d.]/g}
          format={v => formatFixedPointNumber(v, 2)}
          // 00 is needed here see disadvantages comment at formatNumber
          value={`${fixedFloat}00`}
          onChange={value => setFixedFloat(parseNumber(value))}
        >
          {renderInput}
        </Rifm>
      </div>

      <div>
        <div>Number with variable fractional part: {variableFloat}</div>
        <Rifm
          accept={/[\d.]/g}
          format={v => formatFloatingPointNumber(v, 2)}
          value={variableFloat}
          onChange={value => setVariableFloat(parseNumber(value))}
        >
          {renderInput}
        </Rifm>
      </div>

      <div>
        <div>Square meters number: {variableFloat}</div>
        <Rifm
          accept={/[\d.]/g}
          format={formatMeters}
          value={variableFloat}
          onChange={value => setVariableFloat(parseNumber(value))}
        >
          {renderInput}
        </Rifm>
      </div>

      <div>
        <div>Currency number: {variableFloat}</div>
        <Rifm
          // $ need to be in regexp to prevent cursor jumping on backspace
          accept={/[\d.$]/g}
          format={formatCurrency}
          value={variableFloat}
          onChange={value => setVariableFloat(parseNumber(value))}
        >
          {renderInput}
        </Rifm>
      </div>
    </Grid>
  );
};

const renderInput = ({ value, onChange }) => (
  // type=number is not allowed
  <input
    type="tel"
    style={{
      textAlign: 'right',
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
