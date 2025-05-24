
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddMedicationDialogProps {
  onMedicationAdded?: () => void;
}

const AddMedicationDialog: React.FC<AddMedicationDialogProps> = ({ onMedicationAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    start_date: '',
    end_date: '',
    notes: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) {
      toast({
        title: "Error",
        description: "Please fill in medication name and dosage",
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
        .from('medications')
        .insert({
          user_id: user.id,
          name: formData.name,
          dosage: formData.dosage,
          frequency: formData.frequency,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          notes: formData.notes
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Medication added successfully"
      });

      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        start_date: '',
        end_date: '',
        notes: ''
      });
      setOpen(false);
      onMedicationAdded?.();
    } catch (error) {
      console.error('Error adding medication:', error);
      toast({
        title: "Error",
        description: "Failed to add medication",
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
          <Plus className="h-4 w-4 mr-2" /> Add Medication
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Medication</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Medication Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter medication name"
              required
            />
          </div>

          <div>
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e) => setFormData({...formData, dosage: e.target.value})}
              placeholder="e.g., 10mg, 1 tablet"
              required
            />
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Input
              id="frequency"
              value={formData.frequency}
              onChange={(e) => setFormData({...formData, frequency: e.target.value})}
              placeholder="e.g., Once daily, Twice daily"
            />
          </div>

          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="end_date">End Date (Optional)</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({...formData, end_date: e.target.value})}
            />
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
            {loading ? 'Adding...' : 'Add Medication'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicationDialog;
