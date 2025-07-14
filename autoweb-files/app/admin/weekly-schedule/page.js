"use client";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";

const WeeklySchedulePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [currentTime, setCurrentTime] = useState(new Date());
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
    
    // Initialize nested arrays for each time slot (9:00-18:00)
    for (const day in weekAppointments) {
      weekAppointments[day] = Array(10).fill().map(() => []);
    }
    
    // Process appointments
    appointments.forEach(appointment => {
      if (isAppointmentInWeek(appointment, weekStart)) {
        const appointmentDate = parseDate(appointment.date);
        const dayOfWeek = appointmentDate.getDay(); // 1 for Monday, 2 for Tuesday, etc.
        const timeSlot = getTimeSlotIndex(appointment.time);
        
        if (timeSlot >= 0 && timeSlot < 10 && dayOfWeek >= 1 && dayOfWeek <= 5) {
          const dayName = getDayName(dayOfWeek);
          weekAppointments[dayName][timeSlot].push(appointment);
        }
      }
    });
    
    return weekAppointments;
  }

  // Get the time slot index (0 for 9:00, 1 for 10:00, etc.)
  function getTimeSlotIndex(timeString) {
    const hour = parseInt(timeString.split(':')[0]);
    return hour - 9; // 9:00 is index 0
  }

  // Get day name from day index
  function getDayName(dayIndex) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayIndex];
  }

  // useEffect for fetching appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetch approved appointments (including completed ones)
        const approvedRes = await fetch('/api/appointments/approved');
        if (!approvedRes.ok) {
          throw new Error('Failed to fetch approved appointments');
        }
        const approvedData = await approvedRes.json();
        setApprovedAppointments(approvedData);
      } catch (err) {
        console.error('Error fetching appointments:', err.message);
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
        prev.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: status }
            : appointment
        )
      );

    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment status');
    }
  };

  // Second useEffect for auth check
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/'); // Redirect to home page if not admin
    }
  }, [user, router]);

  // Don't render anything while checking auth status or if not admin
  if (!user || user.role !== 'admin') {
    return null;
  }

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

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  // Calculate current time position for the time indicator
  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // If current time is outside work hours (9:00-18:00), return null
    if (hours < 9 || hours >= 18) {
      return null;
    }
    
    // Position as percentage within the cell (0-100%)
    return (minutes / 60) * 100;
  };

  // Get current hour index (0 = 9:00, 1 = 10:00, etc.)
  const getCurrentHourIndex = () => {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours < 9 || hours >= 18) {
      return null;
    }
    
    return hours - 9;
  };
  
  // Get the current day name (monday, tuesday, etc.)
  const getCurrentDayName = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // If weekend, return null
    if (day === 0 || day === 6) {
      return null;
    }
    
    return getDayName(day);
  };
  
  // Check if the current day is in the displayed week
  const isCurrentDayInWeek = () => {
    const now = new Date();
    const currentStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(currentWeekStart);
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(currentWeekStart.getDate() + 4); // Friday
    weekEnd.setHours(23, 59, 59, 999); // End of Friday
    
    return currentStartOfDay >= weekStart && currentStartOfDay <= weekEnd;
  };

  return (
    <>
      <Navbar />
      
      <div className="admin-container">
        <div className="admin-main-content">
          <div className="admin-card" style={{ width: "100%" }}>
            <div className="admin-back-link">
              <Link href="/admin">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Atpakaļ uz administrācijas paneli
              </Link>
            </div>
            <h3>Nedēļas Grafiks</h3>
            <div className="week-calendar">
              <div className="week-nav">
                <button className="week-nav-btn" onClick={goToPreviousWeek}>« Iepriekšējā nedēļa</button>
                <h4>{formatDateRange(currentWeekStart)}</h4>
                <button className="week-nav-btn" onClick={goToNextWeek}>Nākamā nedēļa »</button>
              </div>
              
              <div className="week-grid">
                <div className="time-column">
                  <div className="time-header">Laiks</div>
                  {Array(10).fill().map((_, timeIndex) => {
                    return (
                      <div 
                        className="time-cell" 
                        key={timeIndex}
                      >
                        {9 + timeIndex}:00
                      </div>
                    );
                  })}
                </div>
                
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day, dayIndex) => {
                  const dayNames = ['Pirmdiena', 'Otrdiena', 'Trešdiena', 'Ceturtdiena', 'Piektdiena'];
                  const weekAppointments = getAppointmentsForWeek(approvedAppointments, currentWeekStart);
                  
                  return (
                    <div className="day-column" key={day}>
                      <div className="day-header">{dayNames[dayIndex]}</div>
                      {Array(10).fill().map((_, timeIndex) => {
                        const appointmentsInSlot = weekAppointments[day][timeIndex];
                        const hasAppointments = Array.isArray(appointmentsInSlot) && appointmentsInSlot.length > 0;
                        const isCurrentTimeCell = isCurrentDayInWeek() && 
                                                day === getCurrentDayName() && 
                                                timeIndex === getCurrentHourIndex();
                        
                        return (
                          <div 
                            className="appointment-cell" 
                            key={timeIndex}
                          >
                            {hasAppointments && appointmentsInSlot.map((appointment, i) => (
                              <div 
                                className={`appointment-card ${appointment.status === 'completed' ? 'completed-appointment' : ''}`} 
                                key={appointment.id}
                              >
                                <div className="appointment-name">{appointment.name}</div>
                                <div className="appointment-details">
                                  {appointment.license_plate} - {appointment.service_name || 'Cits'}
                                </div>
                                {appointment.status !== 'completed' ? (
                                  <>
                                    <div className="appointment-actions">
                                      <button 
                                        className="btn-edit"
                                        onClick={() => handleEditAppointment(appointment)}
                                      >
                                        Rediģēt
                                      </button>
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
                                    <button 
                                      className="single-action-btn"
                                      onClick={() => handleActionClick(appointment)}
                                    >
                                      Darbības
                                    </button>
                                  </>
                                ) : (
                                  <div className="completed-label">Pabeigts</div>
                                )}
                              </div>
                            ))}
                            {/* Display current time indicator */}
                            {isCurrentTimeCell && (
                              <div 
                                className="current-time-indicator" 
                                style={{ 
                                  top: `${getCurrentTimePosition()}%`,
                                }}
                              >
                                <div className="current-time-dot"></div>
                                <div className="current-time-line"></div>
                                <div className="current-time-label">
                                  {currentTime.getHours()}:{currentTime.getMinutes() < 10 ? '0' + currentTime.getMinutes() : currentTime.getMinutes()}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default WeeklySchedulePage; 