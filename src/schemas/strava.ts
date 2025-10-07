import { z } from "zod";

/**
 * Zod schemas for Strava API responses
 * Provides runtime validation and type safety
 */

export const activityStreamSchema = z.object({
  data: z.union([
    z.array(z.number()),
    z.array(z.tuple([z.number(), z.number()])),
    z.array(z.boolean()), // Moving stream contains booleans
  ]),
  original_size: z.number(),
  resolution: z.string(),
  series_type: z.string(),
  type: z.string().optional(), // Type field may be missing in some responses
});

export const activityStreamsSchema = z.object({
  altitude: activityStreamSchema.optional(),
  cadence: activityStreamSchema.optional(),
  distance: activityStreamSchema.optional(),
  grade_smooth: activityStreamSchema.optional(),
  heartrate: activityStreamSchema.optional(),
  latlng: activityStreamSchema.optional(),
  moving: activityStreamSchema.optional(),
  temp: activityStreamSchema.optional(),
  time: activityStreamSchema.optional(),
  velocity_smooth: activityStreamSchema.optional(),
  watts: activityStreamSchema.optional(),
});

export const activitySchema = z
  .object({
    address: z
      .object({
        country: z.string().optional(),
        state: z.string().optional(),
      })
      .optional(),
    id: z.number(),
    name: z.string(),
    start_date_local: z.string(),
    start_latlng: z
      .any()
      .optional()
      .transform((val) => {
        // Handle null, undefined, or empty array
        if (!val || (Array.isArray(val) && val.length === 0)) return null;
        // Handle tuple format [lat, lng]
        if (Array.isArray(val) && val.length === 2) {
          return [val[0], val[1]] as [number, number];
        }
        return null;
      }),
  })
  .passthrough();

export const activitiesArraySchema = z.array(activitySchema);

// Type inference from schemas
export type ActivityStreamSchema = z.infer<typeof activityStreamSchema>;
export type ActivityStreamsSchema = z.infer<typeof activityStreamsSchema>;
export type ActivitySchema = z.infer<typeof activitySchema>;
