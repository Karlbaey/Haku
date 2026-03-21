import { visit } from "unist-util-visit";

function isElement(node, tagName) {
  return node && node.type === "element" && node.tagName === tagName;
}

export function rehypeArticleImages() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (!isElement(node, "p") || !parent || typeof index !== "number") {
        return;
      }

      const onlyChild = node.children?.[0];

      if (
        node.children?.length !== 1 ||
        !isElement(onlyChild, "img") ||
        isElement(parent, "a")
      ) {
        return;
      }

      const alt = typeof onlyChild.properties?.alt === "string"
        ? onlyChild.properties.alt
        : "";
      const caption = alt && alt !== "_" ? alt : "";

      onlyChild.properties = {
        ...onlyChild.properties,
        loading: onlyChild.properties?.loading || "lazy",
        decoding: onlyChild.properties?.decoding || "async",
        "data-zoomable": "",
      };

      parent.children[index] = {
        type: "element",
        tagName: "figure",
        properties: {
          className: ["markdown-image"],
        },
        children: [
          onlyChild,
          ...(caption
            ? [
                {
                  type: "element",
                  tagName: "figcaption",
                  properties: {},
                  children: [{ type: "text", value: caption }],
                },
              ]
            : []),
        ],
      };
    });

    visit(tree, "element", (node, index, parent) => {
      if (!isElement(node, "img") || !parent) {
        return;
      }

      if (isElement(parent, "a")) {
        return;
      }

      node.properties = {
        ...node.properties,
        loading: node.properties?.loading || "lazy",
        decoding: node.properties?.decoding || "async",
        "data-zoomable": "",
      };
    });
  };
}
