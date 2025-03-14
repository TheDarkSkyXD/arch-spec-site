# Logo Placement Guide

To make the logos work properly with the application, please save the shared logo images as follows:

1. Save the standard logo as `frontend/public/arch-spec-logo.png`
2. Save the horizontal logo as `frontend/public/arch-spec-logo-horizontal.png`

These files are referenced in the code and need to be in the specified locations for the application to display them correctly.

## For Development Purposes

If you're running the application in development mode and the logos aren't loading, you may need to adjust the paths in the `Logo.tsx` component to include the base path:

```typescript
// In frontend/src/components/ui/Logo.tsx
// Change the image paths from:
src="/arch-spec-logo.png"
// to:
src={import.meta.env.BASE_URL + "arch-spec-logo.png"}
```

This ensures the logos are properly loaded regardless of the base URL configuration.
