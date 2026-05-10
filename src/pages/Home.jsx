import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Video, Zap, Globe, Play, BookOpen, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const predictions = [
  { word: 'ABOUT',    pct: 94, color: 'from-indigo-500 to-violet-500' },
  { word: 'ACTION',   pct: 78, color: 'from-violet-500 to-purple-500' },
  { word: 'ALREADY',  pct: 61, color: 'from-purple-500 to-fuchsia-500' },
  { word: 'ALWAYS',   pct: 42, color: 'from-fuchsia-500 to-pink-500' },
  { word: 'ANOTHER',  pct: 29, color: 'from-pink-500 to-rose-500' },
];

const landmarks = [
  { x: 47, y: 62 }, { x: 50, y: 61 }, { x: 53, y: 62 },
  { x: 44, y: 65 }, { x: 50, y: 64 }, { x: 56, y: 65 },
  { x: 42, y: 68 }, { x: 47, y: 67 }, { x: 50, y: 68 }, { x: 53, y: 67 }, { x: 58, y: 68 },
  { x: 43, y: 71 }, { x: 50, y: 72 }, { x: 57, y: 71 },
  { x: 45, y: 74 }, { x: 50, y: 75 }, { x: 55, y: 74 },
  // chin
  { x: 42, y: 78 }, { x: 47, y: 80 }, { x: 50, y: 81 }, { x: 53, y: 80 }, { x: 58, y: 78 },
];

const MockPrediction = () => (
  <div className="relative rounded-2xl overflow-hidden border border-[#1f1f1f] bg-[#0d0d0d]">
    {/* header bar */}
    <div className="flex items-center gap-2 px-5 py-3 border-b border-[#1f1f1f] bg-[#111111]">
      <div className="w-3 h-3 rounded-full bg-red-500/70" />
      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
      <div className="w-3 h-3 rounded-full bg-green-500/70" />
      <span className="ml-3 text-xs text-gray-500 font-mono">LipReader — inference output</span>
    </div>

    <div className="p-5 space-y-5">
      {/* landmark face preview */}
      <div className="relative w-full h-36 rounded-xl bg-[#111111] border border-[#1f1f1f] overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-purple-500/5" />
        {/* SVG face silhouette + landmarks */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* face oval */}
          <ellipse cx="50" cy="50" rx="22" ry="28" fill="none" stroke="#ffffff08" strokeWidth="0.8" />
          {/* eye hints */}
          <ellipse cx="43" cy="42" rx="4" ry="2.5" fill="none" stroke="#6366f130" strokeWidth="0.6" />
          <ellipse cx="57" cy="42" rx="4" ry="2.5" fill="none" stroke="#6366f130" strokeWidth="0.6" />
          {/* landmark dots */}
          {landmarks.map((pt, i) => (
            <motion.circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r="1.2"
              fill="#818cf8"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.04, type: 'spring', stiffness: 300, damping: 18 }}
            />
          ))}
          {/* connecting lines between lip corners */}
          <motion.path
            d="M42,68 Q50,64 58,68 Q54,74 50,75 Q46,74 42,68Z"
            fill="none" stroke="#818cf840" strokeWidth="0.7"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true }} transition={{ delay: 1.2, duration: 0.6 }}
          />
        </svg>
        {/* stream badges */}
        <div className="absolute top-2 right-2 flex gap-1.5">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/20">appearance</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono border border-purple-500/20">landmarks</span>
        </div>
      </div>

      {/* top-5 predictions */}
      <div className="space-y-2">
        {predictions.map((p, i) => (
          <motion.div
            key={p.word}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="flex items-center gap-3"
          >
            <span className={`w-5 text-right text-xs font-mono ${i === 0 ? 'text-indigo-400' : 'text-gray-600'}`}>
              {i + 1}
            </span>
            <div className="flex-1 relative h-7 rounded-lg overflow-hidden bg-[#111111] border border-[#1f1f1f]">
              <motion.div
                className={`absolute left-0 top-0 h-full bg-linear-to-r ${p.color} opacity-${i === 0 ? '30' : '15'}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${p.pct}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <span className={`text-xs font-semibold tracking-wider font-mono ${i === 0 ? 'text-white' : 'text-gray-400'}`}>
                  {p.word}
                </span>
                <span className={`text-xs font-mono ${i === 0 ? 'text-indigo-300' : 'text-gray-600'}`}>
                  {p.pct}%
                </span>
              </div>
            </div>
            {i === 0 && (
              <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
            )}
            {i !== 0 && <div className="w-3.5" />}
          </motion.div>
        ))}
      </div>

      {/* processing stats footer */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1f1f1f]">
        <span className="text-[10px] text-gray-600 font-mono">streams fused · top-500</span>
        <div className="flex gap-3">
          <span className="text-[10px] text-gray-500 font-mono">29 frames</span>
          <span className="text-[10px] text-indigo-400 font-mono">112 ms</span>
        </div>
      </div>
    </div>
  </div>
);

const Home = () => {
  const features = [
    {
      icon: Video,
      title: 'Read Lips, Not Audio',
      description: 'Upload any short video of someone speaking and the system figures out the word — purely from the movement of their lips.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Eye,
      title: 'Two Eyes Are Better Than One',
      description: 'The system looks at the scene from two angles at once — texture and shape — then combines what it sees for a more confident answer.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Predictions come back in milliseconds. No waiting, no buffering — just a ranked list of the most likely words the speaker said.',
      gradient: 'from-pink-500 to-red-500',
    },
    {
      icon: Globe,
      title: 'Built to Generalise',
      description: 'Trained and tested across hundreds of real-world words and speakers, so it holds up beyond the lab.',
      gradient: 'from-red-500 to-orange-500',
    },
  ];

  const stats = [
    { value: '500', label: 'Words Recognized', icon: Video },
    { value: '19+', label: 'Experiments Run', icon: Zap },
    { value: '100%', label: 'Audio-Free', icon: Globe },
  ];

  const useCases = [
    {
      title: 'Surveillance & Security',
      description: 'Security cameras capture everything — including conversations. LipReader can help make sense of what was said in footage where audio was never recorded.',
      image: '📷',
    },
    {
      title: 'Recovering Corrupted Audio',
      description: 'Old recordings, damaged files, interference-heavy footage — when the audio is gone or unusable, the video still holds the answer.',
      image: '🎬',
    },
    {
      title: 'Robots in Noisy Environments',
      description: 'Factory floors, construction sites, loud public spaces — robots can read your lips to understand commands when a microphone would be useless.',
      image: '🤖',
    },
    {
      title: 'Silent Communication',
      description: 'Mouth a word, get a response. No wake word, no speaking aloud — ideal for situations where silence matters or audio hardware isn\'t available.',
      image: '🤫',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
                <span className="text-sm font-medium text-indigo-300">Visual Speech Recognition</span>
              </div>

              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Understand what someone said
                <span className=" text-gradient mt-2"> just by watching their lips</span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-xl">
                LipReader is an AI system that watches a video of someone speaking and tells you what word they said — with no audio, no microphone, and no guesswork.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/demo">
                  <Button size="lg" icon={Play} iconPosition="right" className="w-full sm:w-auto cursor-pointer">
                    Try Live Demo
                  </Button>
                </Link>
                <Link to="/article">
                  <Button size="lg" variant="outline" icon={BookOpen} className="w-full sm:w-auto cursor-pointer">
                    Read Article
                  </Button>
                </Link>
              </div>

            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Animated Circles */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rounded-full" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-500 rounded-full" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-pink-500 rounded-full" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full" />
                </motion.div>

                {/* Center Visual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Glow Background */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[500px] h-[500px] bg-linear-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl" />
                    </div>
                    
                    {/* Image Container */}
                    <div className="relative z-10 w-full max-w-[600px] aspect-[3/2]">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
                        <img
                          src="/img1.webp"
                          alt="LipReader Demo"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center' }}
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a]/40 via-transparent to-transparent pointer-events-none" />
                      </div>
                      
                      {/* Decorative Elements */}
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-60" />
                      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-linear-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-60" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-6 border-y border-[#1f1f1f]">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Four ideas that make silent lip reading fast, accurate, and practical
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className={`w-14 h-14 rounded-lg bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                    <feature.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="py-24 px-6 bg-[#111111]/50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Try It Yourself
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Upload a clip of someone speaking — and see the word prediction appear in real time.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Drop in a video</div>
                    <div className="text-sm text-gray-400">Any short clip where the speaker's face is visible and front-facing</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">The system analyses the lips</div>
                    <div className="text-sm text-gray-400">It watches every frame and picks up on the shape and movement of the mouth</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-pink-500" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Get a ranked prediction</div>
                    <div className="text-sm text-gray-400">See the top matches with confidence scores — the most likely word sits at the top</div>
                  </div>
                </div>
              </div>

              <Link to="/demo">
                <Button size="lg" icon={ArrowRight} iconPosition="right" className="cursor-pointer">
                  Try Live Demo
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <MockPrediction />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Where It Makes a Difference
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Anywhere audio lets you down, lips still work
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="text-5xl mb-4">{useCase.image}</div>
                  <h3 className="text-2xl font-semibold mb-3">{useCase.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{useCase.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="text-center relative overflow-hidden" glow>
              <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
              <div className="relative z-10 py-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  See it for yourself
                </h2>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                  Try the live demo, or read the full article to see how far silent lip reading has come.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/demo">
                    <Button size="lg" icon={Play} iconPosition="right" className="w-full sm:w-auto cursor-pointer">
                      Try Demo Now
                    </Button>
                  </Link>
                  <Link to="/article">
                    <Button size="lg" variant="secondary" icon={BookOpen} className="w-full sm:w-auto cursor-pointer">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
