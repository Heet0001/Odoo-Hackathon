import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Initialize with sample data
const initialEquipment = [
  {
    id: 'EQ-001',
    name: 'Hydraulic Press A1',
    serialNumber: 'HP-A1-2023',
    category: 'Heating & Cooling',
    department: 'Production',
    employee: 'John Smith',
    location: 'Building A, Floor 2',
    purchaseDate: '2023-01-15',
    warrantyInfo: '2 years warranty',
    maintenanceTeam: 'Mechanics Alpha',
    assignedTechnician: 'Sarah Jenkins',
    status: 'operational',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4GZjPc5V559Brm4tNl4SQfoKt9bSe_6Nk9QSaqtvoMD5tN6azwNu1bMUy7Mmdm1skBphmXfBWifCMbHa_RFBaaHfyCHwILVSSWDXdk7uopYpuIMqd5c2qDKKFIgzd6pJvMxj2rGvKz0Z5d0fX1lqYG1aARAyI4D__XtBxqoMZ9_ihFewnzBYQoDNTOcp4OY0fSAK9Ia0h9mlFt-zvILkOlqDswBl-Go8b6HAnofH8KmFtr2LL_hJ30Ls8a7jleGk--_kP2sii4mk'
  },
  {
    id: 'EQ-002',
    name: 'Conveyor Belt 04',
    serialNumber: 'CB-04-2022',
    category: 'Manufacturing',
    department: 'Production',
    employee: null,
    location: 'Warehouse',
    purchaseDate: '2022-06-20',
    warrantyInfo: '1 year warranty',
    maintenanceTeam: 'Mechanics Alpha',
    assignedTechnician: 'John Doe',
    status: 'maintenance',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4nP2F3elrvo9zVMBtZfF5-MmRqnsifhDOhPwdO7zgdwDe74ue3DgSlbsVX3CfYW2m1l-c8JfhUWPKOduG_o2LYSCY1YY4oF4G7_JGhndyRpOpPIL-8pnjqu86jt3pFiAFjNxAGOGDUxtkgsay4LHNWs_p82yba7I3VyT6oid9po3J7kkIpIT0uBdFCdc1a4csy2XxXMRa9vwkqjWsCLfCxHb0uCTsaLSVTnymLCgdyegxtr_0D_H3qM0kl3VEvKJx_BLVEUNSQks'
  },
  {
    id: 'EQ-003',
    name: 'Forklift Unit 12',
    serialNumber: 'FL-12-2021',
    category: 'Vehicles',
    department: 'Logistics',
    employee: 'Mike Johnson',
    location: 'Loading Dock',
    purchaseDate: '2021-03-10',
    warrantyInfo: 'Expired',
    maintenanceTeam: 'Mechanics Alpha',
    assignedTechnician: 'Sarah Jenkins',
    status: 'operational',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7LX7uJPfVuLB_FE4wYeoFTr1t1fe1zcNIJ5djJ-MbUTlTKAGoRuuMKg6NCP94sA7ORce89ZuWvhuRXhHUbByDvf3l8ORkXoEqwgU9DyW_Nj4WUw7U_NOG9ChoSs0zU13YnAdZAEz6PA4k1hpA5X-GGiqL9NFcG8uPF_r11FPsg2p6myGco-pv5SItKmJXnGYo7Ow02KBq3x2iJMXc4N4UgxwXoW_jOEOW24IDkvZijYa3aSDExUKz7bC1Gi3e9sVvsooB-P-LVl0'
  },
  {
    id: 'EQ-004',
    name: 'HVAC Unit #4',
    serialNumber: 'HVAC-04-2023',
    category: 'Heating & Cooling',
    department: 'Facilities',
    employee: null,
    location: 'Zone B',
    purchaseDate: '2023-05-12',
    warrantyInfo: '3 years warranty',
    maintenanceTeam: 'Plumbing & HVAC',
    assignedTechnician: 'Marcus Johnson',
    status: 'operational',
    image: null
  },
];

const initialTeams = [
  {
    id: 'TEAM-001',
    name: 'Mechanics Alpha',
    specialty: 'Heavy Machinery',
    teamLead: 'Sarah Jenkins',
    members: [
      { id: 'TECH-001', name: 'Sarah Jenkins', specialty: 'Mechanical', status: 'available', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcHlFVSZe7VtDr5j4qK95BbIYp2nObgo7FUk7L_6JtUw-dPdZiTszzzFyfhJvUfP1pmtD5y9oPnTSFnMq23GS1KWlPXwhWZkdEo72GOGDPI5-cezngkzdeVO4qVlZLUyQ5U6D6Eip46hvB5eGKxLhLmNn2vZ35H7FoVqUlKxFjT5UQDDVEpx7rfXosfXuec7gohzpBdFclQETGTc0RE6ic3j6-Sz__Y6RDcqx6uQ5u6Ir5H7-98oOviNqqrw8xo2bZo6zCMpkM2p8' },
      { id: 'TECH-002', name: 'John Doe', specialty: 'Mechanical', status: 'busy', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ5c4ezVJFu2XaYL5KMkKF8cx8c360SwJJtza0ZN_EZLr2CD9g7x7Nin1CX3_4af310BIvfdpQlL4XrJllGK-vNB_-VAzGYOxEg4DnQ_BD9-GDa8XfP6Muk-4zziC-SgU1wx-PyjSsdLyL5JwQA-v8xnIi0I9fbTzcWwmqW2VbQBbQXBXbmo1ong5sB2zR3UVQIvEeRbWTv--O_xcM-N6ajCTfKYTTwWNP2EJEyz1KuEbVEMPHeQwd3wpblQoEmzqOj_-dTiRiraQ' },
    ]
  },
  {
    id: 'TEAM-002',
    name: 'Electrical Response',
    specialty: 'High Voltage',
    teamLead: 'Mike Ross',
    members: [
      { id: 'TECH-003', name: 'Mike Ross', specialty: 'Electrical', status: 'busy', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKHb6NjVTA9OXEcfesNjTJN_EGG9tC9qBwDRZcWrO2vUmZC5EzEuU9cacqIE4eSc-L7cv1dHz8I-9bbyvlQIhQhv4ERo6Z8neC8oSgkyxbbiX5-SEa8vquzKN148m9crKIFUr1PhcLf_qkSHn_lcfeCP87jgg5sSqUD86c1C7ZREL7HMUODwRVlvQQkaepgxlG2RZmiMozq2pOexmGYx7Qp1fho-PO_j6UD4sQFWNlkig1Wv54q-1af-lVx33PIyTiZ6tqzF-L_vs' },
    ]
  },
  {
    id: 'TEAM-003',
    name: 'IT Support Unit',
    specialty: 'Software & Hardware',
    teamLead: 'David Chen',
    members: [
      { id: 'TECH-004', name: 'David Chen', specialty: 'IT', status: 'available', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVtngW_x-ZvA_4Uke0tMjqMRqZ4QeMCBfhtMpCfU8jmie0zVBRQRCxIVfQqwh_Evo8iyyPuU4_tWTXzfuZF123KHjCz2iejer45ALtgcZyQBpZz1e8l4LhQEdalYuOssm7aUQAsPw01n4U8hzEgHUYBGNe8VMQzYTctOnF49_uBw_8nC2voU8pqCVPzawSESR2r1x7WWbFmg9LwV3NQOk7Ite7NEXhdVu3Vsb7DUIOLuTj_iWXqjXPaNMU4UQqtAzcen5B9NzV9D8' },
    ]
  },
  {
    id: 'TEAM-004',
    name: 'Plumbing & HVAC',
    specialty: 'Facility Maintenance',
    teamLead: 'Marcus Johnson',
    members: [
      { id: 'TECH-005', name: 'Marcus Johnson', specialty: 'HVAC', status: 'available', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzqVaptmazPiUlwjFZO3cVnaEuVhJd46U2bIf2E4GR_AdSO7zIzJirOTWzDpcgZLrbZP9TflzKhSeJSVw6DXZIgpXQD3b4zjvqortZFTE2TLTudlxhHsCsQdJzWHCmtVgENck27fvQ4822V38jpAo_iQzwqK4LdyBUDP4pQ-_qtwsxdvWSKfxK5RuUiH_qKeOjlBlO2OhFWp00UL-fJWGojh3YME5BNCJEYmQnLm_Is-X6QF-Ea6mu27Zxzoej5LisJfO4LUp11Ps' },
    ]
  },
];

const initialRequests = [
  {
    id: 'REQ-2024',
    ticketId: '#REQ-2024',
    subject: 'Fluid Leakage',
    equipmentId: 'EQ-001',
    equipmentName: 'Hydraulic Press A1',
    type: 'Corrective',
    scheduledDate: '2024-10-24',
    duration: null,
    hoursSpent: null,
    priority: 'High',
    status: 'New',
    assignedTeam: 'Mechanics Alpha',
    assignedTechnician: null,
    description: 'Leaking oil from hydraulic system',
    createdAt: new Date().toISOString(),
    overdue: false,
  },
  {
    id: 'REQ-2023',
    ticketId: '#REQ-2023',
    subject: 'Motor Overheat',
    equipmentId: 'EQ-002',
    equipmentName: 'Conveyor Belt 04',
    type: 'Corrective',
    scheduledDate: '2024-10-23',
    duration: null,
    hoursSpent: null,
    priority: 'Medium',
    status: 'In Progress',
    assignedTeam: 'Mechanics Alpha',
    assignedTechnician: 'John Doe',
    description: 'Motor overheating during peak load',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    overdue: true,
  },
  {
    id: 'REQ-2022',
    ticketId: '#REQ-2022',
    subject: 'Tire Replacement',
    equipmentId: 'EQ-003',
    equipmentName: 'Forklift Unit 12',
    type: 'Corrective',
    scheduledDate: '2024-10-25',
    duration: null,
    hoursSpent: null,
    priority: 'Low',
    status: 'New',
    assignedTeam: 'Mechanics Alpha',
    assignedTechnician: null,
    description: 'Tire replacement required',
    createdAt: new Date().toISOString(),
    overdue: false,
  },
  {
    id: 'REQ-1024',
    ticketId: '#REQ-1024',
    subject: 'Fan failure reported',
    equipmentId: 'EQ-004',
    equipmentName: 'HVAC Unit #4',
    type: 'Corrective',
    scheduledDate: '2024-10-25',
    duration: null,
    hoursSpent: null,
    priority: 'Medium',
    status: 'New',
    assignedTeam: 'Plumbing & HVAC',
    assignedTechnician: null,
    description: 'Fan failure reported in Zone B. Makes loud rattling noise.',
    createdAt: new Date().toISOString(),
    overdue: false,
  },
  {
    id: 'REQ-1005',
    ticketId: '#REQ-1005',
    subject: 'Filter replacement',
    equipmentId: 'EQ-004',
    equipmentName: 'Server Room AC',
    type: 'Preventive',
    scheduledDate: '2024-10-22',
    duration: 2,
    hoursSpent: 2,
    priority: 'Low',
    status: 'Repaired',
    assignedTeam: 'Plumbing & HVAC',
    assignedTechnician: 'Marcus Johnson',
    description: 'Filter replacement and coil cleaning',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    overdue: false,
  },
];

export const AppProvider = ({ children }) => {
  const [equipment, setEquipment] = useState([]);
  const [teams, setTeams] = useState([]);
  const [requests, setRequests] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEquipment = localStorage.getItem('gearguard_equipment');
    const savedTeams = localStorage.getItem('gearguard_teams');
    const savedRequests = localStorage.getItem('gearguard_requests');
    const savedDarkMode = localStorage.getItem('gearguard_darkMode');

    if (savedEquipment) {
      setEquipment(JSON.parse(savedEquipment));
    } else {
      setEquipment(initialEquipment);
      localStorage.setItem('gearguard_equipment', JSON.stringify(initialEquipment));
    }

    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    } else {
      setTeams(initialTeams);
      localStorage.setItem('gearguard_teams', JSON.stringify(initialTeams));
    }

    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    } else {
      setRequests(initialRequests);
      localStorage.setItem('gearguard_requests', JSON.stringify(initialRequests));
    }

    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (equipment.length > 0) {
      localStorage.setItem('gearguard_equipment', JSON.stringify(equipment));
    }
  }, [equipment]);

  useEffect(() => {
    if (teams.length > 0) {
      localStorage.setItem('gearguard_teams', JSON.stringify(teams));
    }
  }, [teams]);

  useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem('gearguard_requests', JSON.stringify(requests));
    }
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('gearguard_darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Equipment functions
  const addEquipment = (newEquipment) => {
    const equipmentWithId = {
      ...newEquipment,
      id: `EQ-${String(equipment.length + 1).padStart(3, '0')}`,
    };
    setEquipment([...equipment, equipmentWithId]);
    return equipmentWithId;
  };

  const updateEquipment = (id, updates) => {
    setEquipment(equipment.map(eq => eq.id === id ? { ...eq, ...updates } : eq));
  };

  const deleteEquipment = (id) => {
    setEquipment(equipment.filter(eq => eq.id !== id));
  };

  // Team functions
  const addTeam = (newTeam) => {
    const teamWithId = {
      ...newTeam,
      id: `TEAM-${String(teams.length + 1).padStart(3, '0')}`,
    };
    setTeams([...teams, teamWithId]);
    return teamWithId;
  };

  const updateTeam = (id, updates) => {
    setTeams(teams.map(team => team.id === id ? { ...team, ...updates } : team));
  };

  const addTeamMember = (teamId, member) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: [...team.members, member]
        };
      }
      return team;
    }));
  };

  // Request functions
  const addRequest = (newRequest) => {
    const requestWithId = {
      ...newRequest,
      id: `REQ-${Date.now()}`,
      ticketId: `#REQ-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString(),
      overdue: false,
    };
    setRequests([...requests, requestWithId]);
    return requestWithId;
  };

  const updateRequest = (id, updates) => {
    setRequests(requests.map(req => {
      if (req.id === id) {
        const updated = { ...req, ...updates };
        // Check if overdue
        if (updated.scheduledDate && updated.status !== 'Repaired' && updated.status !== 'Scrap') {
          const scheduled = new Date(updated.scheduledDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          updated.overdue = scheduled < today;
        }
        return updated;
      }
      return req;
    }));
  };

  const deleteRequest = (id) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  // Get requests for equipment
  const getEquipmentRequests = (equipmentId) => {
    return requests.filter(req => req.equipmentId === equipmentId);
  };

  // Get open requests count for equipment
  const getOpenRequestsCount = (equipmentId) => {
    return requests.filter(req => 
      req.equipmentId === equipmentId && 
      req.status !== 'Repaired' && 
      req.status !== 'Scrap'
    ).length;
  };

  // Get equipment by ID
  const getEquipmentById = (id) => {
    return equipment.find(eq => eq.id === id);
  };

  // Get team by name
  const getTeamByName = (name) => {
    return teams.find(team => team.name === name);
  };

  // Mark equipment as scrapped when request moves to Scrap
  const handleRequestScrap = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      updateEquipment(request.equipmentId, { 
        status: 'scrapped',
        scrappedDate: new Date().toISOString(),
        scrappedReason: `Request ${request.ticketId} moved to Scrap stage`
      });
    }
  };

  const value = {
    equipment,
    teams,
    requests,
    darkMode,
    setDarkMode,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    addTeam,
    updateTeam,
    addTeamMember,
    addRequest,
    updateRequest,
    deleteRequest,
    getEquipmentRequests,
    getOpenRequestsCount,
    getEquipmentById,
    getTeamByName,
    handleRequestScrap,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

