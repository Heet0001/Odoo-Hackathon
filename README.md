# GearGuard: The Ultimate Maintenance Tracker

A comprehensive maintenance management system built with React that allows companies to track assets (machines, vehicles, computers) and manage maintenance requests.

## Features

### Core Functionality

1. **Equipment Management**
   - Track equipment by Department, Employee, and Team
   - Search and filter equipment
   - Group by Department, Employee, or Team
   - Smart Maintenance button with open request count badge
   - Equipment status tracking (Operational, Maintenance, Broken, Scrapped)

2. **Maintenance Teams**
   - Create and manage specialized teams (Mechanics, Electricians, IT Support)
   - Assign technicians to teams
   - Track team availability and workload

3. **Maintenance Requests**
   - Two request types: Corrective (unplanned) and Preventive (planned)
   - Auto-fill logic: Selecting equipment automatically fills category and team
   - Request lifecycle: New → In Progress → Repaired → Scrap
   - Priority levels: High, Medium, Low
   - Duration tracking

4. **Kanban Board**
   - Drag & drop requests between stages
   - Visual indicators for overdue requests
   - Technician avatars
   - Filter by technician, priority, and asset type
   - Group by equipment

5. **Calendar View**
   - Display all preventive maintenance requests
   - Click dates to view scheduled maintenance
   - Create new requests for specific dates
   - Visual indicators for overdue items

6. **Reports & Analytics**
   - Requests per Team (Bar Chart)
   - Requests per Equipment Category (Bar Chart)
   - Requests by Status (Pie Chart)
   - Requests by Type (Pie Chart)
   - Requests by Priority (Bar Chart)
   - Equipment Status Distribution (Pie Chart)

### Smart Features

- **Auto-Fill Logic**: When selecting equipment in a request form, the system automatically fills:
  - Equipment category
  - Maintenance team
  - Assigned technician (default)

- **Smart Buttons**: Equipment cards have a "Maintenance" button that:
  - Shows count of open requests as a badge
  - Links to filtered Kanban board view for that equipment

- **Scrap Logic**: When a request is moved to "Scrap" stage:
  - Equipment status is automatically updated to "scrapped"
  - Scrapped date and reason are logged

- **Overdue Detection**: System automatically detects and highlights overdue requests

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Technology Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **React DnD** - Drag and drop functionality
- **Tailwind CSS** - Styling
- **Recharts** - Charts and graphs
- **date-fns** - Date manipulation
- **Vite** - Build tool

## Project Structure

```
src/
├── components/
│   └── Layout.jsx          # Main layout with sidebar and header
├── context/
│   └── AppContext.jsx       # Global state management
├── pages/
│   ├── Dashboard.jsx        # Overview dashboard
│   ├── Equipment.jsx       # Equipment management
│   ├── Teams.jsx           # Team management
│   ├── KanbanBoard.jsx     # Kanban board with drag & drop
│   ├── MaintenanceRequestForm.jsx  # Request creation/editing
│   ├── CalendarView.jsx    # Calendar view for preventive maintenance
│   └── Reports.jsx         # Analytics and reports
├── App.jsx                 # Main app component with routing
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## Data Persistence

All data is stored in browser localStorage, so it persists across sessions. The following keys are used:
- `gearguard_equipment` - Equipment data
- `gearguard_teams` - Team data
- `gearguard_requests` - Request data
- `gearguard_darkMode` - Theme preference

## Usage

### Creating Equipment

1. Navigate to Equipment page
2. Click "New Equipment" button
3. Fill in equipment details:
   - Name and Serial Number (required)
   - Department, Employee, Location
   - Purchase Date and Warranty Info
   - Maintenance Team and Assigned Technician

### Creating Maintenance Requests

1. Navigate to Kanban Board or click "New Request" from any page
2. Select Request Type (Corrective or Preventive)
3. Enter Subject
4. Select Equipment (auto-fills category and team)
5. Set Scheduled Date (required for Preventive)
6. Set Priority and Duration
7. Assign Technician (optional)
8. Submit

### Managing Requests on Kanban Board

1. Drag requests between columns to change status
2. Click on request cards to view details
3. Use filters to narrow down view
4. Assign technicians by selecting from dropdown

### Viewing Calendar

1. Navigate to Calendar page
2. Browse months using arrow buttons
3. Click on dates to view scheduled maintenance
4. Click "Schedule Maintenance" to create new request for selected date

### Viewing Reports

1. Navigate to Reports page
2. View various charts and analytics
3. Data updates in real-time as you manage requests

## Workflow Examples

### Breakdown Flow (Corrective)

1. User creates request with type "Corrective"
2. Selects equipment → System auto-fills category and team
3. Request starts in "New" stage
4. Manager/Technician assigns themselves
5. Status moves to "In Progress"
6. Technician records hours spent
7. Status moves to "Repaired"

### Routine Checkup Flow (Preventive)

1. Manager creates request with type "Preventive"
2. Sets Scheduled Date (e.g., Next Monday)
3. Request appears on Calendar View
4. Technician sees it on scheduled date
5. Completes maintenance and updates status

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2024 GearGuard Maintenance Systems. All rights reserved.

