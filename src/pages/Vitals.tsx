
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from '@/components/FileUpload';
import FileManager from '@/components/FileManager';
import AddVitalsDialog from '@/components/AddVitalsDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Vital {
  id: string;
  vital_type: string;
  value: number;
  unit: string;
  measured_at: string;
  notes: string;
  source: string;
}

const Vitals = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    
    getUser();
  }, []);

  const loadVitals = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('user_id', userId)
        .order('measured_at', { ascending: false });

      if (error) throw error;
      setVitals(data || []);
    } catch (error) {
      console.error('Error loading vitals:', error);
      toast({
        title: "Error",
        description: "Failed to load vitals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadVitals();
    }
  }, [userId]);

  const handleVitalAdded = () => {
    loadVitals();
  };

  // Sample data for visualization (you can replace this with actual data from vitals)
  const heartRateData = vitals
    .filter(v => v.vital_type === 'heart_rate')
    .slice(0, 7)
    .map(v => ({
      date: new Date(v.measured_at).toLocaleDateString(),
      value: v.value
    }));

  const bloodPressureData = vitals
    .filter(v => v.vital_type === 'blood_pressure_systolic' || v.vital_type === 'blood_pressure_diastolic')
    .slice(0, 7)
    .reduce((acc, v) => {
      const date = new Date(v.measured_at).toLocaleDateString();
      const existing = acc.find(item => item.date === date);
      if (existing) {
        if (v.vital_type === 'blood_pressure_systolic') {
          existing.systolic = v.value;
        } else {
          existing.diastolic = v.value;
        }
      } else {
        acc.push({
          date,
          systolic: v.vital_type === 'blood_pressure_systolic' ? v.value : 0,
          diastolic: v.vital_type === 'blood_pressure_diastolic' ? v.value : 0
        });
      }
      return acc;
    }, [] as any[]);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <HeartPulse className="mr-2 h-6 w-6 text-medical-primary" />
            Vitals & Wearable Data
          </h1>
          <AddVitalsDialog onVitalAdded={handleVitalAdded} />
        </div>

        <Tabs defaultValue="charts">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="files">Data Files</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Heart Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={heartRateData.length > 0 ? heartRateData : [
                        { date: 'May 15', value: 72 },
                        { date: 'May 16', value: 75 },
                        { date: 'May 17', value: 71 },
                        { date: 'May 18', value: 78 },
                        { date: 'May 19', value: 74 },
                        { date: 'May 20', value: 73 },
                        { date: 'May 21', value: 76 },
                      ]}>
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
                    <p className="text-2xl font-semibold">
                      {heartRateData.length > 0 ? `${heartRateData[0].value} BPM` : '76 BPM'}
                    </p>
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
                      <LineChart data={bloodPressureData.length > 0 ? bloodPressureData : [
                        { date: 'May 15', systolic: 120, diastolic: 80 },
                        { date: 'May 16', systolic: 118, diastolic: 79 },
                        { date: 'May 17', systolic: 122, diastolic: 82 },
                        { date: 'May 18', systolic: 125, diastolic: 84 },
                        { date: 'May 19', systolic: 121, diastolic: 81 },
                        { date: 'May 20', systolic: 119, diastolic: 79 },
                        { date: 'May 21', systolic: 120, diastolic: 80 },
                      ]}>
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
          </TabsContent>

          <TabsContent value="files" className="mt-4">
            <div className="space-y-6">
              {userId ? (
                <>
                  <FileUpload 
                    type="vitals" 
                    userId={userId}
                    onUploadSuccess={() => window.location.reload()}
                  />
                  <FileManager type="vitals" userId={userId} />
                </>
              ) : (
                <Card className="p-8 flex items-center justify-center">
                  <p className="text-muted-foreground">Please log in to upload and manage vitals data files</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Vitals;
