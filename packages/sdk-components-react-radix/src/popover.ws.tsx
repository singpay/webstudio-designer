import { PopoverIcon, TriggerIcon, ContentIcon } from "@webstudio-is/icons/svg";
import {
  type PresetStyle,
  type WsComponentMeta,
  type WsComponentPropsMeta,
} from "@webstudio-is/react-sdk";
import * as tc from "./theme/tailwind-classes";
import {
  propsPopover,
  propsPopoverContent,
  propsPopoverTrigger,
} from "./__generated__/popover.props";
import { div } from "@webstudio-is/react-sdk/css-normalize";
import { template as buttonTemplate } from "./button.ws";

const presetStyle = {
  div,
} satisfies PresetStyle<"div">;

// @todo add [data-state] to button and link
export const metaPopoverTrigger: WsComponentMeta = {
  category: "hidden",
  type: "container",
  icon: TriggerIcon,
  stylable: false,
  detachable: false,
};

export const metaPopoverContent: WsComponentMeta = {
  category: "hidden",
  type: "container",
  presetStyle,
  icon: ContentIcon,
  detachable: false,
};

/**
 * Styles source without animations:
 * https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/popover.tsx
 *
 * Attributions
 * MIT License
 * Copyright (c) 2023 shadcn
 **/
export const metaPopover: WsComponentMeta = {
  category: "radix",
  order: 6,
  type: "container",
  icon: PopoverIcon,
  stylable: false,
  template: [
    {
      type: "instance",
      component: "Popover",
      dataSources: {
        popoverOpen: { type: "variable", initialValue: false },
      },
      props: [
        {
          type: "dataSource",
          name: "open",
          dataSourceName: "popoverOpen",
        },
        {
          name: "onOpenChange",
          type: "action",
          value: [
            { type: "execute", args: ["open"], code: `popoverOpen = open` },
          ],
        },
      ],
      children: [
        {
          type: "instance",
          component: "PopoverTrigger",
          props: [],
          children: buttonTemplate({
            children: [{ type: "text", value: "Button" }],
          }),
        },
        {
          type: "instance",
          component: "PopoverContent",
          props: [],
          /**
           *  z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none
           **/
          styles: [
            tc.z(50),
            tc.w(72),
            tc.rounded("md"),
            tc.border(),
            tc.bg("popover"),
            tc.p(4),
            tc.text("popoverForeground"),
            tc.shadow("md"),
            tc.outline("none"),
          ].flat(),
          children: [
            {
              type: "instance",
              component: "Text",
              children: [{ type: "text", value: "The text you can edit" }],
            },
          ],
        },
      ],
    },
  ],
};

export const propsMetaPopover: WsComponentPropsMeta = {
  props: propsPopover,
  initialProps: ["open", "modal"],
};

export const propsMetaPopoverTrigger: WsComponentPropsMeta = {
  props: propsPopoverTrigger,
};

export const propsMetaPopoverContent: WsComponentPropsMeta = {
  props: propsPopoverContent,
  initialProps: ["side", "sideOffset", "align", "alignOffset"],
};
