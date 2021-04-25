import { INewPostObject } from "~/types/vk";

export const postErrorCatcher = (object: INewPostObject['object']) => error => {
  console.log(`[POST] ${object.id} catched error`);
  console.log(error);
}


