import {
  CollapsibleIcon,
  TriggerIcon,
  ContentIcon,
} from "@webstudio-is/icons/svg";
import type {
  PresetStyle,
  WsComponentMeta,
  WsComponentPropsMeta,
} from "@webstudio-is/react-sdk";
import {
  propsCollapsible,
  propsCollapsibleContent,
  propsCollapsibleTrigger,
} from "./__generated__/collapsible.props";
import { div } from "@webstudio-is/react-sdk/css-normalize";

const presetStyle = {
  div,
} satisfies PresetStyle<"div">;

export const metaCollapsible: WsComponentMeta = {
  category: "radix",
  order: 5,
  type: "container",
  presetStyle,
  icon: CollapsibleIcon,
  template: [
    {
      type: "instance",
      component: "Collapsible",
      dataSources: {
        collapsibleOpen: { type: "variable", initialValue: false },
      },
      props: [
        {
          type: "dataSource",
          name: "open",
          dataSourceName: "collapsibleOpen",
        },
        {
          name: "onOpenChange",
          type: "action",
          value: [
            { type: "execute", args: ["open"], code: `collapsibleOpen = open` },
          ],
        },
      ],
      children: [
        {
          type: "instance",
          component: "CollapsibleTrigger",
          children: [
            {
              type: "instance",
              component: "Button",
              children: [{ type: "text", value: "Click to toggle content" }],
            },
          ],
        },
        {
          type: "instance",
          component: "CollapsibleContent",
          children: [
            {
              type: "instance",
              component: "Text",
              children: [{ type: "text", value: "Collapsible Content" }],
            },
          ],
        },
      ],
    },
  ],
};

export const metaCollapsibleTrigger: WsComponentMeta = {
  category: "hidden",
  type: "container",
  icon: TriggerIcon,
  stylable: false,
  detachable: false,
};

export const metaCollapsibleContent: WsComponentMeta = {
  category: "hidden",
  type: "container",
  presetStyle,
  icon: ContentIcon,
  detachable: false,
};

export const propsMetaCollapsible: WsComponentPropsMeta = {
  props: {
    ...propsCollapsible,
    onOpenChange: {
      type: "action",
      control: "action",
      required: false,
    },
  },
  initialProps: ["open", "onOpenChange"],
};

export const propsMetaCollapsibleTrigger: WsComponentPropsMeta = {
  props: propsCollapsibleTrigger,
};

export const propsMetaCollapsibleContent: WsComponentPropsMeta = {
  props: propsCollapsibleContent,
};
