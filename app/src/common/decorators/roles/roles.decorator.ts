import { SetMetadata } from '@nestjs/common';

// Custom decorator to extract the current user or specific properties from the user object in request handlers.
// only add the metadata key and values
export const Roles = (...args: string[]) => SetMetadata('roles', args);
