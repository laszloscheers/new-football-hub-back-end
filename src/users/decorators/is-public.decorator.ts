import { SetMetadata } from '@nestjs/common';

// Creating a decorator to mark routes as public
export const IsPublic = () => SetMetadata('isPublic', true);
