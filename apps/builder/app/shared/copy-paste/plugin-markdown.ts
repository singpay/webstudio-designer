import { nanoid } from "nanoid";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { gfm } from "micromark-extension-gfm";
import type { Breakpoint, Instance } from "@webstudio-is/project-build";
import type { EmbedTemplateData } from "@webstudio-is/react-sdk";
import {
  computeInstancesConstraints,
  findClosestDroppableTarget,
  insertTemplateData,
} from "../instance-utils";
import {
  breakpointsStore,
  instancesStore,
  registeredComponentMetasStore,
  selectedInstanceSelectorStore,
  selectedPageStore,
} from "../nano-states";
import { isBaseBreakpoint } from "../breakpoints";

const micromarkOptions = {
  extensions: [gfm()],
  mdastExtensions: [gfmFromMarkdown()],
};

export const mimeType = "text/plain";

// @todo Definition, Strikethrough, Table
const astTypeComponentMap: Record<string, Instance["component"]> = {
  paragraph: "Paragraph",
  heading: "Heading",
  strong: "Bold",
  emphasis: "Italic",
  link: "RichTextLink",
  // @todo image should not be rendered inside paragraph
  // we need to either have RichTextImage or support Image inside RichText
  image: "Image",
  blockquote: "Blockquote",
  code: "CodeText",
  // @todo same problem as with image
  inlineCode: "CodeText",
  list: "List",
  listItem: "ListItem",
  thematicBreak: "Separator",
};

type Options = { generateId?: typeof nanoid };

type Root = ReturnType<typeof fromMarkdown>;

const toInstanceData = (
  data: EmbedTemplateData,
  breakpointId: Breakpoint["id"],
  ast: { children: Root["children"] },
  options: Options = {}
): Instance["children"] => {
  const { instances, props, styleSources, styleSourceSelections, styles } =
    data;
  const { generateId = nanoid } = options;
  const children: Instance["children"] = [];

  for (const child of ast.children) {
    if (child.type === "text") {
      children.push({ type: "text", value: child.value });
      continue;
    }

    const component = astTypeComponentMap[child.type];
    if (component === undefined) {
      continue;
    }
    const instanceId = generateId();
    const instance: Instance = {
      type: "instance",
      id: instanceId,
      component,
      children:
        "children" in child
          ? toInstanceData(data, breakpointId, child, options)
          : [],
    };
    instances.push(instance);
    children.push({ type: "id", value: instanceId });

    if (child.type === "heading") {
      props.push({
        id: generateId(),
        type: "string",
        name: "tag",
        instanceId,
        value: `h${child.depth}`,
      });
    }
    if (child.type === "link") {
      props.push({
        id: generateId(),
        type: "string",
        name: "href",
        instanceId,
        value: child.url,
      });
    }
    if (child.type === "image") {
      props.push({
        id: generateId(),
        type: "string",
        name: "src",
        instanceId,
        value: child.url,
      });
    }
    if (child.type === "inlineCode") {
      instance.children.push({
        type: "text",
        value: child.value,
      });
      const styleSourceId = generateId();
      styleSources.push({ type: "local", id: styleSourceId });
      styleSourceSelections.push({ instanceId, values: [styleSourceId] });
      styles.push({
        breakpointId,
        styleSourceId,
        property: "display",
        value: { type: "keyword", value: "inline-block" },
      });
    }
    if (child.type === "code") {
      instance.children.push({
        type: "text",
        value: child.value,
      });
      if (child.lang) {
        props.push({
          id: generateId(),
          type: "string",
          name: "lang",
          instanceId,
          value: child.lang,
        });
      }
    }
    if (child.type === "list") {
      if (typeof child.ordered === "boolean") {
        props.push({
          id: generateId(),
          type: "boolean",
          name: "ordered",
          instanceId,
          value: child.ordered,
        });
      }
      if (typeof child.start === "number") {
        props.push({
          id: generateId(),
          type: "number",
          name: "start",
          instanceId,
          value: child.start,
        });
      }
    }

    if ("title" in child && child.title) {
      props.push({
        id: generateId(),
        type: "string",
        name: "title",
        instanceId,
        value: child.title,
      });
    }
    if ("alt" in child && child.alt) {
      props.push({
        id: generateId(),
        type: "string",
        name: "alt",
        instanceId,
        value: child.alt,
      });
    }
  }

  return children;
};

export const parse = (clipboardData: string, options?: Options) => {
  const ast = fromMarkdown(clipboardData, micromarkOptions);
  if (ast.children.length === 0) {
    return;
  }
  const breakpoints = breakpointsStore.get();
  const breakpointValues = Array.from(breakpoints.values());
  const baseBreakpoint = breakpointValues.find(isBaseBreakpoint);
  if (baseBreakpoint === undefined) {
    return;
  }
  const data: EmbedTemplateData = {
    children: [],
    instances: [],
    props: [],
    styles: [],
    styleSources: [],
    styleSourceSelections: [],
    dataSources: [],
  };
  data.children = toInstanceData(data, baseBreakpoint.id, ast, options);
  return data;
};

export const onPaste = (clipboardData: string): boolean => {
  const data = parse(clipboardData);
  const selectedPage = selectedPageStore.get();
  if (data === undefined || selectedPage === undefined) {
    return false;
  }
  const metas = registeredComponentMetasStore.get();
  const newInstances = new Map(
    data.instances.map((instance) => [instance.id, instance])
  );
  const rootInstanceIds = data.children
    .filter((child) => child.type === "id")
    .map((child) => child.value);
  // paste to the root if nothing is selected
  const instanceSelector = selectedInstanceSelectorStore.get() ?? [
    selectedPage.rootInstanceId,
  ];
  const dropTarget = findClosestDroppableTarget(
    metas,
    instancesStore.get(),
    instanceSelector,
    computeInstancesConstraints(metas, newInstances, rootInstanceIds)
  );
  if (dropTarget === undefined) {
    return false;
  }
  insertTemplateData(data, dropTarget);
  return true;
};
