import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { FileUploadZone } from '@/components/common/FileUploadZone';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/ui/card';

import { useAuth } from '@/hooks/useAuth';
import { useUploadContent } from '@/hooks/useContent';
import UploadFormFields from '@/components/teacher/UploadFormFields';

const uploadSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must be under 100 characters'),
    subject: z.string().min(1, 'Please select a subject'),
    description: z
      .string()
      .max(500, 'Max 500 characters')
      .optional()
      .or(z.literal('')),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    rotationDuration: z
      .union([z.number().min(5, 'Minimum 5 seconds'), z.nan()])
      .optional(),
  })
  .refine(
    (data) =>
      !data.startTime ||
      !data.endTime ||
      new Date(data.endTime) > new Date(data.startTime),
    { message: 'End time must be after start time', path: ['endTime'] }
  );

const toLocalDatetime = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const UploadContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutateAsync, isPending } = useUploadContent();

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const defaultStart = (() => {
    const d = new Date();
    d.setHours(d.getHours() + 1, 0, 0, 0);
    return toLocalDatetime(d);
  })();
  const defaultEnd = (() => {
    const d = new Date();
    d.setHours(d.getHours() + 3, 0, 0, 0);
    return toLocalDatetime(d);
  })();

  const formMethods = useForm({
    defaultValues: {
      title: '',
      subject: '',
      description: '',
      startTime: defaultStart,
      endTime: defaultEnd,
      rotationDuration: undefined,
    },
    mode: 'onTouched',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = formMethods;

  // Cleanup object URL on unmount
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  const minStartTime = new Date().toISOString().slice(0, 16);

  const handleFileSelect = (file, error) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setFileError(error);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setFileError(null);
    setPreviewUrl(null);
  };

  const onValid = async (data) => {
    if (!selectedFile) {
      setFileError('Please select an image file');
      return;
    }
    const parsed = uploadSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    // Read file as base64 so the mock store keeps a durable URL
    const fileUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(selectedFile);
    });

    const payload = {
      ...parsed.data,
      startTime: new Date(parsed.data.startTime).toISOString(),
      endTime: new Date(parsed.data.endTime).toISOString(),
      rotationDuration: Number.isFinite(parsed.data.rotationDuration)
        ? parsed.data.rotationDuration
        : null,
      teacherId: user?.teacherId || user?.id,
      teacherName: user?.name,
      fileUrl,
    };

    try {
      await mutateAsync(payload);
      toast.success('Content uploaded successfully!');
      reset();
      handleRemoveFile();
      setTimeout(() => navigate('/teacher/my-content'), 800);
    } catch (err) {
      toast.error(err?.message || 'Upload failed. Please try again.');
    }
  };

  const subjectVal = watch('subject');
  const titleVal = watch('title');

  return (
    <div>
      <PageHeader
        title="Upload Content"
        subtitle="Share educational material with students"
      />

      <form onSubmit={handleSubmit(onValid)} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UploadFormFields
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            minStartTime={minStartTime}
          />

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Content Image <span className="text-red-500">*</span>
              </label>
              <FileUploadZone
                onFileSelect={handleFileSelect}
                currentFile={selectedFile}
                error={fileError}
                onRemove={handleRemoveFile}
              />
            </div>

            <Card className="p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Preview
              </h4>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {titleVal || 'Untitled content'}
              </p>
              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                {subjectVal || 'No subject selected'}
              </p>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-3 max-h-48 w-full rounded object-contain bg-gray-50 dark:bg-gray-700/50"
                />
              ) : (
                <div className="mt-3 flex h-32 items-center justify-center rounded bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-400 dark:text-gray-500">
                  Image preview will appear here
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/teacher/my-content')}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Submit Content'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadContent;
