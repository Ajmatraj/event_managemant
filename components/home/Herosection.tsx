"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import MetaBalls from "./MetaBalls"
import { Calendar, MapPin, Ticket, Music } from "lucide-react"

const Herosection = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  }

  const floatingVariants = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const glowVariants = {
    glow: {
      boxShadow: [
        "0 0 20px rgba(139, 92, 246, 0.3)",
        "0 0 40px rgba(139, 92, 246, 0.5)",
        "0 0 20px rgba(139, 92, 246, 0.3)",
      ],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
      },
    },
  }

  const upcomingEvents = [
    {
      title: "Summer Music Festival",
      date: "June 15, 2025",
      location: "Central Park, NYC",
      price: "$49",
      icon: Music,
    },
    {
      title: "Live Concert - The Weeknd",
      date: "July 20, 2025",
      location: "Madison Square Garden",
      price: "$99",
      icon: Music,
    },
    {
      title: "Tech Conference 2025",
      date: "August 10, 2025",
      location: "Downtown Convention Center",
      price: "$299",
      icon: Calendar,
    },
  ]

  return (
    <div className={`transition-colors duration-300`}>
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center py-20 px-4 sm:px-6 overflow-hidden bg-background text-foreground">
        <div className="absolute inset-0 z-0 w-full h-full">
           <MetaBalls
          color={"#00D100"}
          cursorBallColor={"#00D100"}
          cursorBallSize={4}
          ballCount={10}
          animationSize={28}
          enableMouseInteraction={true}
          enableTransparency={true}
          hoverSmoothness={0.078}
          clumpFactor={2.5}
          speed={0.35}
        />
        </div>

        <motion.div className="relative z-10 max-w-5xl" variants={containerVariants} initial="hidden" animate="visible">
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-block mb-6 px-4 py-2 bg-accent/20 backdrop-blur-sm border border-accent/40 rounded-full">
              <p className="text-sm font-semibold text-accent">✨ Discover Amazing Events</p>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={titleVariants}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight"
          >
            Experience Live
            <motion.span
              animate={{ backgroundPosition: ["0% center", "100% center"] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="block bg-gradient-to-r from-green-400 via-green-400 to-green-400 bg-clip-text text-transparent bg-200%"
            >
              Events Like Never Before
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Book tickets for concerts, conferences, festivals, and live events. Discover premium experiences and create
            unforgettable memories with exclusive access to the biggest shows.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Ticket className="w-5 h-5" />
              Browse Events
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-muted-foreground/30 hover:bg-muted/20 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-sm"
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 sm:gap-8 mb-16 px-4">
            {[
              { label: "Events", value: "500+" },
              { label: "Users", value: "50K+" },
              { label: "Tickets Sold", value: "100K+" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="p-4 bg-card/40 backdrop-blur border border-border/40 rounded-lg"
              >
                <p className="text-2xl sm:text-3xl font-bold text-green-400">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="relative z-10 w-full max-w-6xl mt-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.2)" }}
                className="p-6 bg-card/50 backdrop-blur-md border border-border/40 rounded-2xl hover:border-green-500/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-400/20 to-green-400/20 rounded-xl group-hover:from-green-400/40 group-hover:to-green-400/40 transition-colors">
                    <event.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-sm font-bold text-green-400">{event.price}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-green-400 transition-colors">{event.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 bg-gradient-to-r from-green-600/80 to-green-600/80 hover:from-green-600 hover:to-green-600 rounded-lg font-semibold text-sm transition-all"
                >
                  Get Tickets
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="absolute top-20 right-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="float"
        />
        <motion.div
          className="absolute bottom-20 left-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 2 }}
        />
      </section>
    </div>
  )
}

export default Herosection
