import * as t from "io-ts";

export const StartDaemonBody = t.type({
  month: t.number,
  date: t.number,
  hours: t.array(t.number),
});
export type StartDaemonBodyType = t.TypeOf<typeof StartDaemonBody>;
