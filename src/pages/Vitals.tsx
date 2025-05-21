
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Vitals = () => {
  // Sample data for visualization
  const heartRateData = [
    { date: 'May 15', value: 72 },
    { date: 'May 16', value: 75 },
    { date: 'May 17', value: 71 },
    { date: 'May 18', value: 78 },
    { date: 'May 19', value: 74 },
    { date: 'May 20', value: 73 },
    { date: 'May 21', value: 76 },
  ];

  const bloodPressureData = [
    { date: 'May 15', systolic: 120, diastolic: 80 },
    { date: 'May 16', systolic: 118, diastolic: 79 },
    { date: 'May 17', systolic: 122, diastolic: 82 },
    { date: 'May 18', systolic: 125, diastolic: 84 },
    { date: 'May 19', systolic: 121, diastolic: 81 },
    { date: 'May 20', systolic: 119, diastolic: 79 },
    { date: 'May 21', systolic: 120, diastolic: 80 },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <HeartPulse className="mr-2 h-6 w-6 text-medical-primary" />
            Vitals & Wearable Data
          </h1>
          <Button className="bg-medical-primary hover:bg-medical-primary/90">
            <Plus className="h-4 w-4 mr-2" /> Log Vitals
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Heart Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={heartRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#ef4444" 
                      activeDot={{ r: 8 }} 
                      name="Heart Rate (bpm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <p className="text-2xl font-semibold">76 BPM</p>
                <p className="text-sm text-muted-foreground">Current Heart Rate</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Blood Pressure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bloodPressureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[60, 140]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="systolic" 
                      stroke="#0369a1" 
                      activeDot={{ r: 8 }}
                      name="Systolic (mmHg)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="diastolic" 
                      stroke="#0ea5e9" 
                      name="Diastolic (mmHg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <p className="text-2xl font-semibold">120/80 mmHg</p>
                <p className="text-sm text-muted-foreground">Current Blood Pressure</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Vitals;
