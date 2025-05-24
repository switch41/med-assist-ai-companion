
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from 'lucide-react';
import AddMedicationDialog from '@/components/AddMedicationDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date: string;
  notes: string;
}

const Medications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadMedications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      console.error('Error loading medications:', error);
      toast({
        title: "Error",
        description: "Failed to load medications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedications();
  }, []);

  const handleMedicationAdded = () => {
    loadMedications();
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Pill className="mr-2 h-6 w-6 text-medical-primary" />
            Medications
          </h1>
          <AddMedicationDialog onMedicationAdded={handleMedicationAdded} />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading medications...</p>
          </div>
        ) : medications.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No medications added yet. Click "Add Medication" to get started.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {medications.map((med) => (
              <Card key={med.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>{med.name} - {med.dosage}</span>
                    {med.start_date && (
                      <span className="text-sm text-muted-foreground">
                        Started: {new Date(med.start_date).toLocaleDateString()}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {med.frequency && <p><strong>Frequency:</strong> {med.frequency}</p>}
                  {med.notes && <p><strong>Notes:</strong> {med.notes}</p>}
                  {med.end_date && (
                    <p><strong>End Date:</strong> {new Date(med.end_date).toLocaleDateString()}</p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Edit</Button>
                  <Button variant="outline">Remove</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Medications;
