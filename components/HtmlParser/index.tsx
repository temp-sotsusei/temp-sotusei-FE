"use client";

import { FC } from "react";
import DOMPurify from "dompurify";
import parse, { DOMNode } from "html-react-parser";
import Draggable from "../Draggable";
import Droppable from "../Droppable";
interface Props {
  html: string;
}

const replace = (node: DOMNode) => {
  if (
    node.type === "text" &&
    node.parent.type === "tag" &&
    node.parent.name === "p"
  ) {
    const text = node.data;

    return (
      <>
        {text.split("").map((char, index) => (
          <Droppable key={index} id={index}>
            {char}
          </Droppable>
        ))}
      </>
    );
  }
  return null;
};

const HtmlParser: FC<Props> = ({ html }) => {
  const sanitizedHtml = DOMPurify.sanitize(html);
  return parse(sanitizedHtml, { replace });
};

export default HtmlParser;
