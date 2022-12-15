import * as moment from "moment";
import { Timestamp } from "src/app/firebase";

export const parseToMoment = (input: string | Date | Timestamp | number | moment.Moment): moment.Moment => {
  if (typeof input === 'object' && !(input instanceof Timestamp)) {
    const inputAsAny: any = input;
    if (Math.abs(inputAsAny?.seconds) < 1) {
      return null;
    }

    if (inputAsAny.seconds) {
      input = new Date(inputAsAny.seconds * 1000);
    } else {
      // eslint-disable-next-line no-underscore-dangle
      input = new Date(inputAsAny._seconds * 1000);
    }
  }

  if (typeof (input) === 'string') {
    return moment(input, 'YYYY-MM-DD', true);
  } else if (input instanceof Timestamp) {
    return moment(input.seconds * 1000);
  } else if (input instanceof Date) {
    return moment(input);
  } else if (typeof (input) === 'number') {
    return moment(input);
  } else if (moment(input).isValid()) {
    return input;
  }
};