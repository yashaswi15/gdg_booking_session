
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Globe, MapPin, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { mockSpeakersWithSlots, mockUser } from "@/data/mockData";
import { Speaker, TimeSlot } from "@/types";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SpeakerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  
  // Get user from localStorage (mock auth)
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  // Fetch speaker data
  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      const foundSpeaker = mockSpeakersWithSlots.find((s) => s.id === id);
      if (foundSpeaker) {
        setSpeaker(foundSpeaker);
        
        // Filter available slots for today
        if (date && foundSpeaker.available_slots) {
          const todaySlots = foundSpeaker.available_slots.filter(
            (slot) => isSameDay(parseISO(slot.date), date) && !slot.is_booked
          );
          setAvailableSlots(todaySlots);
        }
      }
      setLoading(false);
    }, 500);
  }, [id]);

  // Update available slots when date changes
  useEffect(() => {
    if (date && speaker?.available_slots) {
      const filteredSlots = speaker.available_slots.filter(
        (slot) => isSameDay(parseISO(slot.date), date) && !slot.is_booked
      );
      setAvailableSlots(filteredSlots);
      setSelectedSlot(null);
    }
  }, [date, speaker]);

  // Handle booking confirmation
  const handleBookSession = () => {
    if (!user) {
      // Redirect to login if no user
      toast({
        title: "Authentication required",
        description: "Please login to book a session",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (selectedSlot) {
      setBookingDialogOpen(true);
    } else {
      toast({
        title: "No time slot selected",
        description: "Please select a time slot to book",
        variant: "destructive",
      });
    }
  };

  // Handle booking submission
  const confirmBooking = () => {
    setBookingDialogOpen(false);
    
    // Mock API call to book the session
    setTimeout(() => {
      // In a real app, this would be an API call
      if (speaker && selectedSlot) {
        // Mark the slot as booked
        const updatedSlots = speaker.available_slots?.map((slot) =>
          slot.id === selectedSlot.id ? { ...slot, is_booked: true } : slot
        );
        
        setSpeaker({
          ...speaker,
          available_slots: updatedSlots,
        });
        
        setConfirmationDialogOpen(true);
      }
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="container flex-1 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!speaker) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="container flex-1 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="mb-2 text-2xl font-bold">Speaker Not Found</h2>
            <p className="mb-6 text-muted-foreground">
              The speaker you're looking for doesn't exist
            </p>
            <Button onClick={() => navigate("/speakers")}>
              Back to Speakers
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Speaker Profile */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="mb-4 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/speakers")}
                  >
                    ← Back to Speakers
                  </Button>
                </div>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="h-32 w-32 overflow-hidden rounded-full">
                    <img
                      src={speaker.profile_image || "https://via.placeholder.com/300"}
                      alt={`${speaker.first_name} ${speaker.last_name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">
                      {speaker.first_name} {speaker.last_name}
                    </h1>
                    <div className="mt-2 flex items-center gap-1">
                      <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                      <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                      <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                      <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                      <Star className="h-5 w-5 fill-amber-500/50 text-amber-500" />
                      <span className="ml-2 text-sm font-medium">4.9 (24 reviews)</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {speaker.expertise.map((exp, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 text-lg">
                      <span className="font-semibold text-primary">
                        ${speaker.price_per_session}
                      </span>{" "}
                      per session
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <Tabs defaultValue="about">
                  <TabsList>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  <TabsContent value="about" className="mt-6">
                    <h2 className="mb-4 text-xl font-semibold">About</h2>
                    <p className="text-muted-foreground">{speaker.bio}</p>
                    
                    <h2 className="mb-4 mt-8 text-xl font-semibold">Details</h2>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Globe className="mr-3 h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Sessions available online
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          60 minute sessions
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Virtual meeting via Zoom
                        </span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="reviews">
                    <div className="space-y-6">
                      <div className="rounded-lg border p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 overflow-hidden rounded-full">
                              <img
                                src="https://i.pravatar.cc/300?img=10"
                                alt="Reviewer"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">Jennifer L.</h4>
                              <p className="text-xs text-muted-foreground">
                                2 weeks ago
                              </p>
                            </div>
                          </div>
                          <div className="flex">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          The session was incredibly insightful! {speaker.first_name} provided
                          practical advice that I could immediately apply to my
                          work. Would definitely book again.
                        </p>
                      </div>
                      
                      <div className="rounded-lg border p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 overflow-hidden rounded-full">
                              <img
                                src="https://i.pravatar.cc/300?img=11"
                                alt="Reviewer"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">Mark T.</h4>
                              <p className="text-xs text-muted-foreground">
                                1 month ago
                              </p>
                            </div>
                          </div>
                          <div className="flex">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <Star className="h-4 w-4 fill-none text-amber-500" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Great session overall. {speaker.first_name} was knowledgeable and
                          answered all my questions thoroughly. The only reason
                          for 4 stars is that we ran out of time before covering
                          everything I wanted to discuss.
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <Button variant="outline">View All Reviews</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Book a Session</CardTitle>
                  <CardDescription>
                    Select a date and time for your session
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => {
                            // Disable past dates
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-medium">
                      Available Time Slots
                    </h3>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={
                              selectedSlot?.id === slot.id ? "default" : "outline"
                            }
                            className="h-auto py-2"
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {slot.start_time}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md bg-muted p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          No available slots for this date
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={!selectedSlot}
                    onClick={handleBookSession}
                  >
                    Book Session
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>
              Please review the details of your session before confirming.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Speaker</h4>
                <p className="text-sm text-muted-foreground">
                  {speaker.first_name} {speaker.last_name}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Date</h4>
                <p className="text-sm text-muted-foreground">
                  {date && format(date, "MMMM d, yyyy")}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Time</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedSlot && selectedSlot.start_time} - {selectedSlot && selectedSlot.end_time}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Price</h4>
                <p className="text-sm text-muted-foreground">
                  ${speaker.price_per_session}
                </p>
              </div>
            </div>

            <div className="rounded-md bg-muted p-4">
              <h4 className="mb-2 text-sm font-medium">Important Notes</h4>
              <ul className="list-inside list-disc text-xs text-muted-foreground">
                <li>You will receive a confirmation email with session details</li>
                <li>A Google Calendar invitation will be sent to your email</li>
                <li>
                  Cancellations must be made at least 24 hours before the session
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBookingDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmBooking}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationDialogOpen}
        onOpenChange={setConfirmationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Successful!</DialogTitle>
            <DialogDescription>
              Your session has been booked successfully.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
              <div className="flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
              </div>
              <p className="mt-3 text-center text-sm font-medium text-green-800 dark:text-green-200">
                We've sent a confirmation email with all the details
              </p>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium">Session Details</h4>
              <div className="rounded-md border p-3">
                <div className="mb-2">
                  <span className="text-xs text-muted-foreground">Speaker:</span>
                  <p className="text-sm">
                    {speaker.first_name} {speaker.last_name}
                  </p>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-muted-foreground">Date:</span>
                  <p className="text-sm">{date && format(date, "MMMM d, yyyy")}</p>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-muted-foreground">Time:</span>
                  <p className="text-sm">
                    {selectedSlot && selectedSlot.start_time} - {selectedSlot && selectedSlot.end_time}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => navigate("/bookings")}>View My Bookings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default SpeakerDetailPage;
