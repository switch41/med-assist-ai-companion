
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, Plus } from 'lucide-react';

const Medications = () => {
  const medications = [
    { name: "Lisinopril", dosage: "10mg", schedule: "Once daily", remaining: 12 },
    { name: "Atorvastatin", dosage: "20mg", schedule: "Once daily at bedtime", remaining: 30 },
    { name: "Metformin", dosage: "500mg", schedule: "Twice daily with meals", remaining: 45 },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Pill className="mr-2 h-6 w-6 text-medical-primary" />
            Medications
          </h1>
          <Button className="bg-medical-primary hover:bg-medical-primary/90">
            <Plus className="h-4 w-4 mr-2" /> Add Medication
          </Button>
        </div>

        <div className="grid gap-4">
          {medications.map((med, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{med.name} - {med.dosage}</span>
                  <span className="text-sm text-muted-foreground">{med.remaining} remaining</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Schedule:</strong> {med.schedule}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View Details</Button>
                <Button variant="outline">Refill Request</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Medications;
