import { z } from 'zod';
import { SettingsValueType } from '../../../shared/enums';

export const CreateSettingsSchema = z
  .object({
    name: z.string().min(1),
    valueType: z.enum(SettingsValueType),
    value: z.any(),
    options: z.array(z.any()).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      [
        SettingsValueType.Enum,
        SettingsValueType.Options,
        SettingsValueType.StringArray,
        SettingsValueType.NumberArray,
        SettingsValueType.ObjectArray,
      ].includes(data.valueType)
    ) {
      if (!Array.isArray(data.options) || data.options.length === 0) {
        ctx.addIssue({ code: 'custom', message: 'Options are required for the selected valueType' });
      }
    }

    switch (data.valueType) {
      case SettingsValueType.Number:
        if (typeof data.value !== 'number') {
          ctx.addIssue({ code: 'custom', message: 'Value must be a number' });
        }
        break;
      case SettingsValueType.String:
        if (typeof data.value !== 'string') {
          ctx.addIssue({ code: 'custom', message: 'Value must be a string' });
        }
        break;
      case SettingsValueType.Boolean:
        if (typeof data.value !== 'boolean') {
          ctx.addIssue({ code: 'custom', message: 'Value must be a boolean' });
        }
        break;
      case SettingsValueType.Enum:
      case SettingsValueType.Options:
        if (!data.options?.includes(data.value)) {
          ctx.addIssue({ code: 'custom', message: 'Value must be one of the options' });
        }
        break;
      case SettingsValueType.StringArray:
      case SettingsValueType.NumberArray:
      case SettingsValueType.ObjectArray:
        if (!data.options?.includes(data.value)) {
          ctx.addIssue({ code: 'custom', message: 'Value must be one of the options' });
        }
        break;
      case SettingsValueType.Object:
        if (typeof data.value !== 'object' || data.value === null || Array.isArray(data.value)) {
          ctx.addIssue({ code: 'custom', message: 'Value must be an object' });
        }
        break;
    }
  });

export const UpdateSettingsSchema = z
  .object({
    valueType: z.enum(SettingsValueType).optional(),
    value: z.any().optional(),
    options: z.array(z.any()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.valueType) {
      if (data.value === undefined) {
        ctx.addIssue({
          code: 'custom',
          message: 'Value is required when changing valueType',
        });
      } else {
        if (
          [
            SettingsValueType.Enum,
            SettingsValueType.Options,
            SettingsValueType.StringArray,
            SettingsValueType.NumberArray,
            SettingsValueType.ObjectArray,
          ].includes(data.valueType)
        ) {
          if (!Array.isArray(data.options) || data.options.length === 0) {
            ctx.addIssue({ code: 'custom', message: 'Options are required for the selected valueType' });
          }
        }

        switch (data.valueType) {
          case SettingsValueType.Number:
            if (typeof data.value !== 'number') {
              ctx.addIssue({ code: 'custom', message: 'Value must be a number' });
            }
            break;
          case SettingsValueType.String:
            if (typeof data.value !== 'string') {
              ctx.addIssue({ code: 'custom', message: 'Value must be a string' });
            }
            break;
          case SettingsValueType.Boolean:
            if (typeof data.value !== 'boolean') {
              ctx.addIssue({ code: 'custom', message: 'Value must be a boolean' });
            }
            break;
          case SettingsValueType.Enum:
          case SettingsValueType.Options:
            if (!data.options?.includes(data.value)) {
              ctx.addIssue({ code: 'custom', message: 'Value must be one of the options' });
            }
            break;
          case SettingsValueType.StringArray:
          case SettingsValueType.NumberArray:
          case SettingsValueType.ObjectArray:
            if (!data.options?.includes(data.value)) {
              ctx.addIssue({ code: 'custom', message: 'Value must be one of the options' });
            }
            break;
          case SettingsValueType.Object:
            if (typeof data.value !== 'object' || data.value === null || Array.isArray(data.value)) {
              ctx.addIssue({ code: 'custom', message: 'Value must be an object' });
            }
            break;
        }
      }
    }
  });

export type CreateSettingsDto = z.infer<typeof CreateSettingsSchema>;
export type UpdateSettingsDto = z.infer<typeof UpdateSettingsSchema>;
