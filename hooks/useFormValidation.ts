'use client';

import { useState, useCallback } from 'react';
import type { ZodType } from 'zod';
import { genericProfileFormSchema } from '@/lib/validation/schemas';
import { validateField, validateWithSchema } from '@/lib/validation/validate';

/** Values a form field can hold. */
type FormValue = string | number | boolean | null | undefined;
type FormValues = Record<string, FormValue>;

interface UseFormValidationProps {
  /** Zod schema used for validation. Defaults to the generic profile form schema. */
  schema?: ZodType<any, any, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
}

interface UseFormValidationReturn {
  values: FormValues;
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleChange: (name: string, value: FormValue) => void;
  handleBlur: (name: string) => Promise<void>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldValue: (name: string, value: FormValue) => void;
}

export function useFormValidation({
  schema = genericProfileFormSchema,
  onSubmit,
}: UseFormValidationProps): UseFormValidationReturn {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (name: string, value: FormValue) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    async (name: string) => {
      const message = validateField(schema, values, name);
      setErrors((prev) => {
        const next = { ...prev };
        if (message) next[name] = message;
        else delete next[name];
        return next;
      });
    },
    [schema, values]
  );

  const setFieldValue = useCallback((name: string, value: FormValue) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const result = validateWithSchema(schema, values);
      if (!result.success) {
        setErrors(result.errors);
        return;
      }
      setErrors({});

      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [schema, values, onSubmit]
  );

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  };
}
