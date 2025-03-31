import React, { useState } from "react";
import emailjs from "emailjs-com";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import SectionHeading from "./SectionHeading";
import AnimatedSection from "./AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs
      .send(
        "service_7h1y40o", // Replace with your Email.js service ID
        "template_ji8luik", // Replace with your Email.js template ID
        {
          from_name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        "P1abvyaZHwcVEObAo" // Replace with your Email.js public key
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          alert("Message sent successfully!");
          setFormData({ name: "", email: "", subject: "", message: "" });
        },
        (err) => {
          console.log("FAILED...", err);
          alert("Failed to send message. Please try again later.");
        }
      );
  };

  return (
    <section id="contact" className="section bg-muted/30">
      <div className="container-wide">
        <AnimatedSection animation="slide-up">
          <SectionHeading
            title="Contact Us"
            subtitle="Get in touch with our team for inquiries, demos, or support with our sepsis detection platform."
          />
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <AnimatedSection animation="slide-right">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-2xl font-semibold font-display mb-6">
                Send us a message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="How can we help you?"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Please provide details about your inquiry..."
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </AnimatedSection>

          {/* Contact Information */}
          <AnimatedSection animation="slide-left" className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-2xl font-semibold font-display mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <ContactInfo
                  icon={<Mail className="h-5 w-5" />}
                  title="Email Us"
                  info="info@sepsiscare.med"
                  description="For general inquiries and information"
                />

                <ContactInfo
                  icon={<MessageSquare className="h-5 w-5" />}
                  title="Technical Support"
                  info="support@sepsiscare.med"
                  description="24/7 assistance with platform issues"
                />

                <ContactInfo
                  icon={<Phone className="h-5 w-5" />}
                  title="Call Us"
                  info="+1 (555) 123-4567"
                  description="Monday to Friday, 9am - 5pm EST"
                />

                <ContactInfo
                  icon={<MapPin className="h-5 w-5" />}
                  title="Visit Us"
                  info="123 Medical Center Drive, Boston, MA 02115"
                  description="Schedule an in-person demonstration"
                />
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-sm p-4 h-72">
              <div className="h-full w-full rounded-xl bg-muted flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">
                  Interactive Google Map would be embedded here
                  <br />
                  <span className="text-sm">
                    (Requires Google Maps API Key)
                  </span>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

interface ContactInfoProps {
  icon: React.ReactNode;
  title: string;
  info: string;
  description: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  icon,
  title,
  info,
  description,
}) => (
  <div className="flex space-x-4">
    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-foreground font-medium mt-1">{info}</p>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  </div>
);

export default Contact;
