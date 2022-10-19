export const getUploadUrl = async () => {
  return await fetch(`${process.env.NEXT_PUBLIC_AWS_UPLOAD_IMAGE}`, {
    method: 'GET',
    mode: 'cors',
  })
    .then((res) => res.json())
    .then((uploadURL) => {
      return uploadURL;
    })
    .catch((err) => console.log(err));
};
// Return: upload Url and filename

export const uploadImgToS3 = async (uploadUrlForS3: string, file: File | {}) => {
  return await fetch(uploadUrlForS3, {
    method: 'PUT',
    mode: 'cors',
          //@ts-ignore
    body: file,
  })
    .then((res) => res.text())
    .catch((err) => console.log(err));
};

export const deleteOldImg = async (image: string) => {
  try {
    const deleteImage = await fetch(`${process.env.NEXT_PUBLIC_AWS_DELETE_IMAGE}=${image}`, {
      method: 'GET',
      mode: 'cors',
    })
    console.log('Deleted img with file name :', deleteImage);
  } catch (error) {
    console.log('ERROR deleting old Image in S3:', error)
  }
}