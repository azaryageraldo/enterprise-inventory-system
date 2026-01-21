# Shadcn/UI Components - Installed Components

## Core UI Components (22 total)

### Form Components

- `button` - Buttons with variants (default, destructive, outline, secondary, ghost, link)
- `input` - Text input fields
- `label` - Form labels
- `form` - Form wrapper with React Hook Form integration
- `select` - Dropdown select
- `textarea` - Multi-line text input
- `checkbox` - Checkboxes
- `calendar` - Date picker calendar
- `command` - Command palette/search

### Data Display

- `table` - Data tables
- `card` - Content cards
- `badge` - Status badges
- `avatar` - User avatars
- `separator` - Visual separators

### Navigation

- `tabs` - Tab navigation
- `dropdown-menu` - Dropdown menus
- `sheet` - Slide-out panels (mobile drawer)

### Feedback

- `alert` - Alert messages
- `dialog` - Modal dialogs
- `alert-dialog` - Confirmation dialogs
- `sonner` - Toast notifications (replaces deprecated toast)
- `popover` - Popover tooltips

## Custom Components

### StatusBadge

Location: `src/components/StatusBadge.tsx`

- Color-coded status badges for PENDING, APPROVED, REJECTED, PAID, ACTIVE, INACTIVE

### PageHeader

Location: `src/components/PageHeader.tsx`

- Consistent page headers with title, description, and action buttons

### DataTable

Location: `src/components/DataTable.tsx`

- Reusable table component with generic typing
- Supports custom column rendering
- Empty state handling

## Usage Example

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";

function MyPage() {
  return (
    <div>
      <PageHeader
        title="Inventory Management"
        description="Manage your inventory items"
      >
        <Button>Add Item</Button>
      </PageHeader>

      <Card>
        <StatusBadge status="APPROVED" />
      </Card>
    </div>
  );
}
```

## Theme Configuration

The project uses CSS variables for theming with support for light and dark modes.
Variables are defined in `src/index.css` and can be customized in `tailwind.config.js`.
