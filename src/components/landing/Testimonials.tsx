import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "MCA Student",
    avatar: "RS",
    content: "This platform saved me hours of searching for study materials. All notes are well-organized by module and easy to download!",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "BCA Final Year",
    avatar: "PP",
    content: "The previous year question papers helped me understand the exam pattern. I scored much better after using this resource.",
    rating: 5,
  },
  {
    name: "Amit Kumar",
    role: "BTech CS Student",
    avatar: "AK",
    content: "Having all subjects organized by branch and year makes it so easy to find what I need. Highly recommend for all students!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Loved by <span className="text-gradient">Students</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of students who are already using our platform to ace their exams.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              <Quote className="w-10 h-10 text-primary/20 mb-4" />
              
              <p className="text-foreground mb-6">{testimonial.content}</p>
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
