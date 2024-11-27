import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import AnimatedFormWrapper from "../AnimatedFormWrapper";
import { Button, Input } from "@nextui-org/react";
import { Service } from "@/types";

interface AdditionalServicesFormProps {
  selectedServices?: Service[];
  services: Service[];
  onAdditionalServicesUpdate: (data: Service[]) => void;
}

const AdditionalServicesForm = ({
  selectedServices,
  services: additionalServices,
  onAdditionalServicesUpdate,
}: AdditionalServicesFormProps) => {
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    new Set<string>(selectedServices?.map((service) => service.id.toString()))
  );

  const selectedValue = React.useMemo(() => {
    if (selectedKeys.size === 0) return "";

    const selectedKeysArray = Array.from(selectedKeys);

    const values = additionalServices
      .filter((service) => selectedKeysArray.includes(service.id.toString()))
      .map((service) => service.title);

    return values.join(", ").replaceAll("_", " ");
  }, [selectedKeys, additionalServices]);

  const servicesPrice = React.useMemo(() => {
    if (selectedKeys.size === 0) return 0;

    const selectedKeysArray = Array.from(selectedKeys);

    const values = additionalServices
      .filter((service) => selectedKeysArray.includes(service.id.toString()))
      .map((service) => service.price);

    return values.reduce((a, b) => a + b, 0);
  }, [selectedKeys, additionalServices]);

  const onSelectionChange = (keys: Set<string>) => {
    setSelectedKeys(keys);

    const selectedKeysArray = Array.from(keys);
    const selectedServices = additionalServices.filter((service) =>
      selectedKeysArray.includes(service.id.toString())
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
            onSelectionChange={(keys) => onSelectionChange(keys as Set<string>)}
          >
            {additionalServices.map((service) => (
              <DropdownItem
                key={service.id}
                description={service.description}
                endContent={`${service.price / 100}€`}
              >
                {service.title}
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
              value={`${servicesPrice / 100} €`}
              className="w-1/2"
            />
          </>
        )}
      </div>
    </AnimatedFormWrapper>
  );
};

export default AdditionalServicesForm;
