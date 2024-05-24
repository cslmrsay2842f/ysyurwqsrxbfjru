import { z } from "zod";

export const sponsorRequestSchema = z.object({
  address: z.string(),
});

export type SponsorRequest = z.infer<typeof sponsorRequestSchema>;

export interface sponsorResponse {
  result: string;
}
