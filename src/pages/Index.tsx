
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { CalendarCheck, Presentation, Users, Clock } from "lucide-react";
import { mockSpeakers } from "@/data/mockData";

const features = [
  {
    title: "Expert Speakers",
    description: "Access industry-leading experts across various domains",
    icon: <Presentation className="h-8 w-8 text-primary" />,
  },
  {
    title: "Flexible Scheduling",
    description: "Book sessions at times that work with your schedule",
    icon: <Clock className="h-8 w-8 text-primary" />,
  },
  {
    title: "Personal Growth",
    description: "Learn directly from professionals to advance your career",
    icon: <Users className="h-8 w-8 text-primary" />,
  },
  {
    title: "Calendar Integration",
    description: "Seamless Google Calendar integration for session reminders",
    icon: <CalendarCheck className="h-8 w-8 text-primary" />,
  },
];

const Index = () => {
  // Display 3 featured speakers from our mock data
  const featuredSpeakers = mockSpeakers.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-20 dark:from-gray-900 dark:to-gray-800">
          <div className="container flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex flex-col gap-6 md:w-1/2">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Book Sessions with <span className="text-primary">Expert Speakers</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Connect with industry leaders for personalized sessions to
                enhance your knowledge and skills.
              </p>
              <div className="flex gap-4">
                <Link to="/speakers">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Browse Speakers
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline">
                    Sign Up Now
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&q=80"
                alt="Speaker giving a presentation"
                className="rounded-lg object-cover shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Featured Speakers */}
        <section className="py-16">
          <div className="container">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Speakers
              </h2>
              <p className="mt-2 text-muted-foreground">
                Learn from these industry experts
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {featuredSpeakers.map((speaker) => (
                <div
                  key={speaker.id}
                  className="flex flex-col overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:shadow-md"
                >
                  <div className="aspect-[4/3] w-full">
                    <img
                      src={speaker.profile_image}
                      alt={`${speaker.first_name} ${speaker.last_name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <h3 className="text-xl font-semibold">
                      {speaker.first_name} {speaker.last_name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {speaker.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {speaker.bio}
                    </p>
                    <div className="mt-4 flex justify-between">
                      <span className="text-sm font-medium">
                        ${speaker.price_per_session}/session
                      </span>
                      <Link to={`/speakers/${speaker.id}`}>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link to="/speakers">
                <Button>View All Speakers</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-slate-50 py-16 dark:bg-gray-900">
          <div className="container">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Why Choose SpeakerBook?
              </h2>
              <p className="mt-2 text-muted-foreground">
                We make it easy to connect with the expertise you need
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-sm dark:bg-gray-800"
                >
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container">
            <div className="rounded-lg bg-primary p-8 md:p-16">
              <div className="flex flex-col items-center gap-6 text-center">
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  Ready to Start Your Learning Journey?
                </h2>
                <p className="max-w-2xl text-lg text-primary-foreground">
                  Join SpeakerBook today and connect with expert speakers who can help
                  you reach your goals through personalized sessions.
                </p>
                <div className="flex gap-4">
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90"
                    >
                      Sign Up Now
                    </Button>
                  </Link>
                  <Link to="/speakers">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      Browse Speakers
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
