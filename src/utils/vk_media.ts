const sizes = [2560, 1280, 807, 604,130, 75];

interface IAttachment {
  type: string,
  photo: {
    id: number,
    album_id: number,
    owner_id: number,
    user_id: number,
    photo_75: string,
    photo_130: string,
    photo_604: string,
    photo_807: string,
    photo_1280: string,
    photo_2560: string,
    width: number,
    height: number,
    text: string,
    date: number,
    access_key: string,
  }
}

export const getLargestThumb = (att: IAttachment, max_size: number = 807) => {
  const candidate = sizes.find(size => size <= max_size && att.photo[`photo_${size}`]);

  return (candidate && att.photo[`photo_${candidate}`] || '');
};
