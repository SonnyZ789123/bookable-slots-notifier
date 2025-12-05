export type OutdoorField = {
  _tag: "outdoor";
  fieldNumber: 1 | 2 | 3 | 4 | 5;
  startDate: Date;
};

export type IndoorField = {
  _tag: "indoor";
  fieldNumber: 1 | 2 | 3;
  startDate: Date;
};
