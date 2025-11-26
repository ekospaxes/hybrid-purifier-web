// Replace the ProductShowcase component with this new design:

// Technical Product Showcase - Multi-View Design
const ProductShowcase = () => {
  const [activeView, setActiveView] = useState('front');

  return (
    <div className="relative py-32 overflow-hidden">
      {/* Radial Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.02)_0%,transparent_50%)]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Hybrid </span>
            <AnimatedGradientText>Bio-Intelligence</AnimatedGradientText>
          </h2>
          <p className="text-white/60 text-xl max-w-3xl mx-auto">
            Where nature meets technology. A seamless fusion of biological systems 
            and precision engineering.
          </p>
        </motion.div>

        {/* Main Interactive Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left: 3D Product Views */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* View Selector Pills */}
            <div className="flex gap-2 mb-6">
              {[
                { id: 'front', label: 'Front' },
                { id: 'side', label: 'Side' },
                { id: 'internal', label: 'Internal' }
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeView === view.id
                      ? 'bg-eko-emerald text-black'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>

            {/* Product Display Area */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] border border-white/10">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center p-12"
              >
                {activeView === 'front' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Dual Column Design */}
                    <div className="relative flex gap-6">
                      {[0, 1].map((col) => (
                        <div
                          key={col}
                          className="relative w-20 h-full bg-gradient-to-b from-eko-emerald/20 via-cyan-500/20 to-blue-500/20 rounded-2xl border border-white/20 backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                          style={{ height: '400px' }}
                        >
                          {/* Liquid Animation */}
                          <motion.div
                            animate={{
                              y: [0, -10, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: col * 0.5,
                              ease: "easeInOut"
                            }}
                            className="absolute inset-4 bg-gradient-to-t from-eko-emerald/40 to-transparent rounded-xl"
                          />
                          
                          {/* Bubbles */}
                          {[...Array(4)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1.5 h-1.5 bg-eko-emerald/80 rounded-full"
                              style={{
                                left: `${30 + Math.random() * 40}%`,
                              }}
                              animate={{
                                y: [400, -20],
                                opacity: [0, 1, 0],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: i * 0.8 + col * 0.3,
                                ease: "linear"
                              }}
                            />
                          ))}
                          
                          {/* LED Indicator */}
                          <div className="absolute top-3 inset-x-3 h-0.5 bg-gradient-to-r from-transparent via-eko-emerald to-transparent" />
                        </div>
                      ))}
                      
                      {/* Center Housing */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-32 h-16 bg-gradient-to-t from-[#1a1a1a] to-transparent border-t border-white/10 rounded-t-xl" />
                    </div>

                    {/* Floating Particles */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0.2, 0.6, 0.2],
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Infinity,
                          delay: i * 0.4,
                        }}
                      />
                    ))}
                  </div>
                )}

                {activeView === 'side' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Side Profile View */}
                    <div className="relative">
                      <div className="w-48 h-96 bg-gradient-to-r from-eko-emerald/10 via-cyan-500/15 to-eko-emerald/10 rounded-3xl border-l border-r border-white/20 backdrop-blur-xl shadow-[0_0_60px_rgba(34,211,238,0.15)]">
                        {/* Internal Layers Visible */}
                        <div className="absolute inset-4 space-y-2">
                          {[
                            { height: '20%', color: 'from-eko-emerald/30' },
                            { height: '25%', color: 'from-cyan-400/30' },
                            { height: '30%', color: 'from-blue-400/30' },
                            { height: '25%', color: 'from-purple-400/30' }
                          ].map((layer, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.2 }}
                              className={`w-full bg-gradient-to-r ${layer.color} to-transparent rounded-lg border border-white/10`}
                              style={{ height: layer.height }}
                            />
                          ))}
                        </div>
                        
                        {/* Air Flow Arrows */}
                        <motion.div
                          animate={{ y: [0, -30] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute -right-8 top-1/2 -translate-y-1/2"
                        >
                          <Wind className="text-cyan-400" size={20} />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )}

                {activeView === 'internal' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Exploded/Cutaway View */}
                    <div className="relative w-64 h-96">
                      {/* Core Components Spread */}
                      {[
                        { y: 0, label: 'Air Intake', color: 'eko-emerald', icon: Wind },
                        { y: 80, label: 'Bio-Reactor', color: 'cyan-400', icon: Droplets },
                        { y: 160, label: 'Sensors', color: 'blue-400', icon: Cpu },
                        { y: 240, label: 'UV Filter', color: 'purple-400', icon: Shield },
                        { y: 320, label: 'Clean Air Out', color: 'pink-400', icon: Activity }
                      ].map((component, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.5, x: 0 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            x: i % 2 === 0 ? -30 : 30
                          }}
                          transition={{ delay: i * 0.15, duration: 0.6 }}
                          className="absolute left-1/2 -translate-x-1/2"
                          style={{ top: `${component.y}px` }}
                        >
                          <div className={`bg-gradient-to-br from-${component.color}/20 to-transparent border border-${component.color}/30 rounded-xl p-4 backdrop-blur-xl`}>
                            <div className="flex items-center gap-3">
                              mponent.icon className={`text-${component.color}`} size={20} />
                              <span className="text-white/80 text-sm font-medium whitespace-nowrap">
                                {component.label}
                              </span>
                            </div>
                          </div>
                          
                          {/* Connection Line */}
                          {i < 4 && (
                            <motion.div
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ delay: i * 0.15 + 0.3, duration: 0.4 }}
                              className={`absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-${component.color}/40 to-transparent`}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* View Label */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5">
                <span className="text-white/60 text-xs font-mono uppercase">{activeView} view</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Technical Specs List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {[
                {
                  title: 'Biological Core',
                  specs: [
                    'Chlorella vulgaris microalgae culture',
                    'Photosynthetic efficiency: 12 μmol/m²/s',
                    'CO₂ absorption: 0.7 g/L/day',
                    'O₂ production: 65 g/day average'
                  ],
                  icon: Droplets,
                  color: 'eko-emerald'
                },
                {
                  title: 'Filtration System',
                  specs: [
                    '5-stage hybrid architecture',
                    'Pre-filter + HEPA H13 layer',
                    'Activated carbon (VOC removal)',
                    'UV-C sterilization chamber'
                  ],
                  icon: Layers,
                  color: 'cyan-400'
                },
                {
                  title: 'Smart Control',
                  specs: [
                    'ESP32 dual-core processor',
                    'Real-time pH & turbidity monitoring',
                    'Automatic sleep/wake cycles',
                    'WiFi + MQTT cloud sync'
                  ],
                  icon: Cpu,
                  color: 'blue-400'
                },
                {
                  title: 'Energy Profile',
                  specs: [
                    'Peak consumption: 160W',
                    'Eco mode: 30W continuous',
                    'Standby: <2W',
                    'Solar/mains switchable input'
                  ],
                  icon: Zap,
                  color: 'purple-400'
                }
              ].map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-${section.color}/10`}>
                      <section.icon className={`text-${section.color}`} size={20} />
                    </div>
                    <h3 className="text-white font-bold text-lg">{section.title}</h3>
                  </div>
                  
                  <ul className="space-y-2">
                    {section.specs.map((spec, j) => (
                      <li key={j} className="flex items-start gap-2 text-white/60 text-sm">
                        <span className={`text-${section.color} mt-1`}>•</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom: Material Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            <AnimatedGradientText>Premium Materials</AnimatedGradientText>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Medical-grade Acrylic', purity: '99.9%', icon: Container },
              { label: 'Stainless Steel 316', purity: 'Corrosion-free', icon: Shield },
              { label: 'Food-safe Tubing', purity: 'BPA-free', icon: Droplets },
              { label: 'LED Full Spectrum', purity: '450-650nm', icon: Beaker }
            ].map((material, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-eko-emerald/30 transition-all"
              >
                <material.icon className="mx-auto text-eko-emerald mb-3" size={24} />
                <div className="text-white font-medium text-sm mb-1">{material.label}</div>
                <div className="text-eko-emerald text-xs font-mono">{material.purity}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-white/40 text-sm font-mono mb-6">
            Designed in India • Engineered for the future
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-eko-emerald text-black font-bold rounded-full hover:bg-eko-emerald/90 transition-all">
              Request Detailed CAD Files
            </button>
            <button className="px-8 py-3 bg-white/5 border border-white/20 text-white font-medium rounded-full hover:bg-white/10 transition-all">
              Download Spec Sheet (PDF)
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
