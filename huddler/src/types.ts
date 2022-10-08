export interface User {
  name: string;
  email: string;
  createdOn: number;
  id?: number;
  password?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  dateOfBirth?: Date;
}

export interface Huddle {
  name: string;
  createdOn: Date;
  when: number;
  description: string;
  authorId: number;
  longitue: number;
  latitude: number;
  id?: number;
  images?: string[];
}
