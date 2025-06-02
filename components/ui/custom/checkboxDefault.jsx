import { useState } from "react";

const CheckboxDefault = ({ title, name, checked}) => {
    const [isChecked, setIsChecked] = useState(!checked == false);

  return (
    <div>
      <label className="flex cursor-pointer select-none items-center text-sm font-medium text-black dark:text-white">
      {title}
        <div className="relative pl-4">
          <input
            type="checkbox"
            name={name}
            checked={isChecked}
            className="sr-only"
            value={isChecked}
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />
          <div className={`box mr-4 flex h-5 w-5 items-center justify-center rounded-full border border-primary ${isChecked && "!border-6" }`}>
            <span className="h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent"></span>
          </div>
        </div>
        {isChecked ? "Yes" : "No"}
      </label>
    </div>
  );
};

export default CheckboxDefault;