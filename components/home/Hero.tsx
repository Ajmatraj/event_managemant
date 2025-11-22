"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import MetaBalls from "./MetaBalls"
import { ArrowRight, ChevronDown, Sparkles, CalendarDays, MapPin, TicketIcon } from "lucide-react"

interface UserData {
  role_id?: string
  name?: string
}

interface HeroProps {
  user?: UserData
}

const Hero: React.FC<HeroProps> = ({ user }) => {
  const [activeSubtitle, setActiveSubtitle] = useState(0)
  const [isDark, setIsDark] = useState(false)

  const subtitles = ["Find Events", "Book Tickets", "Enjoy the Experience"]

  useEffect(() => {
    // Check dark mode preference
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark")
      setIsDark(dark)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSubtitle((prev) => (prev + 1) % subtitles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
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

  const slideVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 },
    },
  }

  const bounceVariants = {
    animate: {
      y: [0, 8, 0],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const bgColor = isDark
    ? "from-purple-600/10 via-background to-purple-900/5"
    : "from-purple-100/40 via-background to-purple-50/30"

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 w-full h-full">
        <MetaBalls
          color={isDark ? "#a78bfa" : "#9f7aea"}
          cursorBallColor={isDark ? "#c4b5fd" : "#b794f6"}
          cursorBallSize={4}
          ballCount={40}
          animationSize={28}
          enableMouseInteraction={true}
          enableTransparency={true}
          hoverSmoothness={0.08}
          clumpFactor={2.5}
          speed={0.35}
        />
      </div>

      <div className={`absolute inset-0 z-1 bg-gradient-to-br ${bgColor}`} />

      {/* Main Content */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <motion.div className="w-full max-w-6xl" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary/10 backdrop-blur-xl border border-primary/30 rounded-full hover:border-primary/50 transition-colors">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Discover Amazing Events</span>
            </div>
          </motion.div>

          {/* Main Title with Gradient */}
          <motion.div variants={itemVariants} className="text-center mb-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4 leading-tight">
              <span className="text-foreground">Discover</span>
              <motion.span
                className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% center", "100% center", "0% center"],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                Concerts & Events
              </motion.span>
            </h1>

            {/* Dynamic Rotating Subtitle */}
            <div className="h-12 sm:h-14 flex items-center justify-center mt-4">
              <motion.p
                key={activeSubtitle}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-xl sm:text-2xl text-muted-foreground font-medium"
              >
                {subtitles[activeSubtitle]}
              </motion.p>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="text-center text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Discover concerts, workshops, festivals and more. Book your tickets now and experience unforgettable moments
            with friends and family.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 sm:px-10 py-4 bg-gradient-to-r from-primary to-primary/90 hover:to-primary text-primary-foreground rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg flex items-center gap-2 group"
            >
              Explore Events
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {user?.role_id === "ORGANIZER" && (
              <motion.button
                whileHover={{ scale: 1.05, borderColor: "var(--primary)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 sm:px-10 py-4 border-2 border-primary/40 hover:border-primary/80 hover:bg-primary/5 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 backdrop-blur-sm"
              >
                Create Event
              </motion.button>
            )}
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-16">
            {[
              { number: "500+", label: "Events" },
              { number: "50K+", label: "Users" },
              { number: "100K+", label: "Tickets" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-4 sm:p-6 rounded-xl bg-card/40 backdrop-blur-md border border-border/50 text-center group hover:bg-card/60 transition-colors"
              >
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/50 transition-all">
                  {stat.number}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured Events Showcase */}
          <motion.div variants={itemVariants} className="mt-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Summer Music Festival",
                  date: "June 15, 2025",
                  location: "Central Park, NYC",
                  price: "$49",
                  icon: "🎵",
                },
                {
                  title: "Tech Conference 2025",
                  date: "July 20, 2025",
                  location: "Convention Center",
                  price: "$299",
                  icon: "💻",
                },
                {
                  title: "Art & Culture Workshop",
                  date: "August 10, 2025",
                  location: "Downtown Gallery",
                  price: "$89",
                  icon: "🎨",
                },
              ].map((event, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(168, 85, 247, 0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group p-6 rounded-2xl bg-card/50 backdrop-blur-md border border-border/50 hover:border-primary/40 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{event.icon}</div>
                    <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {event.price}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">{event.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2.5 bg-gradient-to-r from-primary/80 to-primary/70 hover:from-primary hover:to-primary/80 rounded-lg font-semibold text-sm text-primary-foreground transition-all"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <TicketIcon className="w-4 h-4" />
                      Get Tickets
                    </div>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
          variants={bounceVariants}
          animate="animate"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <ChevronDown className="w-6 h-6 text-primary" />
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}

export default Hero
