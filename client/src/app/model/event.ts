import { Room } from "./room";
import { User } from "./user";

export class Event {
  id: number;
  title: string;
  dateStart: Date;
  dateEnd: Date;
  room: Room;
  users: User[];
}