# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**GearGuard** is a comprehensive maintenance management system built with React 18, Vite, and Tailwind CSS. The application tracks company assets (machines, vehicles, computers) and manages maintenance requests through a full lifecycle from creation to completion/scrap.

## Development Commands

### Setup and Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Starts Vite dev server with hot reload. Default port is typically 5173.

### Production Build
```bash
npm run build
```
Builds optimized production bundle to `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## Core Architecture

### State Management Pattern
The application uses **React Context API** for global state management. All application state is centralized in `src/context/AppContext.jsx`:

- **Single Source of Truth**: `AppContext` exports `useApp()` hook that provides access to all data and methods
- **localStorage Persistence**: All data automatically syncs to browser localStorage with specific keys:
  - `gearguard_equipment` - Equipment/asset records
  - `gearguard_teams` - Maintenance teams and technicians
  - `gearguard_requests` - Maintenance requests
  - `gearguard_categories` - Equipment categories
  - `gearguard_workcenters` - Work center data
  - `gearguard_darkMode` - Theme preference

**Critical Pattern**: When modifying state, always use the context methods (`addEquipment`, `updateRequest`, etc.) rather than direct state manipulation. These methods handle ID generation, validation, and localStorage persistence.

### Data Flow Architecture

```
User Action → Page Component → useApp() Hook → Context Method → State Update → localStorage Sync → Re-render
```

**Auto-fill Logic**: When a maintenance request is created and equipment is selected:
1. Equipment category is auto-filled
2. Maintenance team is auto-filled from equipment record
3. Default technician is suggested from team members

**Scrap Logic**: When a request status changes to "Scrap":
1. The `updateRequest` method detects the status change
2. Automatically updates associated equipment status to "scrapped"
3. Records scrappedDate and scrappedReason on equipment

**Overdue Detection**: Requests are automatically marked as overdue when:
- Scheduled date is past current date
- Request status is not "Repaired" or "Scrap"

### Component Structure

- **Layout System**: `src/components/Layout.jsx` provides the shell with sidebar navigation, header, and dark mode toggle
- **Pages**: Each major feature has its own page component in `src/pages/`
  - `Dashboard.jsx` - Overview with key metrics
  - `Equipment.jsx` - Asset management with smart maintenance buttons
  - `EquipmentCategories.jsx` - Category management
  - `WorkCenters.jsx` - Work center configuration
  - `Teams.jsx` - Team and technician management
  - `KanbanBoard.jsx` - Drag-and-drop request management
  - `MaintenanceRequestForm.jsx` - Create/edit requests
  - `CalendarView.jsx` - Preventive maintenance scheduling
  - `Reports.jsx` - Analytics and charts

### Routing

React Router v6 is used. Routes are defined in `src/App.jsx`:
- Dynamic routes support: `/equipment/:id`, `/request/:id`
- Request form handles both new requests (`/request/new`) and editing existing ones

## Key Features & Implementation Notes

### Equipment Management
- Each equipment has a `status` field: `operational`, `maintenance`, `broken`, `scrapped`
- Equipment status should automatically update based on related maintenance requests
- Smart "Maintenance" button on equipment cards shows count of open requests and links to filtered Kanban view

### Maintenance Request Lifecycle
**Request Types**:
- `Corrective` - Unplanned repairs (breakdowns)
- `Preventive` - Planned maintenance (scheduled checkups)

**Status Flow**: `New` → `In Progress` → `Repaired` OR `Scrap`

**Priority Levels**: `High`, `Medium`, `Low`

### Kanban Board
- Uses `react-dnd` and `react-dnd-html5-backend` for drag-and-drop
- Technicians can only pick up requests assigned to their team
- Visual indicators for overdue requests (red styling)
- Filters by technician, priority, and asset type
- Grouping by equipment

### Calendar View
- Displays preventive maintenance requests on scheduled dates
- Click dates to create new scheduled maintenance
- Uses `date-fns` library for date manipulation

### Reports & Analytics
Built with `recharts` library. Charts include:
- Requests per Team (Bar Chart)
- Requests per Equipment Category (Bar Chart)
- Requests by Status (Pie Chart)
- Requests by Type (Pie Chart)
- Requests by Priority (Bar Chart)
- Equipment Status Distribution (Pie Chart)

**Important**: All charts must reactively update when underlying data changes. The charts read directly from context state.

### Work Centers
Work centers track:
- `cost` and `costPerHour` - Cost metrics
- `capacity.unit` - Current workload/capacity units
- `capacity.efficiency` - Efficiency percentage
- `costTarget` - Target cost

**When implementing work center selection in requests**: Ensure capacity limits are respected and current unit count is tracked as requests are assigned.

## Styling & Theme

- **Framework**: Tailwind CSS with custom configuration
- **Dark Mode**: Class-based dark mode (toggle via `darkMode` state in AppContext)
- **Custom Colors**:
  - Primary: `#135bec`
  - Light background: `#f6f6f8`
  - Dark background: `#101622`
- **Icons**: Uses Google Material Symbols (included via CDN in HTML files)
- **Font**: Inter font family

**Pattern**: Use Tailwind's dark mode variants: `dark:bg-slate-800`, `dark:text-white`, etc.

## Data Consistency Requirements

### Critical: Cross-Page State Consistency
When equipment or request status changes, the change must propagate everywhere:

1. **Equipment Status Changes**: If equipment status changes from "maintenance" to "operational", this must reflect in:
   - Equipment list/grid view
   - Equipment detail view
   - Dashboard metrics
   - Reports pie charts
   - Any filtered views

2. **Request Status Changes**: When request status updates:
   - Kanban board columns must update
   - Dashboard request counts must update
   - Calendar view must update (for preventive requests)
   - Report charts must recalculate
   - Equipment status may need to update (e.g., when moving to "Scrap")

3. **Equipment with Mixed Status Instances**: The current implementation treats each equipment as a single entity. If requirements change to track multiple instances of the same equipment model with different statuses, the data model will need restructuring to support an equipment template + instance pattern.

**Implementation Pattern**: Since all data is in React Context, changes propagate automatically via re-renders. Ensure all components read from context, not from stale local state or props.

## Pending Features & Known Gaps

Based on project requirements, these features need implementation:

### 1. Authentication System
- Login/Signup pages not yet implemented
- Need user authentication flow
- Consider adding JWT or session-based auth
- User roles: Manager, Technician, Viewer

### 2. User Profile Section
- Profile management UI needed
- User settings and preferences
- Avatar upload

### 3. Logo/Branding
- Replace placeholder logo with actual company logo
- Update favicon

### 4. Work Center Integration in Requests
- Add work center selection to maintenance request form
- Implement capacity checking before assignment
- Track current workload per work center
- Update `costTarget` to reflect actual current unit count if needed

### 5. Database Backend
- Currently uses localStorage (client-side only)
- Needs MySQL database schema design
- API layer for CRUD operations
- Consider using Express.js/Node.js backend or similar

### Database Schema Considerations:
```
Tables needed:
- users (id, name, email, password_hash, role, team_id)
- equipment (id, name, serial_number, category_id, department, status, ...)
- equipment_categories (id, name, keywords, company)
- teams (id, name, specialty, team_lead_id)
- team_members (id, user_id, team_id, specialty, status)
- maintenance_requests (id, subject, equipment_id, type, status, assigned_team_id, assigned_user_id, ...)
- work_centers (id, name, cost, capacity_unit, capacity_efficiency, cost_target)
```

### 6. Request-Equipment Status Synchronization
Currently, when equipment status changes, it should intelligently update based on active requests:
- If equipment has requests in "In Progress", status should be "maintenance"
- If equipment has only "New" requests or no requests, status should reflect its true operational state
- Implement bidirectional sync logic

## Development Guidelines

### When Adding New Features
1. Add state and methods to `AppContext.jsx` if data needs to be shared
2. Use existing context methods as templates for consistency
3. Maintain localStorage sync pattern for persistence
4. Update TypeScript types if using TypeScript (currently pure JavaScript)

### When Modifying State Logic
1. Test that changes propagate to all views (Dashboard, Reports, Kanban, etc.)
2. Verify localStorage persistence works correctly
3. Check dark mode compatibility

### When Working with Forms
1. MaintenanceRequestForm handles both create and edit modes via URL params
2. Auto-fill logic is implemented in form component, not context
3. Validate required fields before submission

### Testing Checklist
- Equipment CRUD operations work correctly
- Team member assignment only allows team members
- Request drag-and-drop updates status properly
- Scrap status triggers equipment status change
- Overdue detection works accurately
- All charts update when data changes
- Dark mode works on all pages
- localStorage persists across browser refreshes

## File Organization

```
src/
├── components/
│   └── Layout.jsx           # App shell with navigation
├── context/
│   └── AppContext.jsx       # Global state management
├── pages/
│   ├── Dashboard.jsx        # Main overview
│   ├── Equipment.jsx        # Equipment CRUD
│   ├── EquipmentCategories.jsx
│   ├── WorkCenters.jsx
│   ├── Teams.jsx            # Team management
│   ├── KanbanBoard.jsx      # Request workflow
│   ├── MaintenanceRequestForm.jsx
│   ├── CalendarView.jsx     # Preventive maintenance
│   └── Reports.jsx          # Analytics
├── App.jsx                  # Router setup
├── main.jsx                 # React entry point
└── index.css                # Global styles + Tailwind
```

## Common Patterns

### Adding a New Entity Type
1. Define initial data structure in `AppContext.jsx`
2. Add state: `const [entities, setEntities] = useState([])`
3. Add localStorage key: `gearguard_entities`
4. Implement CRUD methods: `addEntity`, `updateEntity`, `deleteEntity`
5. Add to context value export
6. Create corresponding page component
7. Add route in `App.jsx`

### Accessing Data in Components
```javascript
import { useApp } from '../context/AppContext'

function MyComponent() {
  const { equipment, teams, addRequest, updateEquipment } = useApp()
  
  // Read data
  const activeEquipment = equipment.filter(eq => eq.status === 'operational')
  
  // Update data
  const handleUpdate = () => {
    updateEquipment(equipmentId, { status: 'maintenance' })
  }
}
```

### ID Generation Pattern
- Equipment: `EQ-001`, `EQ-002`, etc. (padded 3 digits)
- Teams: `TEAM-001`, `TEAM-002`, etc.
- Requests: `REQ-{timestamp}` (unique timestamp-based)
- Categories: `CAT-001`, `CAT-002`, etc.
- Work Centers: `WC-001`, `WC-002`, etc.

## Browser Compatibility

Tested on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Issues

1. **No Backend**: All data is lost if localStorage is cleared
2. **No Multi-User Support**: Changes don't sync between users/devices
3. **No Real-Time Updates**: Users must refresh to see others' changes
4. **Image Hosting**: Equipment images use external URLs; need proper asset management
5. **No Input Validation**: Forms lack comprehensive validation
6. **No Error Boundaries**: Runtime errors may crash entire app
7. **No Loading States**: Data fetches appear instant (localStorage is synchronous)

## Future Enhancements Roadmap

1. Implement authentication and user management
2. Build backend API with MySQL database
3. Add real-time updates using WebSockets
4. Implement file upload for equipment images
5. Add notification system for overdue requests
6. Export reports to PDF/Excel
7. Mobile responsive improvements
8. Implement search functionality in header
9. Add request commenting/notes system
10. Implement audit logging for changes
