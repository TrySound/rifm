import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

export const highlightCode = (code: string, language: "typescript" | "tsx") =>
  Prism.highlight(code, Prism.languages[language], language);

export const highlightAll = () => Prism.highlightAll();
