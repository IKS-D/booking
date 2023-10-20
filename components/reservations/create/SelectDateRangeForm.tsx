import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { differenceInDays } from "date-fns";
import AnimatedFormWrapper from "../AnimatedFormWrapper";
import { DateRange } from "react-day-picker";

type SelectDateRangeFormProps = {
  onDateRangeUpdate: (data: DateRange) => void;
  formData: any;
};

const SelectDateRangeForm = ({
  onDateRangeUpdate,
  formData,
}: SelectDateRangeFormProps) => {
  return (
    <AnimatedFormWrapper
      key="step1"
      title={"Select dates"}
      description={"Select the dates for your reservation"}
    >
      <div className="mt-[20px]">
        <DatePickerWithRange
          range={{
            from: formData.start_date,
            to: formData.end_date,
          }}
          onRangeChange={(dateRange) => {
            onDateRangeUpdate(dateRange);
          }}
        />
        {formData.start_date && formData.end_date && (
          <p className="text-md pt-2 pl-1">
            Your reservation will be for{" "}
            {differenceInDays(formData.end_date, formData.start_date)} days.
          </p>
        )}
      </div>
    </AnimatedFormWrapper>
  );
};

export default SelectDateRangeForm;
