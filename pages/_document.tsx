import React from "react";
import Document, { DocumentContext, Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@material-ui/styles";

class MyDocument extends Document {
  render() {
    return (
      <html lang="en" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const sheets = new ServerStyleSheets();

  const initialProps = await ctx.renderPage((Component) => ({ ...props }) => {
    return sheets.collect(<Component {...props} />);
  });

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: <React.Fragment>{sheets.getStyleElement()}</React.Fragment>,
  };
};

export default MyDocument;
