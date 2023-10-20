import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import AnimatedFormWrapper from "../AnimatedFormWrapper";
import { Button, Input } from "@nextui-org/react";
import { AdditionalService } from "@/types";

interface AdditionalServicesFormProps {
  selectedServices?: AdditionalService[];
  additionalServices: AdditionalService[];
  onAdditionalServicesUpdate: (data: AdditionalService[]) => void;
}

const AdditionalServicesForm = ({
  selectedServices,
  additionalServices,
  onAdditionalServicesUpdate,
}: AdditionalServicesFormProps) => {
  const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(
    new Set<React.Key>(selectedServices?.map((service) => service.id))
  );

  const selectedValue = React.useMemo(() => {
    if (selectedKeys.size === 0) return "";

    const selectedKeysArray = Array.from(selectedKeys);

    const values = additionalServices
      // @ts-ignore
      .filter((service) => selectedKeysArray.includes(service.id))
      .map((service) => service.name);

    return values.join(", ").replaceAll("_", " ");
  }, [selectedKeys]);

  const servicesPrice = React.useMemo(() => {
    if (selectedKeys.size === 0) return 0;

    const selectedKeysArray = Array.from(selectedKeys);

    const values = additionalServices
      .filter((service) => selectedKeysArray.includes(service.id))
      .map((service) => service.price);

    return values.reduce((a, b) => a + b, 0);
  }, [selectedKeys]);

  const onSelectionChange = (keys: Set<React.Key>) => {
    setSelectedKeys(keys);

    const selectedKeysArray = Array.from(keys);
    const selectedServices = additionalServices.filter((service) =>
      selectedKeysArray.includes(service.id)
    );
    onAdditionalServicesUpdate(selectedServices);
  };

  return (
    <AnimatedFormWrapper
      key="step2"
      title={"Additional Services"}
      description={"Select the additional services"}
    >
      <div className="flex flex-col gap-3 mt-[20px]">
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="bordered"
              color="primary"
              className="capitalize max-w-full w-min"
            >
              Select Services
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            className="w-[300px] max-h-[300px] overflow-y-auto scrollbox"
            aria-label="Multiple selection example"
            variant="flat"
            closeOnSelect={false}
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            // @ts-ignore
            onSelectionChange={onSelectionChange}
          >
            {additionalServices.map((service) => (
              <DropdownItem
                key={service.id}
                description={service.description}
                endContent={`${service.price}€`}
              >
                {service.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <Button
          variant="light"
          color="secondary"
          className="max-w-full w-min"
          onClick={() => setSelectedKeys(new Set([]))}
        >
          Clear Selection
        </Button>

        {selectedValue && (
          <>
            <Input
              isReadOnly
              label={"Selected Services"}
              variant="bordered"
              value={selectedValue}
              className="mt-3"
            />
            <Input
              isReadOnly
              label={"Total Price"}
              variant="bordered"
              value={`${servicesPrice} €`}
              className="w-1/2"
            />
          </>
        )}
      </div>
    </AnimatedFormWrapper>
  );
};

export default AdditionalServicesForm;
