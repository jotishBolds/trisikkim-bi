"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight, MapPin, Building2, Mountain, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Dignitary {
  id: number;
  name: string;
  role: string;
  image: string;
}

const SIKKIM_FACTS = [
  { icon: MapPin, value: "7,096 km²", label: "Total Area" },
  { icon: Users, value: "6,07,688", label: "Population (2011)" },
  { icon: Mountain, value: "8,586 m", label: "Kangchenjunga Peak" },
  { icon: Building2, value: "35%", label: "UNESCO Heritage Area" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: "easeOut" },
  }),
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function AboutSection() {
  const [dignitaries, setDignitaries] = useState<Dignitary[]>([]);

  useEffect(() => {
    fetch("/api/dignitaries")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setDignitaries(d.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white font-body">
      <div className="bg-gradient-to-b from-[#f4f3fb] to-white border-b border-[#322880]/8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center text-[11px] font-bold uppercase tracking-[.18em] text-[#f4c430] mb-8"
          >
            Distinguished Leadership
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {dignitaries.map((person, i) => (
              <motion.div
                key={person.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <DignitaryCard {...person} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionLabel icon={Mountain} text="Geography & Heritage" />
            <SectionTitle>About Sikkim</SectionTitle>

            <div className="space-y-4 text-[15px] text-[#1a1550]/80 leading-[1.85] mt-6">
              <p>
                Sikkim, a state in India, is located in the northeastern part of
                the country, within the eastern Himalayas. It stands as one of
                the smallest states in India. Sikkim shares its borders with the
                Tibet Autonomous Region of China to the north and northeast,
                Bhutan to the southeast, the Indian state of West Bengal to the
                south, and Nepal to the west. The capital is Gangtok, situated
                in the southeastern part of the state.
              </p>
              <p>
                A part of the Eastern Himalaya, Sikkim is notable for its
                biodiversity, including alpine and subtropical climates, as well
                as being a host to Kangchenjunga, the highest peak in India and
                the third highest on Earth. Notably, Khangchendzonga National
                Park, situated within Sikkim&apos;s borders, holds the
                prestigious status of being a{" "}
                <strong className="text-[#1a1550] font-semibold">
                  UNESCO World Heritage Site
                </strong>
                . Covering almost 35% of the state, this protected area
                showcases remarkable natural beauty and ecological significance.
              </p>
              <p>
                Long a sovereign political entity, Sikkim became a protectorate
                of India in 1950 and an Indian state in 1975. Despite its small
                size, Sikkim is of great political and strategic importance for
                India because of its location along several international
                boundaries. The state covers an area of 2,740 square miles
                (7,096 sq km) and had a population of 607,688 as of 2011.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:pt-16"
          >
            <div className="relative rounded-2xl overflow-hidden mb-8 aspect-[4/3] bg-gradient-to-br from-[#1077A6] to-[#0e6590]">
              <Image
                src="/modi.jpg"
                alt="Sikkim Landscape"
                fill
                className="object-cover "
                unoptimized
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#1077A6]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white font-display font-bold text-lg leading-tight">
                  The Organic State of India
                </p>
                <p className="text-[#f4c430] text-[12px] mt-1 tracking-wide">
                  Northeast Himalayas · Gangtok Capital
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SIKKIM_FACTS.map((fact, i) => (
                <motion.div
                  key={fact.label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="group p-4 rounded-xl border border-[#1077A6]/10 bg-[#f4f3fb]/60 hover:bg-[#1077A6] transition-all duration-300 cursor-default"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#f4c430]/15 group-hover:bg-[#f4c430]/25 flex items-center justify-center mb-3 transition-colors duration-300">
                    <fact.icon className="w-4 h-4 text-[#1a1550] group-hover:text-[#f4c430] transition-colors duration-300" />
                  </div>
                  <div className="font-display font-bold text-[20px] text-[#1a1550] group-hover:text-white leading-none transition-colors duration-300">
                    {fact.value}
                  </div>
                  <div className="text-[#1a1550]/50 group-hover:text-white/60 text-[11.5px] mt-1 tracking-wide transition-colors duration-300">
                    {fact.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-[#1077A6]/15 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="grid grid-cols-1 gap-4">
              <TRICard
                number="01"
                title="Research & Documentation"
                description="Preservation of Tribal Community knowledge, oral traditions, and cultural practices through systematic documentation."
                accent="#f4c430"
              />
              <TRICard
                number="02"
                title="Training & Capacity Building"
                description="Empowering tribal communities through training on laws, constitutional provisions, and socio-economic programs."
                accent="#f4c430"
              />
              <TRICard
                number="03"
                title="Grants & Financial Support"
                description="Facilitating Grants-in-Aid under the Ministry of Tribal Affairs' 'Research and Mass Information' scheme."
                accent="#f4c430"
              />
            </div>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <SectionLabel icon={Building2} text="Our Institution" />
            <SectionTitle>About Tribal Research Institute</SectionTitle>

            <div className="space-y-4 text-[15px] text-[#1a1550]/80 leading-[1.85] mt-6">
              <p>
                The Schemes of the Government of India reveals that, through the
                Ministry of Tribal Affairs, Government of India has decided to
                continue the scheme Grants-in-Aid to Tribal Research Institutes,
                Sikkim as a component of the{" "}
                <strong className="text-[#1a1550] font-semibold">
                  &ldquo;Research and Mass Information&rdquo;
                </strong>{" "}
                scheme, with revised financial norms and identified
                interventions.
              </p>
              <p>
                Identifying challenges in the field of socio-economic
                development of Schedule Tribe&apos;s and understanding,
                promoting, and preserving their culture become important when
                formulating various developmental programs. The basic objectives
                of the scheme are to strengthen Tribal Research Institute (TRI)
                in the area of research and documentation (Preservation of
                Tribal Community), training and capacity-building on
                laws/constitutional provisions, capacity building of
                functionaries and the Tribal representation on socio-economic
                programs.
              </p>
              <p>
                Grants will be given to Tribal Research Institute (TRI) set up
                for various State Governments, keeping in view the considerable
                percentage of Scheduled Tribe population in the State of Sikkim.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className="mt-8"
            >
              <Link
                href="/about"
                className="group inline-flex items-center gap-2.5 bg-[#1077A6] hover:bg-[#f4c430] text-white hover:text-black px-6 py-3 rounded-lg text-[14px] font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#f4c430]/25"
              >
                Read More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DignitaryCard({
  name,
  role,
  image,
}: {
  name: string;
  role: string;
  image: string;
}) {
  return (
    <div className="group flex flex-col items-center text-center">
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-[#f4c430]/20 blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden border-3 border-white shadow-lg ring-2 ring-[#1077A6]/10 group-hover:ring-[#f4c430]/40 transition-all duration-300">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover object-top"
            unoptimized
          />
        </div>
      </div>

      <h3 className="font-display font-bold text-[#1a1550] text-[14px] leading-snug group-hover:text-[#f4c430] transition-colors duration-200">
        {name}
      </h3>
      <p className="text-[#1a1550]/50 text-[12.5px] mt-1">{role}</p>
    </div>
  );
}

function SectionLabel({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded bg-[#f4c430]/15 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-[#1a1550]" />
      </div>
      <span className="text-[11px] font-bold uppercase tracking-[.18em] text-[#f4c430]">
        {text}
      </span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-bold text-[#1a1550] text-[clamp(22px,3vw,34px)] leading-tight tracking-tight">
      {children}
      <span className="block w-12 h-1 bg-[#f4c430] rounded-full mt-3" />
    </h2>
  );
}

function TRICard({
  number,
  title,
  description,
  accent,
}: {
  number: string;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="group flex items-start gap-4 p-5 rounded-xl border border-[#1077A6]/10 bg-[#f4f3fb]/50 hover:bg-white hover:border-[#f4c430]/30 hover:shadow-md transition-all duration-300"
    >
      <div
        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-[13px] font-bold font-display transition-all duration-300"
        style={{
          background: `${accent}18`,
          color: accent,
          border: `1px solid ${accent}30`,
        }}
      >
        {number}
      </div>
      <div>
        <h4 className="font-display font-bold text-[#1a1550] text-[14.5px] mb-1.5 leading-tight">
          {title}
        </h4>
        <p className="text-[#1a1550]/55 text-[13px] leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
