import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, storage } from './firebase';
import { updateProfile } from 'firebase/auth';

export const uploadTempAvatar = async (avatar: File) => {
  const tempRef = ref(storage, 'avatar/temp/image');

  try {
    await uploadBytes(tempRef, avatar);
    const url = await getDownloadURL(tempRef);
    return url;
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const updateProfileToFirebase = async (avatar: File, displayName: string) => {
  const avatarRef = ref(storage, 'avatar/image');
  const user = auth.currentUser;

  if (user && (avatar !== null || avatar !== undefined)) {
    try {
      await uploadBytes(avatarRef, avatar);
      const photoURL = await getDownloadURL(avatarRef);
      await updateProfile(user, {
        displayName,
        photoURL,
      });

      return user;
    } catch (error) {
      console.log(error);
      throw Error('Error bro');
    }
  }
  throw Error('Avatar must not be null!');
};
