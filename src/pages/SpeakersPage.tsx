
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { mockSpeakersWithSlots } from "@/data/mockData";
import { Speaker } from "@/types";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { Search, Star } from "lucide-react";

const SpeakersPage = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>(mockSpeakersWithSlots);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Get all unique expertise areas from speakers
  const allExpertise = mockSpeakersWithSlots.reduce((acc, speaker) => {
    speaker.expertise.forEach((exp) => {
      if (!acc.includes(exp)) {
        acc.push(exp);
      }
    });
    return acc;
  }, [] as string[]);

  // Filter speakers based on search query
  const filteredSpeakers = speakers.filter((speaker) => {
    const fullName = `${speaker.first_name} ${speaker.last_name}`.toLowerCase();
    const expertiseMatch = speaker.expertise.some((exp) =>
      exp.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
      fullName.includes(searchQuery.toLowerCase()) || expertiseMatch
    );
  });

  // Sort speakers based on selected sorting option
  const sortedSpeakers = [...filteredSpeakers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return `${a.first_name} ${a.last_name}`.localeCompare(
          `${b.first_name} ${b.last_name}`
        );
      case "price-low":
        return a.price_per_session - b.price_per_session;
      case "price-high":
        return b.price_per_session - a.price_per_session;
      default:
        return 0;
    }
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Find a Speaker</h1>
            <p className="text-muted-foreground">
              Browse our collection of expert speakers and book a session
            </p>
          </div>

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex w-full gap-3 md:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            <span className="text-sm font-medium">Popular Expertise:</span>
            {allExpertise.slice(0, 5).map((expertise) => (
              <button
                key={expertise}
                onClick={() => setSearchQuery(expertise)}
                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20"
              >
                {expertise}
              </button>
            ))}
          </div>

          {sortedSpeakers.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedSpeakers.map((speaker) => (
                <Card key={speaker.id} className="overflow-hidden">
                  <div className="aspect-[3/2]">
                    <img
                      src={speaker.profile_image || "https://via.placeholder.com/300"}
                      alt={`${speaker.first_name} ${speaker.last_name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>
                        {speaker.first_name} {speaker.last_name}
                      </CardTitle>
                      <span className="flex items-center text-amber-500">
                        <Star className="mr-1 h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">4.9</span>
                      </span>
                    </div>
                    <CardDescription>
                      ${speaker.price_per_session} per session
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {speaker.expertise.map((exp, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {speaker.bio}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/speakers/${speaker.id}`} className="w-full">
                      <Button className="w-full">View Profile</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <h3 className="mb-2 text-lg font-medium">No speakers found</h3>
              <p className="mb-6 text-muted-foreground">
                Try adjusting your search or filters
              </p>
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SpeakersPage;
