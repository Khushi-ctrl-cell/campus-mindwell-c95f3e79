import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar as CalendarIcon,
  Clock,
  User,
  Shield,
  CheckCircle,
  X
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AppointmentProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentScheduler = ({ isOpen, onClose }: AppointmentProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const purposes = [
    "General Counseling",
    "Academic Stress Support", 
    "Anxiety Management",
    "Depression Support",
    "Crisis Intervention",
    "Peer Relationship Issues",
    "Family Concerns",
    "Eating Disorder Support",
    "Substance Use Support",
    "Sleep Issues",
    "Other"
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !purpose) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to book an appointment.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('appointments')
        .insert([
          {
            user_id: userData.user.id,
            purpose,
            appointment_date: format(selectedDate, 'yyyy-MM-dd'),
            appointment_time: selectedTime,
            notes: notes.trim() || null,
            status: 'scheduled'
          }
        ]);

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Appointment Booked Successfully!",
        description: "You will receive a confirmation email shortly.",
      });

    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDate(undefined);
    setSelectedTime('');
    setPurpose('');
    setNotes('');
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-glow">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-gradient-calm rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Book Confidential Appointment</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Anonymous & Secure Booking</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isSubmitted ? (
          // Success State
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Appointment Confirmed!</h3>
              <p className="text-muted-foreground">
                Your appointment has been successfully booked for {selectedDate && format(selectedDate, 'MMMM d, yyyy')} at {selectedTime}.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-medium mb-2">What happens next?</p>
              <ul className="text-left space-y-1">
                <li>• You'll receive a confirmation email within 5 minutes</li>
                <li>• A counselor will be assigned to your appointment</li>
                <li>• You can reschedule or cancel up to 24 hours before</li>
                <li>• All appointments are completely confidential</li>
              </ul>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          // Booking Form
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Purpose Selection */}
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Appointment *</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger>
                  <SelectValue placeholder="Select the type of support you need" />
                </SelectTrigger>
                <SelectContent className="pointer-events-auto">
                  {purposes.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Appointment Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      date < new Date() || date.getDay() === 0 || date.getDay() === 6
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">
                Appointments are available Monday-Friday
              </p>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label>Preferred Time *</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment time" />
                </SelectTrigger>
                <SelectContent className="pointer-events-auto">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Information (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific concerns or information you'd like the counselor to know beforehand..."
                className="min-h-[80px]"
              />
            </div>

            {/* Privacy Notice */}
            <div className="bg-primary-soft/20 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4 text-primary" />
                <span>Privacy & Confidentiality</span>
              </div>
              <p className="text-sm text-muted-foreground">
                All appointments are completely confidential and compliant with privacy regulations. 
                Your personal information is encrypted and only accessible to assigned counselors.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !selectedDate || !selectedTime || !purpose}
                className="flex-1"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Booking...
                  </div>
                ) : (
                  <>
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Book Appointment
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default AppointmentScheduler;