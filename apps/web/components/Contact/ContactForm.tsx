import { Input, Textarea, Label } from "../ui/input";

export function ContactForm() {
  return (
    <form className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" placeholder="John" />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="Doe" />
        </div>
      </div>

      <div>
        <Label htmlFor="company">Company/Organization</Label>
        <Input id="company" placeholder="Your company name" />
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Tell us about your event or partnership idea..."
        />
      </div>

      <button type="submit" className="w-full py-6 bg-primary text-white">
        Send Message
      </button>
    </form>
  );
}
