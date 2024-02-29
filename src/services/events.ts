import moment from "moment";

import type { Event } from "@/services/online";

export function sortEvents(courses: undefined | null | Event[]): Event[] {
  if (!courses) return [];
  return courses
    .sort((a, b) => {
      let aDate = new Date(a.date),
        bDate = new Date(b.date);
      if (aDate > bDate) return 1;
      if (aDate < bDate) return -1;
      return 0;
    })
    .filter((c) => moment(c.date).isBefore(moment().add(7, "week")));
}
