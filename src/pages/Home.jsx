import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Video, Zap, Globe, Play, BookOpen } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Home = () => {
  const features = [
    {
      icon: Video,
      title: 'Appearance Stream',
      description: 'An MC3D frontend paired with a ResNet-18 backbone extracts rich spatiotemporal visual features directly from grayscale video frames.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Eye,
      title: 'Landmark Stream',
      description: 'MediaPipe FaceMesh tracks 50 facial landmarks per frame (40 lip + 10 chin), normalized and modeled with an MLP-Transformer-BiLSTM pipeline.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Dual-Stream Fusion',
      description: 'Features from both streams are fused using concatenation or cross-attention, letting geometric cues support appearance-based recognition.',
      gradient: 'from-pink-500 to-red-500',
    },
    {
      icon: Globe,
      title: 'Broad Benchmarking',
      description: 'Evaluated on LRW (500-word, word-level) and LRS2 (sentence-level, open vocabulary) to validate both component contributions and real-world generalization.',
      gradient: 'from-red-500 to-orange-500',
    },
  ];

  const stats = [
    { value: '50', label: 'Landmarks per Frame', icon: Eye },
    { value: '2', label: 'Benchmark Datasets', icon: Globe },
    { value: '19+', label: 'Experiments Run', icon: Zap },
    { value: '29', label: 'Frames per Clip', icon: Video },
  ];

  const useCases = [
    {
      title: 'Accessibility Support',
      description: 'Enable real-time subtitles for deaf and hard-of-hearing individuals in meetings, lectures, and daily conversations without requiring an audio signal.',
      image: '📱',
    },
    {
      title: 'Noisy Environments',
      description: 'Understand speech in construction sites, public spaces, or any setting where background noise makes audio unreliable or unavailable.',
      image: '🎧',
    },
    {
      title: 'Education & Research',
      description: 'Study speech patterns, phoneme visibility, and articulation dynamics — with applications in linguistics, language learning, and communication disorders.',
      image: '🎓',
    },
    {
      title: 'Human-Computer Interaction',
      description: 'Enable silent command interfaces for devices, opening new interaction modalities where audio input is impractical or unwanted.',
      image: '🖥️',
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
                <span className="text-sm font-medium text-indigo-300">Dual-Stream Visual Speech Recognition</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Lip Reading with
                <span className="block text-gradient mt-2">Geometric Fusion</span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-xl">
                A research system that combines facial landmark geometry with deep visual features 
                to understand speech from silent video — no audio required.
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
                  <div className="text-3xl font-bold text-white mb-1">Dual</div>
                  <div className="text-sm text-gray-400">Stream Fusion</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">50</div>
                  <div className="text-sm text-gray-400">Lip Landmarks</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">LRW</div>
                  <div className="text-sm text-gray-400">+ LRS2 Datasets</div>
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
              System Architecture
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Two complementary streams, each trained to capture a different facet of lip motion
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
                Upload a short video clip to explore the landmark extraction and word prediction 
                pipeline. The demo illustrates the preprocessing and inference steps of the research prototype.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Upload Your Video</div>
                    <div className="text-sm text-gray-400">MP4, MOV or AVI — frontal face, clear lip visibility</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Landmark Extraction & Feature Processing</div>
                    <div className="text-sm text-gray-400">50 facial landmarks detected per frame, visual features extracted in parallel</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-pink-500" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Word Prediction</div>
                    <div className="text-sm text-gray-400">Dual-stream inference produces a ranked prediction</div>
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
                  Explore the Research
                </h2>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                  Try the demo, read the full research article, or explore the architecture behind the system.
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
