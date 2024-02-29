'use client';
import { Separator } from '@/components/ui/separator';
import { useSignIn } from '@/context/SignInProvider';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfileToFirebase, uploadTempAvatar } from '@/lib/firebase/profileService';
import { showNotify } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { showAlert } from '@/components/Alert';
import { useAlert } from '@/context/AlertProvider';

const saveAlert = {
  title: 'Save Changes',
  description: 'Save changes to update your profile information.',
  cancel: 'Cancel',
  continue: 'Save',
};

const discardAlert = {
  title: 'Discard Changes',
  description: 'Are you sure to discard this changes?',
  cancel: 'Cancel',
  continue: 'Yes',
};

const formSchema = z.object({
  displayName: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  avatar: z.instanceof(File),
});

const Settings = () => {
  const router = useRouter();
  const { user } = useSignIn();
  const { showAlertHandle } = useAlert();
  const [imgUrl, setImgUrl] = useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: user?.displayName || '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const avatarWatch: File = form.watch('avatar');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await showAlert(saveAlert, 'save', showAlertHandle);

    try {
      await updateProfileToFirebase(values.avatar, values.displayName);
      router.refresh();
      router.push('/dashboard');
      showNotify({
        type: 'success',
        message: 'Profile updated!',
      });
    } catch (error) {
      router.push('/dashboard');
      showNotify({
        type: 'error',
        message: 'Error update profile!',
      });
    }
  };

  // Function for discard button click and restore previous value on input form
  const handleDiscardClick = async () => {
    showAlert(discardAlert, 'discard', showAlertHandle)
      .then(() => {
        form.reset({
          displayName: user?.displayName || '',
          avatar: undefined,
        });
        setImgUrl(user?.photoURL || '');
      })
      .catch();
  };

  // Change avatar preview when upload image
  useEffect(() => {
    if (avatarWatch) {
      uploadTempAvatar(avatarWatch)
        .then((url) => setImgUrl(url))
        .catch((err) => setImgUrl(err));
    }
  }, [avatarWatch]);

  // Set initial input value form with current user profile
  useEffect(() => {
    form.setValue('displayName', user?.displayName || '');
    setImgUrl(user?.photoURL || '');
  }, [user, form]);

  return (
    <Card className='max-w-3xl'>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold'>Settings</CardTitle>
        <CardDescription>Change your profile settings here.</CardDescription>
      </CardHeader>
      <Separator
        orientation='horizontal'
        className='mt-1 mb-6'
      />
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <FormField
              control={control}
              name='avatar'
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <Label>Preview</Label>
                  <Image
                    src={imgUrl}
                    width={200}
                    height={200}
                    className='w-[150px] h-[150px] object-none mx-auto rounded-full overflow-hidden shadow-lg'
                    alt='profile image'
                  />
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='avatar'
                      type='file'
                      accept='image/png,image/jpeg'
                      onChange={(event) => {
                        event.target.files && onChange(event?.target?.files[0]);
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>This is your public avatar.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='displayName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Display Name'
                      type='text'
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-3 justify-end'>
              <Button
                className='bg-red-500 hover:bg-red-600 text-white'
                disabled={isSubmitting}
                onClick={handleDiscardClick}
                type='reset'
              >
                Discard
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Wait' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Settings;
