
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, Phone, MessageSquare, FileText } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Help = () => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <HelpCircle className="mr-2 h-6 w-6 text-medical-primary" />
          Help & Support
        </h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How accurate is the Symptom Checker?</AccordionTrigger>
                  <AccordionContent>
                    MediAssist's Symptom Checker uses advanced AI to provide preliminary assessments with approximately 90% accuracy for common conditions. However, it is not a replacement for professional medical diagnosis. Always consult with a healthcare provider for proper evaluation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is my health information secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes, MediAssist is fully HIPAA-compliant and employs end-to-end encryption for all patient data. Your information is never shared with third parties without your explicit consent, and we implement industry-leading security measures to protect your privacy.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I connect my wearable device?</AccordionTrigger>
                  <AccordionContent>
                    To connect your wearable device, go to the Vitals section and select "Connect Device." MediAssist supports integration with Apple Health, Google Fit, Fitbit, and other major wearable platforms. Follow the on-screen instructions to complete the connection.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I share my health records with my doctor?</AccordionTrigger>
                  <AccordionContent>
                    Yes, MediAssist allows secure sharing of your health records with healthcare providers. In the Health Records section, select the documents you wish to share and use the "Share with Provider" option. You can grant temporary or permanent access as needed.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do medication reminders work?</AccordionTrigger>
                  <AccordionContent>
                    MediAssist's medication reminders can be set up in the Medications section. Once configured, you'll receive notifications based on your preferences (app, email, or SMS) at scheduled times. The system can also alert you when refills are needed.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-medical-primary" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-muted-foreground">1-800-MEDI-ASSIST (1-800-633-4277)</p>
                      <p className="text-sm text-muted-foreground">Available Mon-Fri, 8am-8pm EST</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-medical-primary" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@mediassist.health</p>
                      <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-medical-primary" />
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-sm text-muted-foreground">Available 24/7 for urgent issues</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Send us a message</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Your email" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="How can we help you?" />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Describe your issue in detail..." className="min-h-[120px]" />
                    </div>
                    <Button className="w-full bg-medical-primary hover:bg-medical-primary/90">
                      Submit Request
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documentation & Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button variant="outline" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  User Guide
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Terms of Service
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  HIPAA Compliance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

const Label: React.FC<LabelProps> = ({ htmlFor, ...props }) => {
  return (
    <label 
      htmlFor={htmlFor}
      className="text-sm font-medium mb-2 block"
      {...props}
    />
  );
};
