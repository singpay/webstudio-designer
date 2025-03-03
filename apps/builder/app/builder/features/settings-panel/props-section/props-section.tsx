import { useState } from "react";
import { useStore } from "@nanostores/react";
import store from "immerhin";
import type { Instance } from "@webstudio-is/project-build";
import {
  theme,
  useCombobox,
  Combobox,
  ComboboxContent,
  ComboboxAnchor,
  ComboboxListbox,
  ComboboxListboxItem,
  Separator,
  Flex,
  InputField,
  NestedInputButton,
} from "@webstudio-is/design-system";
import type { Publish } from "~/shared/pubsub";
import {
  dataSourceVariablesStore,
  propsIndexStore,
  propsStore,
} from "~/shared/nano-states";
import { CollapsibleSectionWithAddButton } from "~/builder/shared/collapsible-section";
import {
  useStyleData,
  type SetProperty as SetCssProperty,
} from "~/builder/features/style-panel/shared/use-style-data";
import { renderControl } from "../controls/combined";
import {
  usePropsLogic,
  type NameAndLabel,
  type PropAndMeta,
} from "./use-props-logic";
import { Row, getLabel } from "../shared";

const itemToString = (item: NameAndLabel | null) =>
  item ? getLabel(item, item.name) : "";

const PropsCombobox = ({
  items,
  onItemSelect,
}: {
  items: NameAndLabel[];
  onItemSelect: (item: NameAndLabel) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const combobox = useCombobox<NameAndLabel>({
    items,
    itemToString,
    onItemSelect,
    selectedItem: undefined,

    // this weird handling of value is needed to work around a limitation in useCombobox
    // where it doesn't allow to leave both `value` and `selectedItem` empty/uncontrolled
    value: { name: "", label: inputValue },
    onInputChange: (value) => setInputValue(value ?? ""),
  });

  return (
    <Combobox>
      <div {...combobox.getComboboxProps()}>
        <ComboboxAnchor>
          <InputField
            autoFocus
            {...combobox.getInputProps()}
            placeholder="New Property"
            suffix={<NestedInputButton {...combobox.getToggleButtonProps()} />}
          />
        </ComboboxAnchor>
        <ComboboxContent align="end" sideOffset={5}>
          <ComboboxListbox {...combobox.getMenuProps()}>
            {combobox.isOpen &&
              combobox.items.map((item, index) => (
                <ComboboxListboxItem
                  key={item.name}
                  selectable={false}
                  {...combobox.getItemProps({ item, index })}
                >
                  {itemToString(item)}
                </ComboboxListboxItem>
              ))}
          </ComboboxListbox>
        </ComboboxContent>
      </div>
    </Combobox>
  );
};

const renderProperty = (
  {
    propsLogic: logic,
    setCssProperty,
    component,
    instanceId,
  }: PropsSectionProps,
  { prop, propName, meta }: PropAndMeta,
  deletable?: boolean
) =>
  renderControl({
    key: propName,
    instanceId,
    meta,
    prop,
    propName,
    onDelete: deletable
      ? () => logic.handleDelete({ prop, propName })
      : undefined,
    onSoftDelete: () => prop && logic.handleSoftDelete(prop),
    onChange: (propValue, asset) => {
      logic.handleChange({ prop, propName }, propValue);

      // @todo: better way to do this?
      if (
        component === "Image" &&
        propName === "src" &&
        asset &&
        "width" in asset.meta &&
        "height" in asset.meta
      ) {
        setCssProperty("aspectRatio")({
          type: "unit",
          unit: "number",
          value: asset.meta.width / asset.meta.height,
        });
      }
    },
  });

const AddPropertyForm = ({
  availableProps,
  onPropSelected,
}: {
  availableProps: NameAndLabel[];
  onPropSelected: (propName: string) => void;
}) => (
  <Flex css={{ height: theme.spacing[13] }} direction="column" justify="center">
    <PropsCombobox
      items={availableProps}
      onItemSelect={(item) => onPropSelected(item.name)}
    />
  </Flex>
);

type PropsSectionProps = {
  propsLogic: ReturnType<typeof usePropsLogic>;
  component: Instance["component"];
  instanceId: string;
  setCssProperty: SetCssProperty;
};

// A UI componet with minimum logic that can be demoed in Storybook etc.
export const PropsSection = (props: PropsSectionProps) => {
  const { propsLogic: logic } = props;

  const [addingProp, setAddingProp] = useState(false);

  const hasItems =
    logic.addedProps.length > 0 || addingProp || logic.initialProps.length > 0;

  return (
    <>
      <Row css={{ py: theme.spacing[5] }}>
        {logic.systemProps.map((item) => renderProperty(props, item))}
      </Row>

      <Separator />

      <CollapsibleSectionWithAddButton
        label="Properties"
        onAdd={() => setAddingProp(true)}
        hasItems={hasItems}
      >
        <Flex gap="2" direction="column">
          {addingProp && (
            <AddPropertyForm
              availableProps={logic.availableProps}
              onPropSelected={(propName) => {
                setAddingProp(false);
                logic.handleAdd(propName);
              }}
            />
          )}
          {logic.addedProps.map((item) => renderProperty(props, item, true))}
          {logic.initialProps.map((item) => renderProperty(props, item))}
        </Flex>
      </CollapsibleSectionWithAddButton>
    </>
  );
};

export const PropsSectionContainer = ({
  selectedInstance: instance,
  publish,
}: {
  publish: Publish;
  selectedInstance: Instance;
}) => {
  const { setProperty: setCssProperty } = useStyleData({
    selectedInstance: instance,
    publish,
  });
  const { propsByInstanceId } = useStore(propsIndexStore);

  const logic = usePropsLogic({
    instance,
    props: propsByInstanceId.get(instance.id) ?? [],
    updateProp: (update) => {
      const props = propsStore.get();
      const prop = props.get(update.id);
      // update data source instead when real prop has data source type
      if (prop?.type === "dataSource") {
        const dataSourceId = prop.value;
        const dataSourceVariables = new Map(dataSourceVariablesStore.get());
        dataSourceVariables.set(dataSourceId, update.value);
        dataSourceVariablesStore.set(dataSourceVariables);
      } else {
        store.createTransaction([propsStore], (props) => {
          props.set(update.id, update);
        });
      }
    },
    deleteProp: (propId) => {
      store.createTransaction([propsStore], (props) => {
        props.delete(propId);
      });
    },
  });

  const hasMetaProps = Object.keys(logic.meta.props).length !== 0;

  if (hasMetaProps === false) {
    return null;
  }

  return (
    <PropsSection
      propsLogic={logic}
      component={instance.component}
      instanceId={instance.id}
      setCssProperty={setCssProperty}
    />
  );
};
