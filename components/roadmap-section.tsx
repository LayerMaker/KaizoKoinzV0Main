"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

const roadmapItems = [
  {
    title: "THE FIRST LAYER-1",
    subtitle: "PROGRAMMABLE DATACHAIN",
    description: "Scalable execution. Verifiable data. AI-ready.",
    image: "/placeholder.svg?height=400&width=600",
    color: "from-cyan-500 to-blue-600",
    mascots: [
      { position: "top-10 left-10", color: "text-cyan-400" },
      { position: "bottom-20 right-20", color: "text-orange-400" },
    ],
  },
  {
    title: "A SHARED COMPUTER WHERE",
    subtitle: "AI POLICIES & SMART CONTRACTS",
    description: "HAVE ACCESS TO VERIFIABLE DATA",
    image: "/placeholder.svg?height=400&width=600",
    color: "from-purple-600 to-red-500",
    mascots: [
      { position: "top-20 right-20", color: "text-purple-400" },
      { position: "bottom-10 left-10", color: "text-cyan-400" },
    ],
  },
  {
    title: "WELCOME TO",
    subtitle: "CRYPTO RETRO",
    description: "The future of gaming meets blockchain technology",
    image: "/placeholder.svg?height=400&width=600",
    color: "from-green-500 to-cyan-500",
    mascots: [
      { position: "top-10 right-10", color: "text-green-400" },
      { position: "bottom-20 left-20", color: "text-yellow-400" },
    ],
  },
  {
    title: "PROGRAMMABLE",
    subtitle: "DATACHAIN",
    description: "Control your data and earn rewards through gameplay",
    image: "/placeholder.svg?height=400&width=600",
    color: "from-blue-600 to-purple-600",
    mascots: [
      { position: "top-20 left-20", color: "text-blue-400" },
      { position: "bottom-10 right-10", color: "text-purple-400" },
    ],
  },
]

const Mascot = ({ position, color }: { position: string; color: string }) => (
  <div className={`absolute ${position} ${color} animate-bounce`}>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
      <circle cx="20" cy="20" r="20" />
      <circle cx="12" cy="15" r="5" fill="white" />
      <circle cx="28" cy="15" r="5" fill="white" />
      <circle cx="12" cy="15" r="2" fill="black" />
      <circle cx="28" cy="15" r="2" fill="black" />
    </svg>
  </div>
)

export default function RoadmapSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section id="roadmap" className="relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black"></div>

      <div ref={containerRef} className="relative z-10">
        {roadmapItems.map((item, index) => (
          <RoadmapItem key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}

function RoadmapItem({ item, index }: { item: (typeof roadmapItems)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center justify-center relative py-20"
      style={{
        backgroundColor: index % 2 === 0 ? "rgba(0,0,0,0.9)" : "rgba(10,10,30,0.9)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {item.mascots.map((mascot, i) => (
          <Mascot key={i} position={mascot.position} color={mascot.color} />
        ))}
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            className="order-2 md:order-1"
            style={{ y, opacity }}
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-300 mb-2">{item.title}</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r mb-4 ${item.color}">
              {item.subtitle}
            </h3>
            <p className="text-xl text-gray-400 max-w-lg">{item.description}</p>
          </motion.div>

          <motion.div
            className="order-1 md:order-2 relative"
            style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]), opacity }}
            initial={{ y: -100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-lg overflow-hidden border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                width={600}
                height={400}
                className="w-full h-auto"
              />
              <div className={`absolute inset-0 bg-gradient-to-tr ${item.color} opacity-20`}></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
