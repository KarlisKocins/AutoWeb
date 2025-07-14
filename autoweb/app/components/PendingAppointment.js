"use client";

import React, { useState } from "react";

export default function PendingAppointment({ appointmentData, isOpen, onClose, onStatusUpdate }) {
  const handleClick = async (status) => {
    const response = await fetch('/api/appointments/update_status', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appointment_id: appointmentData.id,
        status: status
      }),
    });

    const data = await response.json();
    if (response.ok) {
      onStatusUpdate(data.appointment);
      onClose();
    } else {
      console.error("Failed to update status");
    }
  };


  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <div className="appointment-info">
          <h2>Pieteikums</h2>
          <p><strong>Klients:</strong> {appointmentData.name}</p>
          <p><strong>Telefons:</strong> {appointmentData.phone}</p>
          <p><strong>E-pasts:</strong> {appointmentData.email}</p>
          <p><strong>Auto:</strong> {appointmentData.make} {appointmentData.model}</p>
          <p><strong>Numura zīme:</strong> {appointmentData.license_plate}</p>
          <p><strong>VIN:</strong> {appointmentData.vin}</p>
          <p><strong>Gads:</strong> {appointmentData.year}</p>
          <p><strong>Pakalpojums:</strong> {appointmentData.service_name} ({appointmentData.service_category})</p>
          <p><strong>Laiks:</strong> {appointmentData.time}</p>
          <p><strong>Datums:</strong> {appointmentData.date}</p>
          <p><strong>Piezīmes:</strong> {appointmentData.notes}</p>
        </div>

        <div className="appointment-actions">
          <button className="accept-button" onClick={() => handleClick("approved")}>
            Apstiprināt
          </button>
          <button className="deny-button" onClick={() => handleClick("denied")}>
            Noraidīt
          </button>
        </div>
      </div>
    </div>
  );
}
