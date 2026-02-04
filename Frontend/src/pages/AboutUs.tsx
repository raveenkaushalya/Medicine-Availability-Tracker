import pharmacistShelfImage from '../assets/images/pharmacist-shelf.png';

import { motion } from 'motion/react';

import { ImageWithFallback } from '../components/common/ImageWithFallback';

export function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - How it Started */}
      <section className="max-w-screen-2xl mx-auto sm:px-6 lg:px-8 sm:py-20 lg:py-32 px-[32px] py-[120px] pt-[128px] pr-[32px] pb-[82px] pl-[32px]" style={{ paddingTop: '110px' }}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 lg:pr-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            >
              <p className="text-[rgb(16,136,118)] text-xs uppercase tracking-wider font-semibold text-[22px] font-normal font-bold mt-[-40px] mr-[0px] mb-[0px] ml-[4px]">
                Connect With Healthcare
              </p>
              <h1 className="sm:text-6xl lg:text-7xl font-bold text-[#1e293b] mb-3 leading-[1.1] text-[64px]">
                For Happy
              </h1>
              <h1 className="sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] bg-clip-text text-transparent leading-[1.1] text-[64px] px-[0px] py-[10px] m my-[39px]y-[40px] mt-[-20px] mr-[0px] mb-[0px] ml-[0px]">
                Healthy Access
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              className="space-y-5 text-gray-600 leading-relaxed text-base"
            >
              <p className="text-lg mt-[-18px] mr-[0px] mb-[20px] ml-[0px]">
                PharmConnect was born from a simple yet powerful vision to ensure that no patient
                ever struggles to find essential medicines. We recognized the gap between pharmacies
                and patients, and set out to bridge it with innovative technology.
              </p>

              <p>
                Our platform connects over 100+ verified pharmacies across Sri Lanka, creating a
                network that empowers both healthcare providers and patients.
              </p>
            </motion.div>

            {/* Pagination Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex gap-2.5 pt-2"
            >
              <div className="w-6 h-1.5 rounded-full bg-[#1e293b] transition-all duration-300"></div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
                className="relative rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
              >
                <ImageWithFallback
                  src={pharmacistShelfImage}
                  alt="PharmConnect Healthcare Team"
                  className="w-full h-[380px] sm:h-[480px] lg:h-[540px] object-cover"
                />
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision and Mission Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mx-[0px] my-[-80px]">
          {/* Our Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-[#f5e6d3] to-[#ffd7ba] rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] p-8 lg:p-10 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] transition-all duration-500 overflow-hidden"
          >
            {/* Decorative blob */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-gradient-to-br from-[#ffb88c] to-[#ff9d6e] rounded-full opacity-40 blur-2xl"></div>

            <div className="relative z-10">
              <span className="inline-block bg-white/80 backdrop-blur-sm text-[#8b5a3c] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                VISION
              </span>

              <h2 className="text-3xl font-bold text-[#1e293b] mb-4">Our Vision</h2>

              <p className="text-gray-700 leading-relaxed text-base mb-6">
                To create a world where no patient goes without essential medicines, by building
                the most trusted and comprehensive pharmacy network platform that connects healthcare
                providers and patients seamlessly.
              </p>

            </div>
          </motion.div>

          {/* Our Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-gradient-to-br from-[#e8e4f3] to-[#d9d4ea] rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] p-8 lg:p-10 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] transition-all duration-500 overflow-hidden"
          >
            {/* Decorative circle */}
            <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-gradient-to-br from-[#b8a9d4] to-[#9d8dc4] rounded-full opacity-30 blur-2xl"></div>

            <div className="relative z-10">
              <span className="inline-block bg-white/80 backdrop-blur-sm text-[#6b5b95] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                MISSION
              </span>

              <h2 className="text-3xl font-bold text-[#1e293b] mb-4">Our Mission</h2>

              <p className="text-gray-700 leading-relaxed text-base mb-6">
                To connect pharmacies and patients through innovative technology, ensuring medicine
                availability and accessibility across communities while maintaining the highest
                standards of service and reliability.
              </p>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="max-w-5xl mx-auto px-[-22px] py-[80px] rounded-[20px] px-[0px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] rounded-3xl p-10 sm:p-14 text-center shadow-[0_20px_60px_-15px_rgba(20,184,166,0.4)]"
        >
          <div className="text-6xl text-white/20 mb-4">"</div>
          <p className="text-white text-xl sm:text-2xl font-medium mb-8 leading-relaxed max-w-3xl mx-auto">
            Healthcare accessibility shouldn't be a privilege, it's a fundamental right.
            We're committed to making it a reality for every patient in Sri Lanka.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-0.5 bg-white/40"></div>
            <p className="text-white/90 text-sm font-medium">Pharmora Team</p>
            <div className="w-16 h-0.5 bg-white/40"></div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}