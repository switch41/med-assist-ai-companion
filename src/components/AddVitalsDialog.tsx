
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddVitalsDialogProps {
  onVitalAdded?: () => void;
}

const AddVitalsDialog: React.FC<AddVitalsDialogProps> = ({ onVitalAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vital_type: '',
    value: '',
    unit: '',
    notes: '',
    source: 'manual'
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vital_type || !formData.value) {
      toast({
        title: "Error",
        description: "Please fill in vital type and value",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('vitals')
        .insert({
          user_id: user.id,
          vital_type: formData.vital_type,
          value: parseFloat(formData.value),
          unit: formData.unit,
          notes: formData.notes,
          source: formData.source
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vital record added successfully"
      });

      setFormData({
        vital_type: '',
        value: '',
        unit: '',
        notes: '',
        source: 'manual'
      });
      setOpen(false);
      onVitalAdded?.();
    } catch (error) {
      console.error('Error adding vital:', error);
      toast({
        title: "Error",
        description: "Failed to add vital record",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-medical-primary hover:bg-medical-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Log Vitals
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Vital Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vital_type">Vital Type</Label>
            <Select value={formData.vital_type} onValueChange={(value) => setFormData({...formData, vital_type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select vital type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="heart_rate">Heart Rate</SelectItem>
                <SelectItem value="blood_pressure_systolic">Blood Pressure (Systolic)</SelectItem>
                <SelectItem value="blood_pressure_diastolic">Blood Pressure (Diastolic)</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="weight">Weight</SelectItem>
                <SelectItem value="height">Height</SelectItem>
                <SelectItem value="blood_sugar">Blood Sugar</SelectItem>
                <SelectItem value="oxygen_saturation">Oxygen Saturation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="number"
              step="0.1"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              placeholder="Enter value"
              required
            />
          </div>

          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
              placeholder="e.g., bpm, mmHg, °F, kg"
            />
          </div>

          <div>
            <Label htmlFor="source">Source</Label>
            <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual Entry</SelectItem>
                <SelectItem value="wearable">Wearable Device</SelectItem>
                <SelectItem value="clinic">Clinic/Hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Vital'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVitalsDialog;
