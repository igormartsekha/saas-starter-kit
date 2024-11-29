import toast from 'react-hot-toast';
import { useTranslation } from 'next-i18next';
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUpCircleIcon } from '@heroicons/react/24/outline';

import type { ApiResponse } from 'types';
import type { User } from '@prisma/client';
import { defaultHeaders } from '@/lib/common';
import { Box, Typography, TextField, Button, Avatar, Divider, Card, CardContent } from '@mui/material';


const UploadAvatar = ({ user }: { user: Partial<User> }) => {
  const { t } = useTranslation('common');
  const [dragActive, setDragActive] = useState(false);
  const [image, setImage] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setImage(
      user.image ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
    );
  }, [user]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files && e.dataTransfer.files[0];

    if (file) {
      onAvatarUpload(file);
    }
  };

  const onChangePicture = useCallback((e) => {
    const file = e.target.files[0];

    if (file) {
      onAvatarUpload(file);
    }
  }, []);

  const onAvatarUpload = (file: File) => {
    if (file.size / 1024 / 1024 > 2) {
      toast.error('File size too big (max 2MB)');
      return;
    }

    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      toast.error('File type not supported (.png or .jpg only)');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify({ image }),
    });

    setLoading(false);

    if (!response.ok) {
      const json = (await response.json()) as ApiResponse;
      toast.error(json.error.message);
      return;
    }

    toast.success(t('successfully-updated'));
  };

  function isDisabled() {
    return !image || image === user.image || loading
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              {t('avatar')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {t('custom-avatar')} <br />
              {t('avatar-type')}
            </Typography>
            <Box>
              <div>
                <label
                  htmlFor="image"
                  className="group relative mt-1 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border border-gray-300 bg-white transition-all hover:bg-gray-50"
                >
                  <div
                    className="absolute z-[5] h-full w-full rounded-full"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(true);
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(false);
                    }}
                    onDrop={onDrop}
                  />
                  <div
                    className={`${dragActive
                      ? 'cursor-copy border-2 border-black bg-gray-50 opacity-100'
                      : ''
                      } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-full bg-white transition-all ${image
                        ? 'opacity-0 group-hover:opacity-100'
                        : 'group-hover:bg-gray-50'
                      }`}
                  >
                    <ArrowUpCircleIcon
                      className={`${dragActive ? 'scale-110' : 'scale-100'
                        } h-50 w-50 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
                    />
                  </div>
                  {image && (
                    <img
                      src={image}
                      alt={user.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  )}
                </label>
                <div className="mt-1 flex rounded-full shadow-sm">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={onChangePicture}
                  />
                </div>
              </div>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant={isDisabled() ? "outlined" : "contained"}
                color="primary"
                disabled={isDisabled()}
              >
                {t('save-changes')}
              </Button>
            </Box>
          </form></CardContent>
      </Card>
    </Box>
  )
};

export default UploadAvatar;
