"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LoginPopup from "./LoginPopup";

export default function BookingComponent({ selectedDate }) {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isTodaySelected, setIsTodaySelected] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [customService, setCustomService] = useState('');
  const [carDetails, setCarDetails] = useState({
    make: '',
    model: '',
    year: '',
    VIN: '',
    license_plate: ''
  });
  const { user } = useAuth();

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  useEffect(() => {
    // Fetch services when component mounts
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
      })
      .catch(error => {
        console.error('Error fetching services:', error);
      });
  }, []);

  useEffect(() => {
    // Reset today selected state when date changes
    if (selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const selectedDateObj = new Date(selectedDate);
      
      const isToday = selectedDateObj.getDate() === today.getDate() && 
                      selectedDateObj.getMonth() === today.getMonth() && 
                      selectedDateObj.getFullYear() === today.getFullYear();
      
      setIsTodaySelected(isToday);

      // Handle login check
      if (!isToday && !user) {
        setShowLoginPopup(true);
        return;
      }

      // Fetch available times for non-today dates when user is logged in
      if (!isToday && user) {
        const adjustedDate = new Date(selectedDate);
        adjustedDate.setDate(adjustedDate.getDate() + 1);
        const formattedDate = adjustedDate.toISOString().split('T')[0];
        
        fetch(`/api/appointments/times?date=${formattedDate}`)
          .then(res => res.json())
          .then(bookedTimes => {
            const available = timeSlots.filter(time => !bookedTimes.includes(time));
            setAvailableTimes(available);
          })
          .catch(error => {
            console.error('Error fetching booked times:', error);
          });
      }
    } else {
      setIsTodaySelected(false);
    }
  }, [selectedDate, user]);

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowBookingForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Adjust the date to handle timezone issues
    const adjustedDate = new Date(selectedDate);
    adjustedDate.setDate(adjustedDate.getDate() + 1);
    const formattedDate = adjustedDate.toISOString().split('T')[0];

    const selectedServiceId = selectedServices[0] === 'custom' ? null : parseInt(selectedServices[0]);

    const bookingData = {
      client_id: user.id,
      car_details: carDetails,
      appointment_date: formattedDate,
      appointment_time: selectedTime,
      service_id: selectedServiceId,
      notes: selectedServices[0] === 'custom' ? customService : null
    };

    try {
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Rezervācija neizdevās');
      }

      // Clear form and show success
      setShowBookingForm(false);
      setSelectedTime(null);
      setCarDetails({
        make: '',
        model: '',
        year: '',
        VIN: '',
        license_plate: ''
      });
      setSelectedServices([]);
      setCustomService('');
      
      alert('Rezervācija veiksmīgi izveidota!');
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert(error.message || 'Rezervācija neizdevās. Lūdzu, mēģiniet vēlreiz.');
    }
  };

  return (
    <>
      {showLoginPopup && (
        <LoginPopup 
          isOpen={showLoginPopup}
          onClose={() => setShowLoginPopup(false)}
          onCreateAccountClick={() => {
            setShowLoginPopup(false);
          }}
        />
      )}

      {isTodaySelected ? (
        <div className="today-message">
          <p>Lai veiktu rezervāciju šodienai, lūdzu, sazinieties ar mums pa tālruni:</p>
          <p className="phone">+371 2812 3456</p>
          <p>Ja nepieciešama steidzama apkope, mēs centīsimies jums palīdzēt pēc iespējas ātrāk.</p>
        </div>
      ) : !user ? (
        <div className="booking-login-prompt">
          <p>Lūdzu piesakieties, lai veiktu rezervāciju</p>
        </div>
      ) : !selectedDate ? (
        <div className="booking-prompt">
          <p>Izvēlieties datumu kalendārā</p>
        </div>
      ) : (
        <>
          <div className="time-slots">
            <h3>Pieejamie laiki {selectedDate.toLocaleDateString('lv-LV')}</h3>
            <div className="time-grid">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  className={`time-slot ${
                    !availableTimes.includes(time) ? 'time-slot-booked' : ''
                  } ${selectedTime === time ? 'time-slot-selected' : ''}`}
                  disabled={!availableTimes.includes(time)}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {showBookingForm && (
            <div className="booking-form-container">
              <div className="booking-form">
                <h3>Rezervācijas forma</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-section">
                    <h4>Auto informācija</h4>
                    <input
                      type="text"
                      placeholder="Marka"
                      value={carDetails.make}
                      onChange={(e) => setCarDetails({...carDetails, make: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Modelis"
                      value={carDetails.model}
                      onChange={(e) => setCarDetails({...carDetails, model: e.target.value})}
                    />
                    <input
                      type="number"
                      placeholder="Gads"
                      value={carDetails.year}
                      onChange={(e) => setCarDetails({...carDetails, year: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="VIN numurs"
                      value={carDetails.VIN}
                      onChange={(e) => setCarDetails({...carDetails, VIN: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Auto numurs"
                      value={carDetails.license_plate}
                      onChange={(e) => setCarDetails({...carDetails, license_plate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-section">
                    <h4>Izvēlieties pakalpojumu</h4>
                    <select 
                      className="service-select"
                      value={selectedServices[0] || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === 'custom') {
                          setSelectedServices(['custom']);
                        } else if (value) {
                          setSelectedServices([value]);
                        } else {
                          setSelectedServices([]);
                        }
                      }}
                    >
                      <option value="">Izvēlieties pakalpojumu</option>
                      {services.map(category => (
                        <optgroup key={category.category} label={category.category}>
                          {category.items.map(service => (
                            <option key={service.id} value={service.id}>
                              {service.name} (€{service.price})
                            </option>
                          ))}
                        </optgroup>
                      ))}
                      <option value="custom">Cits pakalpojums</option>
                    </select>

                    {selectedServices.includes('custom') && (
                      <div className="custom-service">
                        <textarea
                          placeholder="Aprakstiet nepieciešamo pakalpojumu"
                          value={customService}
                          onChange={(e) => setCustomService(e.target.value)}
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">Rezervēt</button>
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      onClick={() => setShowBookingForm(false)}
                    >
                      Atcelt
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}