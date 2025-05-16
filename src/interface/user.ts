

declare module 'express' {
  interface AuthenticatedRequest  {
    user?: {
      companyGuid: string;
      guid?: string;
      name?: string;
    };
  }
}