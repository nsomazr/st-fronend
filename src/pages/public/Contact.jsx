import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { Mail, MapPin, MessageCircle, Phone, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { WhatsAppLink } from '../../components/ui/WhatsAppChat';
import { contactSchema } from '../../utils/validators';
import { CONTACT } from '../../utils/constants';
import { contactApi } from '../../services/api';

const inputClass = (hasError) =>
  `w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 ${
    hasError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-brand-gold'
  }`;

export default function Contact() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    try {
      await contactApi.send(data);
      toast.success('Message sent successfully!');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <section className="bg-brand-navy py-16 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-3"
        >
          Contact Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-white/70"
        >
          We&apos;d love to hear from you
        </motion.p>
      </section>

      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-xl font-bold text-brand-navy mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-brand-navy mb-1">Name *</label>
                <input {...register('name')} className={inputClass(errors.name)} placeholder="Your name" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-brand-navy mb-1">Email *</label>
                <input {...register('email')} type="email" className={inputClass(errors.email)} placeholder="your@email.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-brand-navy mb-1">Phone</label>
                <input {...register('phone')} className={inputClass(errors.phone)} placeholder="+255..." />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-brand-navy mb-1">Message *</label>
                <textarea {...register('message')} rows={5} className={inputClass(errors.message)} placeholder="How can we help?" />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send Message'}
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            {[
              { icon: Phone, label: 'Phone', value: CONTACT.phoneDisplay, href: `tel:${CONTACT.phoneTel}` },
              { icon: MessageCircle, label: 'WhatsApp', value: "Let's chat on WhatsApp", href: CONTACT.whatsappUrl, external: true },
              { icon: Mail, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
              { icon: MapPin, label: 'Office Location', value: CONTACT.address },
            ].map((item) => (
              <Card key={item.label} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="font-semibold text-brand-navy hover:text-brand-purple transition-all duration-300"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-semibold text-brand-navy">{item.value}</p>
                  )}
                </div>
              </Card>
            ))}

            <Card className="bg-[#25D366]/10 border border-[#25D366]/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-brand-navy">Prefer WhatsApp?</p>
                  <p className="text-sm text-gray-600 mt-1">Chat with Smart Travels by HL on {CONTACT.phoneDisplay}</p>
                </div>
                <WhatsAppLink className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shrink-0">
                  <MessageCircle className="w-5 h-5" />
                  Let&apos;s chat on WhatsApp
                </WhatsAppLink>
              </div>
            </Card>

            <Card className="p-0 overflow-hidden">
              <iframe
                title="Office Location"
                src="https://maps.google.com/maps?q=Sukaei+House,+Posta,+Dar+es+Salaam,+Tanzania&output=embed"
                className="w-full h-64 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
