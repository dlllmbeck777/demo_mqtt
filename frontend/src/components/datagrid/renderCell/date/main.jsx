import { dateFormatDDMMYYHHMM } from "../../../../services/utils/dateFormatter";
const date = ({ value }) => {
  console.log(value);
  try {
    if (value)
      return dateFormatDDMMYYHHMM(new Date(parseInt(value) + 18000000));
    return "";
  } catch {
    return value;
  }
};

export default date;
