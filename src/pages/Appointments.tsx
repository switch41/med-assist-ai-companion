
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Video } from 'lucide-react';
import AddAppointmentDialog from '@/components/AddAppointmentDialog';
import RescheduleDialog from '@/components/RescheduleDialog';

const Appointments = () => {
  const [appointments, setAppointments] = useState([
    { 
      id: 1,
      doctor: "Dr. Sarah Johnson", 
      specialty: "Cardiology", 
      date: "May 25, 2025", 
      time: "10:00 AM",
      type: "Virtual"
    },
    { 
      id: 2,
      doctor: "Dr. Michael Chen", 
      specialty: "Primary Care", 
      date: "June 3, 2025", 
      time: "2:30 PM",
      type: "In-person"
    }
  ]);

  const handleAppointmentAdded = () => {
    console.log('Appointment added successfully');
  };

  const handleReschedule = (appointmentId: number, newDate: string, newTime: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, date: newDate, time: newTime }
          : apt
      )
    );
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Calendar className="mr-2 h-6 w-6 text-medical-primary" />
            Appointments
          </h1>
          <AddAppointmentDialog onAppointmentAdded={handleAppointmentAdded} />
        </div>

        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{appointment.doctor}</span>
                  <span className="text-sm font-normal flex items-center">
                    {appointment.type === "Virtual" && <Video className="h-4 w-4 mr-1 text-medical-primary" />}
                    {appointment.type}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{appointment.specialty}</p>
                <p className="text-muted-foreground">{appointment.date} at {appointment.time}</p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <RescheduleDialog 
                  appointment={appointment}
                  onReschedule={handleReschedule}
                />
                {appointment.type === "Virtual" && (
                  <Button className="bg-medical-primary hover:bg-medical-primary/90 flex-1">
                    Join Call
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
