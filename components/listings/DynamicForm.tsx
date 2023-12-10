import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { ServiceInput } from "@/actions/listings/listingsQueries";

interface DynamicFormProps {
  onSubmit: (services: ServiceInput[]) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ onSubmit }) => {
  const [services, setServices] = useState<ServiceInput[]>([
    { title: "", description: "", price: 0 },
  ]);

  const handleInputChange = (
    index: number,
    field: keyof ServiceInput,
    value: string | number
  ) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setServices(updatedServices);
  };

  const addService = () => {
    setServices([...services, { title: "", description: "", price: 0 }]);
  };

  const removeService = (index: number) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(services);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {services.map((service, index) => (
        <div key={index} className="flex space-x-4 items-center">
          <label className="flex-grow">
            <Input
              type="text"
              placeholder="Name of additional service"
              value={service.title !== "" ? service.title : ""}
              onChange={(e) =>
                handleInputChange(index, "title", e.target.value)
              }
              height={20} // Set the height to be three times lower
            />
          </label>

          <label className="flex-grow">
            <Input
              type="text"
              placeholder="Short description"
              value={service.description !== "" ? service.description : ""}
              onChange={(e) =>
                handleInputChange(index, "description", e.target.value)
              }
              height={20} // Set the height to be three times lower
            />
          </label>

          <label className="flex-grow">
            <Input
              type="number"
              placeholder="Price for one night"
              value={service.price !== 0 ? service.price.toString() : ""}
              onChange={(e) =>
                handleInputChange(index, "price", parseFloat(e.target.value))
              }
              className="placeholder-gray-500" // Apply the placeholder styling class here
            />
          </label>

          {index === services.length - 1 && (
            <div>
              <Button type="button" variant="ghost" onClick={addService}>
                Add
              </Button>
            </div>
          )}

          {index > 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => removeService(index)}
            >
              Remove
            </Button>
          )}
        </div>
      ))}

      <Button type="submit" variant="ghost">
        Submit
      </Button>
    </form>
  );
};

export default DynamicForm;
