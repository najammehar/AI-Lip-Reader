import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Video, Zap, Shield, Globe, Play, BookOpen } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Home = () => {
  const features = [
    {
      icon: Video,
      title: 'Video Analysis',
      description: 'Advanced AI processes video frames to understand lip movements and generate accurate text transcriptions.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Get results in seconds with our optimized neural network architecture trained on thousands of samples.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All processing happens securely. Your videos are never stored and privacy is our top priority.',
      gradient: 'from-pink-500 to-red-500',
    },
    {
      icon: Globe,
      title: 'Universal Access',
      description: 'Helping deaf and hard-of-hearing communities, enabling communication in noisy environments.',
      gradient: 'from-red-500 to-orange-500',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Videos Processed', icon: Video },
    { value: '92%', label: 'Accuracy Rate', icon: Zap },
    { value: '50+', label: 'Languages Ready', icon: Globe },
    { value: '2.1s', label: 'Avg Processing', icon: Eye },
  ];

  const useCases = [
    {
      title: 'Accessibility Support',
      description: 'Enable real-time subtitles for deaf and hard-of-hearing individuals in meetings, lectures, and daily conversations.',
      image: '📱',
    },
    {
      title: 'Noisy Environments',
      description: 'Perfect for construction sites, concerts, or busy public spaces where audio is unclear or unavailable.',
      image: '🎧',
    },
    {
      title: 'Security & Surveillance',
      description: 'Extract conversation content from silent CCTV footage for investigation and analysis purposes.',
      image: '🔒',
    },
    {
      title: 'Education & Research',
      description: 'Study speech patterns, language learning, and communication disorders with detailed lip movement analysis.',
      image: '🎓',
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
                <span className="text-sm font-medium text-indigo-300">AI-Powered Lip Reading</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Turn Silence Into
                <span className="block text-gradient mt-2">Spoken Words</span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-xl">
                Our advanced AI reads lips from videos and generates accurate text transcriptions. 
                Making communication accessible to everyone, everywhere.
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

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">92%</div>
                  <div className="text-sm text-gray-400">Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">2.1s</div>
                  <div className="text-sm text-gray-400">Processing</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">10K+</div>
                  <div className="text-sm text-gray-400">Videos</div>
                </div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Advanced AI technology making lip reading accessible and accurate
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
                See It In Action
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Upload any video with visible lip movements and watch our AI generate accurate 
                text transcriptions in real-time. Try it yourself with our interactive demo.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Upload Your Video</div>
                    <div className="text-sm text-gray-400">Support for MP4, MOV, AVI formats</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">AI Processing</div>
                    <div className="text-sm text-gray-400">Advanced neural network analysis</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-pink-500" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Get Results</div>
                    <div className="text-sm text-gray-400">Accurate text transcription output</div>
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
              <div className="aspect-video bg-linear-to-br from-[#111111] to-[#1a1a1a] rounded-lg border border-[#1f1f1f] flex items-center justify-center overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Play size={32} className="text-indigo-400 ml-1" />
                  </div>
                  <p className="text-gray-400 text-center">Demo Video</p>
                </div>
              </div>
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
              Real-World Applications
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Transforming communication across industries and communities
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
                  Ready to Get Started?
                </h2>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                  Experience the future of communication. Try our lip reading AI today.
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
