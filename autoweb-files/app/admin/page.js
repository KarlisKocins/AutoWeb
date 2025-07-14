"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PendingAppointment from "../components/PendingAppointment";
import Link from "next/link";

const AdminPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [pendingData, setPendingData] = useState();
  const [isPendingOpen, setIsPendingOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionAppointment, setActionAppointment] = useState(null);
  const [isActionPopupOpen, setIsActionPopupOpen] = useState(false);

  // Helper function to get the start of the current week (Monday)
  function getStartOfWeek(date) {
    const newDate = new Date(date);
    const day = newDate.getDay();
    const diff = newDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(newDate.setDate(diff));
  }

  // Format date for display
  function formatDateRange(startDate) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4); // Friday (4 days after Monday)
    
    const startDay = startDate.getDate();
    const startMonth = startDate.getMonth() + 1;
    const endDay = endDate.getDate();
    const endMonth = endDate.getMonth() + 1;
    
    return `${startDay < 10 ? '0' + startDay : startDay}.${startMonth < 10 ? '0' + startMonth : startMonth} - ${endDay < 10 ? '0' + endDay : endDay}.${endMonth < 10 ? '0' + endMonth : endMonth}, ${startDate.getFullYear()}`;
  }

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  // Parse date string in format DD.MM.YYYY to a Date object
  function parseDate(dateString) {
    const [day, month, year] = dateString.split('.');
    return new Date(year, month - 1, day);
  }

  // Check if an appointment is in the current week
  function isAppointmentInWeek(appointment, weekStart) {
    const appointmentDate = parseDate(appointment.date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 4); // End of work week (Friday)
    
    return appointmentDate >= weekStart && appointmentDate <= weekEnd;
  }

  // Group appointments by day and time
  function getAppointmentsForWeek(appointments, weekStart) {
    // Create properly initialized arrays for each day
    const weekAppointments = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: []
    };
    
    // Initialize nested arrays for each time slot
    for (const day in weekAppointments) {
      weekAppointments[day] = Array(10).fill().map(() => []);
    }
    
    // Process appointments
    appointments.forEach(appointment => {
      if (isAppointmentInWeek(appointment, weekStart)) {
        const appointmentDate = parseDate(appointment.date);
        const dayOfWeek = appointmentDate.getDay(); // 1 for Monday, 2 for Tuesday, etc.
        const timeSlot = getTimeSlotIndex(appointment.time);
        
        if (timeSlot >= 0 && dayOfWeek >= 1 && dayOfWeek <= 5) {
          const dayName = getDayName(dayOfWeek);
          weekAppointments[dayName][timeSlot].push(appointment);
        }
      }
    });
    
    return weekAppointments;
  }

  // Get the time slot index (0 for 8:00, 1 for 9:00, etc.)
  function getTimeSlotIndex(timeString) {
    const hour = parseInt(timeString.split(':')[0]);
    return hour - 8; // 8:00 is index 0
  }

  // Get day name from day index
  function getDayName(dayIndex) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayIndex];
  }

  // First useEffect for fetching appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetch pending appointments
        const pendingRes = await fetch('/api/appointments/list');
        if (!pendingRes.ok) {
          throw new Error('Failed to fetch pending appointments');
        }
        const pendingData = await pendingRes.json();
        setPendingAppointments(pendingData);

        // Fetch approved appointments (including completed ones)
        const approvedRes = await fetch('/api/appointments/approved');
        if (!approvedRes.ok) {
          throw new Error('Failed to fetch approved appointments');
        }
        const approvedData = await approvedRes.json();
        setApprovedAppointments(approvedData);
      } catch (err) {
        console.error('Error fetching appointments:', err.message);
        // Optionally set some error state here if you want to show error messages to users
      }
    };

    fetchAppointments();
  }, []);

  // Handle appointment status update
  const handleAppointmentAction = async (appointmentId, status) => {
    try {
      const response = await fetch('/api/appointments/update_status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointment_id: appointmentId,
          status: status
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }

      // Update the appointments list after successful status update
      setApprovedAppointments(prev => 
        prev.filter(appointment => appointment.id !== appointmentId)
      );

    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment status');
    }
  };

  // Second useEffect for auth check (moved after other hooks)
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/'); // Redirect to home page if not admin
    }
  }, [user, router]);

  // Don't render anything while checking auth status or if not admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  const togglePendingPopup = () => {
    setIsPendingOpen(!isPendingOpen);
  };

  const handlePendingClick = (data) => {
    setPendingData(data);
    togglePendingPopup();
  }

  const onStatusUpdate = (updatedAppointment) => {
    console.log(updatedAppointment);
    console.log(pendingAppointments);

    const newAppointmentList = pendingAppointments.filter(
      (appointment) => appointment.id !== updatedAppointment.id
    );

    console.log(newAppointmentList);
    setPendingAppointments(newAppointmentList);
  }

  const employees = [
    { id: 1, name: "Vārds Uzvārds" },
    { id: 2, name: "Vārds Uzvārds" },
    { id: 3, name: "Vārds Uzvārds" },
    { id: 4, name: "Vārds Uzvārds" },
    { id: 5, name: "Vārds Uzvārds" },
  ];

  // Handle edit appointment button click
  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setIsEditModalOpen(true);
    setIsActionPopupOpen(false); // Close action popup if open
  };

  // Handle close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAppointment(null);
  };

  // Handle save edited appointment
  const handleSaveAppointment = async (updatedAppointment) => {
    try {
      const response = await fetch(`/api/appointments/update/${updatedAppointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAppointment),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }
      
      // Update the appointments in state
      const updatedApproved = approvedAppointments.map(app => 
        app.id === updatedAppointment.id ? updatedAppointment : app
      );
      setApprovedAppointments(updatedApproved);
      
      // Close the modal
      setIsEditModalOpen(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment: ' + error.message);
    }
  };

  // Handle action button click (for mobile)
  const handleActionClick = (appointment) => {
    setActionAppointment(appointment);
    setIsActionPopupOpen(true);
  };

  // Close action popup
  const handleCloseActionPopup = () => {
    setIsActionPopupOpen(false);
    setActionAppointment(null);
  };

  // Function to check if a row is empty (no appointments in this time slot)
  function checkEmptyRow(weekAppointments, timeIndex) {
    let isEmpty = true;
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
      const appointmentsInSlot = weekAppointments[day][timeIndex];
      if (Array.isArray(appointmentsInSlot) && appointmentsInSlot.length > 0) {
        isEmpty = false;
      }
    });
    return isEmpty;
  }

  return (
    <>
      <Navbar/>

      <div className="admin-container">
        <div className="admin-main-content">
          <div className="admin-left-panel">
            <div className="admin-card">
              <h3>Darbinieku saraksts</h3>
              <div className="admin-scrollable">
                {employees.map((employee) => (
                  <div key={employee.id} className="admin-list-item">
                    <span className="admin-name">{employee.name}</span>
                    <a href="#" className="admin-report-link">
                      pārskats
                    </a>
                  </div>
                ))}
              </div>
              <div className="admin-add-button">Pievienot jauno darbinieku +</div>
            </div>
          </div>

          <div className="admin-right-panel">
            <div className="admin-card">
              <h3>Pieteikumi</h3>
              <div className="admin-scrollable">
                {pendingAppointments.map((item) => (
                  <div key={item.id} className="admin-list-item">
                    <span className="admin-name">{item.name}</span>
                    <div className="admin-details">
                      <div className="detail-row">
                        <span className="detail-label">Auto:</span>
                        <span className="detail-value">{item.license_plate || 'Nav norādīts'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Pakalpojums:</span>
                        <span className="detail-value">{item.service_name || 'Cits'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Laiks:</span>
                        <span className="detail-value">{item.time}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Datums:</span>
                        <span className="detail-value">{item.date}</span>
                      </div>
                    </div>
                    <a href="#" className="admin-report-link" onClick={() => handlePendingClick(item)}>
                      pārskats
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-card">
              <h3>Grafiks</h3>
              <div className="admin-scrollable">
                {approvedAppointments.map((appointment) => (
                  <div key={appointment.id} className="admin-list-item">
                    <div className="appointment-info">
                      <div className="name-phone-container">
                        <span className="admin-name">{appointment.name}</span>
                        <span className="admin-phone">• {appointment.phone}</span>
                      </div>
                      <span className="admin-details">
                        {appointment.service_name || 'Cits'} - {appointment.license_plate}
                      </span>
                      <span className="appointment-time">
                        {appointment.date}, {appointment.time}
                      </span>
                    </div>
                    <div className="appointment-actions">
                      <button 
                        className="btn-finish"
                        onClick={() => handleAppointmentAction(appointment.id, 'completed')}
                      >
                        Pabeigt
                      </button>
                      <button 
                        className="btn-cancel"
                        onClick={() => handleAppointmentAction(appointment.id, 'cancelled')}
                      >
                        Atcelt
                      </button>
                    </div>
                  </div>
                ))}
                {approvedAppointments.length === 0 && (
                  <div className="no-appointments">
                    Nav apstiprinātu rezervāciju
                  </div>
                )}
              </div>
            </div>
            
            <div className="admin-card">
              <h3>Nedēļas Grafiks</h3>
              <Link href="/admin/weekly-schedule" className="weekly-schedule-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Atvērt nedēļas grafiku
              </Link>
            </div>
          </div>
        </div>
      </div>

      <PendingAppointment
        appointmentData={pendingData}
        isOpen={isPendingOpen} 
        onClose={togglePendingPopup}
        onStatusUpdate={onStatusUpdate}
      />

      {/* Edit Appointment Modal */}
      {isEditModalOpen && editingAppointment && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-button" onClick={handleCloseEditModal}>
              ×
            </button>
            <h2>Rediģēt pierakstu</h2>
            <div className="popup-form">
              <div className="form-group">
                <label htmlFor="edit-name">Vārds:</label>
                <input
                  id="edit-name"
                  type="text"
                  defaultValue={editingAppointment.name}
                  onChange={(e) => setEditingAppointment({
                    ...editingAppointment,
                    name: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-phone">Telefons:</label>
                <input
                  id="edit-phone"
                  type="text"
                  defaultValue={editingAppointment.phone}
                  onChange={(e) => setEditingAppointment({
                    ...editingAppointment,
                    phone: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-license">Auto nr.:</label>
                <input
                  id="edit-license"
                  type="text"
                  defaultValue={editingAppointment.license_plate}
                  onChange={(e) => setEditingAppointment({
                    ...editingAppointment,
                    license_plate: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-date">Datums:</label>
                <input
                  id="edit-date"
                  type="text"
                  defaultValue={editingAppointment.date}
                  onChange={(e) => setEditingAppointment({
                    ...editingAppointment,
                    date: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-time">Laiks:</label>
                <input
                  id="edit-time"
                  type="text"
                  defaultValue={editingAppointment.time}
                  onChange={(e) => setEditingAppointment({
                    ...editingAppointment,
                    time: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-service">Pakalpojums:</label>
                <input
                  id="edit-service"
                  type="text"
                  defaultValue={editingAppointment.service_name}
                  onChange={(e) => setEditingAppointment({
                    ...editingAppointment,
                    service_name: e.target.value
                  })}
                />
              </div>
              <button onClick={() => handleSaveAppointment(editingAppointment)}>
                Saglabāt izmaiņas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Action Popup */}
      {isActionPopupOpen && actionAppointment && (
        <div className="action-popup-overlay">
          <div className="action-popup">
            <h3>Izvēlieties darbību</h3>
            <div className="action-popup-appointment-name">
              {actionAppointment.name}
            </div>
            <div className="action-popup-appointment-details">
              {actionAppointment.license_plate} - {actionAppointment.service_name || 'Cits'}<br/>
              {actionAppointment.date}, {actionAppointment.time}
            </div>
            <div className="action-buttons">
              <button 
                className="action-btn-edit"
                onClick={() => {
                  handleEditAppointment(actionAppointment);
                }}
              >
                Rediģēt
              </button>
              <button 
                className="action-btn-complete"
                onClick={() => {
                  handleAppointmentAction(actionAppointment.id, 'completed');
                  handleCloseActionPopup();
                }}
              >
                Pabeigt
              </button>
              <button 
                className="action-btn-cancel"
                onClick={() => {
                  handleAppointmentAction(actionAppointment.id, 'cancelled');
                  handleCloseActionPopup();
                }}
              >
                Atcelt
              </button>
              <button 
                className="action-btn-close"
                onClick={handleCloseActionPopup}
              >
                Aizvērt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPage;