
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Video,
  Search,
  User as UserIcon,
  Filter,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockSpeakersWithSlots, mockUser } from "@/data/mockData";
import { Booking, Speaker } from "@/types";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";

// Mock bookings data
const mockBookings: Booking[] = [
  {
    id: "b1",
    user_id: mockUser.id,
    speaker_id: "1",
    slot_id: "1-2023-05-20-10:00",
    date: "2025-05-10",
    start_time: "10:00",
    end_time: "11:00",
    status: "confirmed",
    created_at: "2023-05-01T10:30:00.000Z",
  },
  {
    id: "b2",
    user_id: mockUser.id,
    speaker_id: "2",
    slot_id: "2-2023-05-22-14:00",
    date: "2025-05-12",
    start_time: "14:00",
    end_time: "15:00",
    status: "confirmed",
    created_at: "2023-05-02T15:45:00.000Z",
  },
  {
    id: "b3",
    user_id: mockUser.id,
    speaker_id: "3",
    slot_id: "3-2023-04-10-09:00",
    date: "2023-04-10",
    start_time: "09:00",
    end_time: "10:00",
    status: "completed",
    created_at: "2023-03-20T09:15:00.000Z",
  },
];

const BookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Mock auth - in a real app, this would come from a context or store
    const userString = localStorage.getItem("user");
    if (userString) {
      setUser(JSON.parse(userString));
    } else {
      // Redirect to login if not authenticated
      navigate("/login");
    }

    // Mock API call
    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 500);
  }, [navigate]);

  // Get speaker details for a booking
  const getSpeakerForBooking = (speakerId: string) => {
    return mockSpeakersWithSlots.find((speaker) => speaker.id === speakerId);
  };

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter((booking) => {
    const speaker = getSpeakerForBooking(booking.speaker_id);
    const speakerName = speaker
      ? `${speaker.first_name} ${speaker.last_name}`.toLowerCase()
      : "";
    
    const matchesSearch =
      speakerName.includes(searchQuery.toLowerCase()) ||
      booking.date.includes(searchQuery);
    
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Separate upcoming and past bookings
  const today = new Date().toISOString().split("T")[0];
  const upcomingBookings = filteredBookings.filter(
    (booking) => booking.date >= today && booking.status === "confirmed"
  );
  const pastBookings = filteredBookings.filter(
    (booking) => booking.date < today || booking.status === "completed"
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">
              Manage your scheduled sessions with speakers
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex w-full items-center gap-3 md:w-auto">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Bookings</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                  <h3 className="mb-2 text-lg font-medium">No bookings found</h3>
                  {bookings.length === 0 ? (
                    <p className="mb-6 text-muted-foreground">
                      You haven't booked any sessions yet
                    </p>
                  ) : (
                    <p className="mb-6 text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  )}
                  <Button onClick={() => navigate("/speakers")}>
                    Browse Speakers
                  </Button>
                </div>
              ) : (
                <Tabs defaultValue="upcoming">
                  <TabsList>
                    <TabsTrigger value="upcoming">
                      Upcoming ({upcomingBookings.length})
                    </TabsTrigger>
                    <TabsTrigger value="past">
                      Past ({pastBookings.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {upcomingBookings.map((booking) => {
                        const speaker = getSpeakerForBooking(booking.speaker_id) as Speaker;
                        return (
                          <Card key={booking.id}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                  Session with{" "}
                                  <span className="font-bold text-primary">
                                    {speaker?.first_name} {speaker?.last_name}
                                  </span>
                                </CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex items-center">
                                  <Calendar className="mr-3 h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {format(
                                      parseISO(booking.date),
                                      "EEEE, MMMM d, yyyy"
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="mr-3 h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {booking.start_time} - {booking.end_time}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Video className="mr-3 h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Virtual (Zoom)</span>
                                </div>
                              </div>
                              <div className="mt-4 flex flex-wrap gap-2">
                                {speaker?.expertise.slice(0, 2).map((exp, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                                  >
                                    {exp}
                                  </span>
                                ))}
                                {speaker?.expertise.length > 2 && (
                                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                                    +{speaker.expertise.length - 2} more
                                  </span>
                                )}
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(`/speakers/${speaker.id}`)
                                }
                              >
                                <UserIcon className="mr-2 h-3 w-3" />
                                View Speaker
                              </Button>
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                              >
                                <Video className="mr-2 h-3 w-3" />
                                Join Session
                              </Button>
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                    {upcomingBookings.length === 0 && (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                        <h3 className="mb-2 text-lg font-medium">
                          No upcoming bookings
                        </h3>
                        <p className="mb-6 text-muted-foreground">
                          You don't have any upcoming sessions scheduled
                        </p>
                        <Button onClick={() => navigate("/speakers")}>
                          Browse Speakers
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="past" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {pastBookings.map((booking) => {
                        const speaker = getSpeakerForBooking(booking.speaker_id) as Speaker;
                        return (
                          <Card key={booking.id} className="opacity-80">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                  Session with{" "}
                                  <span className="font-bold">
                                    {speaker?.first_name} {speaker?.last_name}
                                  </span>
                                </CardTitle>
                                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                                  Completed
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex items-center">
                                  <Calendar className="mr-3 h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {format(
                                      parseISO(booking.date),
                                      "EEEE, MMMM d, yyyy"
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="mr-3 h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {booking.start_time} - {booking.end_time}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-4 flex flex-wrap gap-2">
                                {speaker?.expertise.slice(0, 2).map((exp, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
                                  >
                                    {exp}
                                  </span>
                                ))}
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(`/speakers/${speaker.id}`)
                                }
                              >
                                <UserIcon className="mr-2 h-3 w-3" />
                                View Speaker
                              </Button>
                              <Button size="sm" variant="secondary">
                                Leave a Review
                              </Button>
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                    {pastBookings.length === 0 && (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                        <h3 className="mb-2 text-lg font-medium">
                          No past bookings
                        </h3>
                        <p className="mb-6 text-muted-foreground">
                          You haven't attended any sessions yet
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingsPage;
