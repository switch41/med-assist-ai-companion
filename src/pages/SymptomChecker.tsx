
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity } from 'lucide-react';

const SymptomChecker = () => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Activity className="mr-2 h-6 w-6 text-medical-primary" />
          Symptom Checker
        </h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
            <CardDescription>
              Describe your symptoms below and our AI will help assess your condition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input 
              placeholder="E.g. I've had a headache for 3 days and feel dizzy when standing up" 
              className="mb-4"
            />
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button variant="outline" className="justify-start">
                Headache
              </Button>
              <Button variant="outline" className="justify-start">
                Fever
              </Button>
              <Button variant="outline" className="justify-start">
                Cough
              </Button>
              <Button variant="outline" className="justify-start">
                Fatigue
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-medical-primary hover:bg-medical-primary/90">
              Check My Symptoms
            </Button>
          </CardFooter>
        </Card>
        
        <p className="text-sm text-muted-foreground mb-10">
          Note: MediAssist is not a replacement for professional medical advice. 
          If you're experiencing severe symptoms, please contact emergency services.
        </p>
      </div>
    </div>
  );
};

export default SymptomChecker;
