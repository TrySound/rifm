/* @flow */

import * as React from 'react';
import { Container, Typography, Link } from '@material-ui/core';

const EmbedCodesandbox = ({ title, href }) => {
  const iframeStyle = {
    width: '100%',
    height: 500,
    border: 0,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 64,
  };
  return (
    <iframe
      src={`https://codesandbox.io/embed/${href}?fontsize=14`}
      title={title}
      style={iframeStyle}
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
    />
  );
};

const GithubIcon = ({ size }) => {
  return (
    <svg
      width={size}
      height={size}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>GitHub icon</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
};

type HeadingProps = {|
  children: React.Node,
  id?: string,
|};

const H1 = ({ children, id }: HeadingProps) => {
  return (
    <Typography variant="h2" gutterBottom id={id}>
      {children}
    </Typography>
  );
};

const H2 = ({ children, id }: HeadingProps) => {
  return (
    <Typography variant="h4" gutterBottom id={id}>
      {children}
    </Typography>
  );
};

const P = ({ children }) => {
  return (
    <Typography variant="body1" gutterBottom>
      {children}
    </Typography>
  );
};

const Index = () => {
  return (
    <Container style={{ marginTop: 64, marginBottom: 64 }}>
      <section style={{ marginBottom: 32 }}>
        <H1>
          RIFM - React Input Format & Mask
          <Link
            target="_blank"
            href="https://github.com/TrySound/rifm"
            style={{ marginLeft: 16 }}
          >
            <GithubIcon size={40} />
          </Link>
        </H1>

        <P>
          Is a tiny (≈ 650-750b) component to transform any input component into
          formatted or masked input.
        </P>
      </section>

      <H2 id="enforcement">Enforcement</H2>

      <EmbedCodesandbox
        title="TrySound/rifm: enforcement"
        href="github/TrySound/rifm/tree/gh-pages/codesandboxes/enforcement"
      />

      <H2 id="number-format">Number format</H2>

      <P>
        Note: to prevent parseInt overflow you can use <code>maxLength</code> on
        input field or write your own numberFormat.
      </P>

      <EmbedCodesandbox
        title="TrySound/rifm: number-format"
        href="github/TrySound/rifm/tree/gh-pages/codesandboxes/number-format"
      />

      <H2 id="date-format">Date format</H2>

      <P>
        Mask mostly the same as format, the difference that at some moment when
        you enter symbols replace operation used instead of insert for example
        when field value reached maximum length.
      </P>

      <P>
        Use <code>replace</code> to inform field to use replace operation.
      </P>

      <EmbedCodesandbox
        title="TrySound/rifm: date-format"
        href="github/TrySound/rifm/tree/gh-pages/codesandboxes/date-format"
      />

      <H2 id="phone-format">Phone format</H2>

      <P>
        Example of usage with{' '}
        <Link href="https://github.com/catamphetamine/libphonenumber-js">
          libphonenumber-js
        </Link>{' '}
        formatter
      </P>

      <EmbedCodesandbox
        title="TrySound/rifm: phone-format"
        href="github/TrySound/rifm/tree/gh-pages/codesandboxes/phone-format"
      />

      <H2 id="material-ui">Format Material UI text field</H2>

      <P>It can work with 3rd party Inputs without pain</P>

      <EmbedCodesandbox
        title="TrySound/rifm: material-ui"
        href="github/TrySound/rifm/tree/gh-pages/codesandboxes/material-ui"
      />
    </Container>
  );
};

export default Index;
