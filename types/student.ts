export interface Student {
  id: string;
  name: string;
  class: string;
  roll: string;
  mobile: string;
}

export type StudentInput = Omit<Student, 'id'>;
