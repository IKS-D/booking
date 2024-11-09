import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { differenceInDays } from "date-fns";
import AnimatedFormWrapper from "../AnimatedFormWrapper";
import { DateRange } from "react-day-picker";

type SelectDateRangeFormProps = {
  onDateRangeUpdate: (data: DateRange) => void;
  startDate: Date | undefined;
  endDate: Date | undefined;
};

const SelectDateRangeForm = ({
  onDateRangeUpdate,
  startDate,
  endDate,
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
            from: startDate,
            to: endDate
          }}
          onRangeChange={(dateRange) => {
            onDateRangeUpdate(dateRange);
          }}
        />
        {startDate && endDate && (
          <p className="text-md pt-2 pl-1">
            Your reservation will be for{" "}
            {differenceInDays(endDate, startDate)} days.
          </p>
        )}
      </div>
    </AnimatedFormWrapper>
  );
};

export default SelectDateRangeForm;
