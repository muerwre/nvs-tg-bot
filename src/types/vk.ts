export interface IAttachment {
  type: string;
  photo?: {
    id: number;
    album_id: number;
    owner_id: number;
    user_id: number;
    photo_75?: string;
    photo_130?: string;
    photo_604?: string;
    photo_807?: string;
    photo_1280?: string;
    photo_2560?: string;
    width: number;
    height: number;
    text: string;
    date: number;
    access_key: string;
  };
  link?: {
    url: string;
    title: string;
    caption: string;
    description: string;
    is_external: number;
    photo: {
      id: number;
      album_id: number;
      owner_id: number;
      user_id: number;
      photo_75: string;
      photo_130: string;
      photo_604: string;
      photo_807: string;
      photo_1280: string;
      photo_2560: string;
      width: number;
      height: number;
      text: string;
      date: number;
    };
    button: {
      title: string;
      url: string;
    };
  };
}

export interface INewPostObject {
  type: string;
  object: {
    id: number;
    from_id: number;
    owner_id: number;
    signer_id: number;
    date: number;
    marked_as_ads: number;
    post_type: string;
    text: string;
    can_edit: number;
    created_by: number;
    can_delete: number;
    comments: {
      count: number;
    };
    attachments: IAttachment[];
  };
  group_id: number;
  secret: string;
}
