import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import { BRAND_NAME, TAGLINE, TEAM } from '../../utils/constants';

export default function About() {
  return (
    <>
      <section className="bg-brand-navy py-20 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-bold text-white mb-4"
        >
          About {BRAND_NAME}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-brand-gold italic text-lg"
        >
          {TAGLINE}
        </motion.p>
      </section>

      <section className="py-16 px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded in 2025, Smart Travels by HL was born from a passion for making travel accessible,
              enjoyable, and stress-free for everyone. Based in Dar es Salaam, Tanzania, we serve clients
              across East Africa and beyond.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From solo adventurers to family vacationers, corporate travelers to honeymooners, we craft
              personalized travel experiences that exceed expectations. Our team combines local expertise
              with global connections to deliver the best value and service.
            </p>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {[
            { title: 'Our Mission', text: 'To empower every traveler with expert guidance, seamless booking, and unforgettable experiences at the best value.', color: 'border-brand-gold' },
            { title: 'Our Vision', text: 'To be East Africa\'s most trusted travel consultancy, known for integrity, innovation, and exceptional customer care.', color: 'border-brand-purple' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`border-l-4 ${item.color}`}>
                <h3 className="text-xl font-bold text-brand-navy mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-brand-navy text-center mb-10">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="text-center">
                <div className="w-20 h-20 bg-brand-navy rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {member.initials}
                </div>
                <h3 className="font-bold text-brand-navy">{member.name}</h3>
                <p className="text-brand-purple text-sm">{member.role}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
