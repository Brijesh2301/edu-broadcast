import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Select, SelectItem } from '@/components/ui/select';
import { SUBJECTS } from '@/utils/constants';

/**
 * Renders the left column of the upload form (text/select/datetime fields).
 * Receives RHF helpers from the parent — no internal form state.
 */
const UploadFormFields = ({
  register,
  errors,
  watch,
  setValue,
  minStartTime,
}) => {
  const titleLen = (watch('title') || '').length;
  const descLen = (watch('description') || '').length;
  const subjectVal = watch('subject');

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="mb-1.5 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          <span>
            Title <span className="text-red-500">*</span>
          </span>
          <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
            {titleLen}/100
          </span>
        </label>
        <Input
          id="title"
          placeholder="e.g. Introduction to Algebra"
          maxLength={100}
          error={errors.title?.message}
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters',
            },
            maxLength: {
              value: 100,
              message: 'Title must be under 100 characters',
            },
          })}
        />
      
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Subject <span className="text-red-500">*</span>
        </label>
        <Select
          id="subject"
          placeholder="Select a subject"
          value={subjectVal}
          onValueChange={(v) =>
            setValue('subject', v, { shouldValidate: true, shouldTouch: true })
          }
          error={!!errors.subject}
        >
          {SUBJECTS.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </Select>
        <input type="hidden" {...register('subject')} />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="mb-1.5 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          <span>Description</span>
          <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
            {descLen}/500
          </span>
        </label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Brief overview of the content"
          maxLength={500}
          error={errors.description?.message}
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Start time */}
      <div>
        <label
          htmlFor="startTime"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Start Time <span className="text-red-500">*</span>
        </label>
        <Input
          id="startTime"
          type="datetime-local"
          min={minStartTime}
          error={errors.startTime?.message}
          {...register('startTime', { required: 'Start time is required' })}
        />
       
      </div>

      {/* End time */}
      <div>
        <label
          htmlFor="endTime"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          End Time <span className="text-red-500">*</span>
        </label>
        <Input
          id="endTime"
          type="datetime-local"
          min={minStartTime}
          error={errors.endTime?.message}
          {...register('endTime', { required: 'End time is required' })}
        />
       
      </div>

      {/* Rotation duration */}
      <div>
        <label
          htmlFor="rotationDuration"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Rotation Duration (seconds)
        </label>
        <p className="mb-1.5 text-xs text-gray-500 dark:text-gray-400">
          How long each slide displays (optional, min 5 seconds)
        </p>
        <Input
          id="rotationDuration"
          type="number"
          min="5"
          step="1"
          placeholder="30"
          error={errors.rotationDuration?.message}
          {...register('rotationDuration', {
            valueAsNumber: true,
            min: { value: 5, message: 'Minimum 5 seconds' },
          })}
        />
        {errors.rotationDuration && (
          <p className="mt-1 text-sm text-red-500">
            {errors.rotationDuration.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadFormFields;
