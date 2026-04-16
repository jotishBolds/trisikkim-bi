"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight, MapPin, Building2, Mountain, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation, langHref } from "@/lib/i18n/use-translation";

interface Dignitary {
  id: number;
  name: string;
  role: string;
  image: string;
  translations?: { hi?: { name?: string; role?: string } } | null;
}

const SIKKIM_FACT_DATA = [
  { icon: MapPin, value: "7,096 km²", labelKey: "totalArea" as const },
  { icon: Users, value: "6,07,688", labelKey: "population" as const },
  { icon: Mountain, value: "8,586 m", labelKey: "kangchenjungaPeak" as const },
  { icon: Building2, value: "35%", labelKey: "unescoArea" as const },
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
  const { lang, dict } = useTranslation();
  const d = dict.aboutSection;
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
      <div className="bg-linear-to-b from-[#f4f3fb] to-white border-b border-[#322880]/8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center text-[11px] font-bold uppercase tracking-[.18em] text-[#1077A6] mb-8"
          >
            {d.distinguishedLeadership}
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
                <DignitaryCard
                  name={
                    lang !== "en" && person.translations?.hi?.name
                      ? person.translations.hi.name
                      : person.name
                  }
                  role={
                    lang !== "en" && person.translations?.hi?.role
                      ? person.translations.hi.role
                      : person.role
                  }
                  image={person.image}
                />
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
            <SectionLabel icon={Mountain} text={d.geographyHeritage} />
            <SectionTitle>{d.aboutSikkim}</SectionTitle>

            <div className="space-y-4 text-[15px] text-[#1a1550]/80 leading-[1.85] mt-6">
              <p className="text-justify hyphens-auto break-words">
                {d.sikkimPara1}
              </p>
              <p className="text-justify hyphens-auto break-words">
                {d.sikkimPara2.split(d.unescoWorldHeritage).length > 1 ? (
                  <>
                    {d.sikkimPara2.split(d.unescoWorldHeritage)[0]}
                    <strong className="text-[#1a1550] font-semibold">
                      {d.unescoWorldHeritage}
                    </strong>
                    {d.sikkimPara2.split(d.unescoWorldHeritage)[1]}
                  </>
                ) : (
                  d.sikkimPara2
                )}
              </p>
              <p className="text-justify hyphens-auto break-words">
                {d.sikkimPara3}
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
            <div className="relative rounded-2xl overflow-hidden mb-8 aspect-[4/3] bg-linear-to-br from-[#1077A6] to-[#0e6590]">
              <Image
                src="/modi.jpg"
                alt="Sikkim Landscape"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1077A6]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                {/* <p className="text-white font-display font-bold text-lg leading-tight">
                  {d.organicState}
                </p>
                <p className="text-[#f4c430] text-[12px] mt-1 tracking-wide">
                  {d.northeastHimalayas}
                </p> */}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SIKKIM_FACT_DATA.map((fact, i) => (
                <motion.div
                  key={fact.labelKey}
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
                    {d[fact.labelKey]}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="h-px bg-linear-to-r from-transparent via-[#1077A6]/15 to-transparent" />
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
                title={d.card01Title}
                description={d.card01Desc}
                accent="#1A3A6B"
              />
              <TRICard
                number="02"
                title={d.card02Title}
                description={d.card02Desc}
                accent="#1A3A6B"
              />
              <TRICard
                number="03"
                title={d.card03Title}
                description={d.card03Desc}
                accent="#1A3A6B"
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
            <SectionLabel icon={Building2} text={d.aboutInstitute} />
            <SectionTitle>{d.aboutTritc}</SectionTitle>

            <div className="space-y-4 text-[15px] text-[#1a1550]/80 leading-[1.85] mt-6">
              <p className="text-justify hyphens-auto break-words">
                {d.institutePara1.split(d.researchMassInfo).length > 1 ? (
                  <>
                    {d.institutePara1.split(d.researchMassInfo)[0]}
                    <strong className="text-[#1a1550] font-semibold">
                      &ldquo;{d.researchMassInfo}&rdquo;
                    </strong>
                    {d.institutePara1.split(d.researchMassInfo)[1]}
                  </>
                ) : (
                  d.institutePara1
                )}
              </p>
              <p className="text-justify hyphens-auto break-words">
                {d.institutePara2}
              </p>
              <p className="text-justify hyphens-auto break-words">
                {d.institutePara3}
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
                href={langHref(lang, "/about")}
                className="group inline-flex items-center gap-2.5 bg-[#1077A6] hover:bg-[#f4c430] text-white hover:text-black px-6 py-3 rounded-lg text-[14px] font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#f4c430]/25"
              >
                {dict.common.readMore}
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
      <span className="text-[11px] font-bold uppercase tracking-[.18em] text-[#1077A6]">
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
        className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-[13px] font-bold font-display transition-all duration-300"
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
        <p className="text-[#1a1550]/55 text-[13px] leading-relaxed text-justify hyphens-auto break-words">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
