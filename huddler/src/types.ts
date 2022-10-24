import { StaticImageData } from 'next/image';

export interface Category {
  id?: number;
  name: string;
}
export interface User {
  username?: string;
  email?: string;
  createdOn?: number;
  id?: number;
  first_name?: string;
  last_name?: string;
  image?: File | File[] | string | string[] | StaticImageData;
  date_of_birth?: string;
  interests?: Category[];
  default_longitude?: number;
  default_latitude?: number;
  description?: string;
  categories?: Category[];
  aws_id: string;
}

export interface Huddle {
  name: string;
  date_of_creation: number;
  day_time: string;
  address: string;
  description: string;
  fk_author_id: string;
  longitude: number;
  latitude: number;
  id?: number;
  image: string;
  link: string;
  fk_huddle_id?: number;
}

export interface ChatMsg {
  fk_huddle_id: number;
  message: string;
  username: string;
  timezone?: string;
}

