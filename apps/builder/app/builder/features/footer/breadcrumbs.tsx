import { useStore } from "@nanostores/react";
import { ChevronRightIcon } from "@webstudio-is/icons";
import {
  theme,
  DeprecatedButton,
  Flex,
  Text,
} from "@webstudio-is/design-system";
import {
  instancesStore,
  registeredComponentMetasStore,
  selectedInstanceSelectorStore,
  selectedStyleSourceSelectorStore,
} from "~/shared/nano-states";
import { getAncestorInstanceSelector } from "~/shared/tree-utils";
import { textEditingInstanceSelectorStore } from "~/shared/nano-states";
import { getInstanceLabel } from "~/shared/instance-utils";

type BreadcrumbProps = {
  children: JSX.Element | string;
  onClick?: () => void;
};

const Breadcrumb = ({ children, onClick }: BreadcrumbProps) => {
  return (
    <>
      <DeprecatedButton
        ghost
        onClick={onClick}
        css={{
          color: theme.colors.hiContrast,
          px: theme.spacing[5],
          borderRadius: "100vh",
          height: "100%",
        }}
      >
        {children}
      </DeprecatedButton>
      <ChevronRightIcon color="white" />
    </>
  );
};

export const Breadcrumbs = () => {
  const instances = useStore(instancesStore);
  const selectedInstanceSelector = useStore(selectedInstanceSelectorStore);
  const metas = useStore(registeredComponentMetasStore);

  return (
    <Flex align="center" css={{ height: "100%" }}>
      {selectedInstanceSelector === undefined ? (
        <Breadcrumb>
          <Text>No instance selected</Text>
        </Breadcrumb>
      ) : (
        selectedInstanceSelector
          // start breadcrumbs from the root
          .slice()
          .reverse()
          .map((instanceId) => {
            const instance = instances.get(instanceId);
            if (instance === undefined) {
              return;
            }
            const meta = metas.get(instance.component);
            if (meta === undefined) {
              return;
            }
            return (
              <Breadcrumb
                key={instance.id}
                onClick={() => {
                  selectedInstanceSelectorStore.set(
                    getAncestorInstanceSelector(
                      selectedInstanceSelector,
                      instance.id
                    )
                  );
                  textEditingInstanceSelectorStore.set(undefined);
                  selectedStyleSourceSelectorStore.set(undefined);
                }}
              >
                {getInstanceLabel(instance, meta)}
              </Breadcrumb>
            );
          })
      )}
    </Flex>
  );
};
