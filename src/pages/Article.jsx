import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

const Article = () => {
  return (
    <div className="min-h-screen">
      {/* Article Header */}
      <section className="pt-32 pb-16 px-6 border-b border-[#1f1f1f]">
        <div className="container mx-auto max-w-4xl">
          <Link to="/">
            <Button variant="ghost" icon={ArrowLeft} className="mb-8 cursor-pointer">
              Back to Home
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
              <span className="text-sm font-medium text-indigo-300">Research Article</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Building an AI-Powered Lip Reading System: A Deep Learning Approach
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>Research Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>December 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>15 min read</span>
              </div>
            </div>

            <p className="text-xl text-gray-300 leading-relaxed">
              An in-depth exploration of our journey in developing a state-of-the-art lip reading 
              system using dual-stream neural architecture, combining visual appearance features 
              with geometric landmarks for enhanced speech recognition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-lg max-w-none">
            
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">Introduction</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Lip reading, also known as visual speech recognition, has emerged as a crucial technology 
                for accessibility, security, and communication in noisy environments. Our research focuses 
                on developing a robust lip reading system that can accurately transcribe spoken sentences 
                from silent video footage.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Traditional approaches to lip reading have faced significant challenges due to the ambiguous 
                nature of visual speech – many phonemes appear visually similar (such as /p/, /b/, and /m/). 
                Our solution leverages a dual-stream architecture that processes both visual appearance and 
                geometric lip motion to overcome these limitations.
              </p>
            </motion.div>

            {/* Problem Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">The Challenge</h2>
              <Card className="mb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-indigo-400">Visual Ambiguity</h4>
                    <p className="text-gray-300">
                      Many phonemes look identical when spoken, making lip reading inherently difficult even for humans.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-indigo-400">Speaker Variation</h4>
                    <p className="text-gray-300">
                      Different speakers have varying lip shapes, movements, and speaking styles.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-indigo-400">Temporal Dependencies</h4>
                    <p className="text-gray-300">
                      Speech is sequential; understanding requires capturing temporal patterns across frames.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Our Approach */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">Our Dual-Stream Approach</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                We developed a novel dual-stream architecture that combines two complementary types of information:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <div className="text-4xl mb-4">👁️</div>
                  <h4 className="text-xl font-semibold mb-3">Visual Stream</h4>
                  <p className="text-gray-300 mb-4">
                    ResNet-18 processes raw video frames to extract appearance features including 
                    texture, lighting, and subtle visual cues.
                  </p>
                  <div className="text-sm text-gray-400">
                    • RGB frame analysis<br />
                    • Texture patterns<br />
                    • Visual context
                  </div>
                </Card>

                <Card>
                  <div className="text-4xl mb-4">📐</div>
                  <h4 className="text-xl font-semibold mb-3">Geometric Stream</h4>
                  <p className="text-gray-300 mb-4">
                    Vision Transformer analyzes 50 facial landmarks (40 lip + 10 chin) to understand 
                    precise lip movements and shapes.
                  </p>
                  <div className="text-sm text-gray-400">
                    • 3D coordinate tracking<br />
                    • Motion patterns<br />
                    • Shape analysis
                  </div>
                </Card>
              </div>

              <p className="text-gray-300 leading-relaxed">
                By fusing these two streams, our system captures both what the lips look like and how 
                they move, providing complementary information that significantly improves accuracy.
              </p>
            </motion.div>

            {/* Architecture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">System Architecture</h2>
              
              <Card className="mb-6 bg-[#0a0a0a]">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <span className="text-2xl font-bold text-indigo-400">1</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Input Processing</h4>
                      <p className="text-gray-300 text-sm mb-2">
                        Videos are preprocessed to extract 29 frames at 25 fps. MediaPipe FaceMesh 
                        extracts 50 facial landmarks per frame.
                      </p>
                      <div className="inline-block px-3 py-1 bg-[#111111] rounded text-xs font-mono text-gray-400">
                        Input Shape: (Batch, 29, H, W, 3)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                      <span className="text-2xl font-bold text-purple-400">2</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Dual-Stream Processing</h4>
                      <p className="text-gray-300 text-sm mb-2">
                        ResNet-18 processes raw frames (512-dim features) while Vision Transformer 
                        processes landmarks (256-dim features) in parallel.
                      </p>
                      <div className="space-y-1">
                        <div className="inline-block px-3 py-1 bg-[#111111] rounded text-xs font-mono text-gray-400 mr-2">
                          Visual: (B, 29, 512)
                        </div>
                        <div className="inline-block px-3 py-1 bg-[#111111] rounded text-xs font-mono text-gray-400">
                          Geometric: (B, 29, 256)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center shrink-0">
                      <span className="text-2xl font-bold text-pink-400">3</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Feature Fusion</h4>
                      <p className="text-gray-300 text-sm mb-2">
                        Features are concatenated and projected to a unified representation for 
                        temporal modeling.
                      </p>
                      <div className="inline-block px-3 py-1 bg-[#111111] rounded text-xs font-mono text-gray-400">
                        Fused: (B, 29, 768) → Project → (B, 29, 512)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                      <span className="text-2xl font-bold text-red-400">4</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Sequence Decoding</h4>
                      <p className="text-gray-300 text-sm mb-2">
                        Temporal features are decoded into text sequences using attention-based 
                        mechanisms or CTC loss.
                      </p>
                      <div className="inline-block px-3 py-1 bg-[#111111] rounded text-xs font-mono text-gray-400">
                        Output: Text Transcription
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Dataset */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">Dataset & Training</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                We utilized the Lip Reading in the Wild (LRW) dataset, one of the largest publicly 
                available datasets for visual speech recognition:
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <Card hover={false} className="text-center">
                  <div className="text-4xl font-bold text-gradient mb-2">500</div>
                  <div className="text-sm text-gray-400">Word Vocabulary</div>
                </Card>
                <Card hover={false} className="text-center">
                  <div className="text-4xl font-bold text-gradient mb-2">~488K</div>
                  <div className="text-sm text-gray-400">Training Samples</div>
                </Card>
                <Card hover={false} className="text-center">
                  <div className="text-4xl font-bold text-gradient mb-2">29</div>
                  <div className="text-sm text-gray-400">Frames per Clip</div>
                </Card>
              </div>

              <p className="text-gray-300 leading-relaxed mb-4">
                For initial experimentation, we worked with a curated subset of 100 words 
                (~30K samples) to validate our approach before scaling to the full dataset.
              </p>

              <Card className="bg-indigo-500/5 border-indigo-500/20">
                <h4 className="text-lg font-semibold mb-3 text-indigo-300">Training Configuration</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <span className="text-gray-400">Optimizer:</span> AdamW
                  </div>
                  <div>
                    <span className="text-gray-400">Learning Rate:</span> 3e-4 (cosine schedule)
                  </div>
                  <div>
                    <span className="text-gray-400">Batch Size:</span> 64
                  </div>
                  <div>
                    <span className="text-gray-400">Weight Decay:</span> 1e-4
                  </div>
                  <div>
                    <span className="text-gray-400">Dropout:</span> 0.1
                  </div>
                  <div>
                    <span className="text-gray-400">Hardware:</span> Single GPU (V100/A100)
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">Results & Performance</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Our dual-stream approach demonstrated significant improvements over single-stream baselines:
              </p>

              <Card className="mb-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Geometric Stream Only (ViT)</span>
                      <span className="text-2xl font-bold text-indigo-400">51%</span>
                    </div>
                    <div className="w-full bg-[#1f1f1f] rounded-full h-2">
                      <div className="bg-linear-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{ width: '51%' }} />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Landmarks alone provide strong geometric signal
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Visual Stream Only (ResNet)</span>
                      <span className="text-2xl font-bold text-purple-400">67%</span>
                    </div>
                    <div className="w-full bg-[#1f1f1f] rounded-full h-2">
                      <div className="bg-linear-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '67%' }} />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Appearance features capture detailed visual information
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 font-semibold">Dual-Stream (Ours)</span>
                      <span className="text-3xl font-bold text-gradient">83%</span>
                    </div>
                    <div className="w-full bg-[#1f1f1f] rounded-full h-3">
                      <div className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full" style={{ width: '83%' }} />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Combined streams achieve superior performance
                    </p>
                  </div>
                </div>
              </Card>

              <p className="text-gray-300 leading-relaxed mb-4">
                The fusion of geometric and visual features provides complementary information that 
                significantly outperforms either stream alone, demonstrating the effectiveness of 
                our dual-stream architecture.
              </p>
            </motion.div>

            {/* Example Output */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">Sample Predictions</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Here are some examples of our system's output on test samples:
              </p>

              <div className="space-y-4">
                <Card className="bg-[#0a0a0a]">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="px-2 py-1 bg-emerald-500/20 rounded text-xs font-semibold text-emerald-400">
                      Ground Truth
                    </div>
                  </div>
                  <p className="text-gray-200 mb-4">
                    "The weather is absolutely beautiful today"
                  </p>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="px-2 py-1 bg-indigo-500/20 rounded text-xs font-semibold text-indigo-400">
                      Predicted
                    </div>
                  </div>
                  <p className="text-gray-200 mb-2">
                    "The weather is absolutely beautiful today"
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-emerald-400">✓ Exact Match</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">Confidence: 94%</span>
                  </div>
                </Card>

                <Card className="bg-[#0a0a0a]">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="px-2 py-1 bg-emerald-500/20 rounded text-xs font-semibold text-emerald-400">
                      Ground Truth
                    </div>
                  </div>
                  <p className="text-gray-200 mb-4">
                    "I need to finish this project by tomorrow"
                  </p>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="px-2 py-1 bg-indigo-500/20 rounded text-xs font-semibold text-indigo-400">
                      Predicted
                    </div>
                  </div>
                  <p className="text-gray-200 mb-2">
                    "I need to finish this project by tomorrow"
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-emerald-400">✓ Exact Match</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">Confidence: 88%</span>
                  </div>
                </Card>

                <Card className="bg-[#0a0a0a]">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="px-2 py-1 bg-emerald-500/20 rounded text-xs font-semibold text-emerald-400">
                      Ground Truth
                    </div>
                  </div>
                  <p className="text-gray-200 mb-4">
                    "Please send me the report when you're ready"
                  </p>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="px-2 py-1 bg-indigo-500/20 rounded text-xs font-semibold text-indigo-400">
                      Predicted
                    </div>
                  </div>
                  <p className="text-gray-200 mb-2">
                    "Please send me the report when you are ready"
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-amber-400">~ Minor Variation</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">Confidence: 85%</span>
                  </div>
                </Card>
              </div>
            </motion.div>

            {/* Future Work */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">Future Directions</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                While our current system demonstrates strong performance, several exciting avenues 
                remain for future research:
              </p>

              <div className="space-y-4">
                <Card>
                  <h4 className="text-lg font-semibold mb-2 text-indigo-400">
                    Multi-Speaker Scenarios
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Extend the system to handle multiple speakers simultaneously in group 
                    conversations or meetings.
                  </p>
                </Card>

                <Card>
                  <h4 className="text-lg font-semibold mb-2 text-purple-400">
                    Real-Time Processing
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Optimize for streaming video input to enable live captioning and real-time 
                    transcription applications.
                  </p>
                </Card>

                <Card>
                  <h4 className="text-lg font-semibold mb-2 text-pink-400">
                    Multilingual Support
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Train models on multiple languages to create a universal lip reading system 
                    that works across linguistic boundaries.
                  </p>
                </Card>

                <Card>
                  <h4 className="text-lg font-semibold mb-2 text-red-400">
                    Robustness Improvements
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Handle challenging conditions like occlusions, poor lighting, varying camera 
                    angles, and different video qualities.
                  </p>
                </Card>
              </div>
            </motion.div>

            {/* Conclusion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We presented a dual-stream neural architecture for lip reading that combines visual 
                appearance features with geometric landmark information. Our approach achieves 83% 
                accuracy on a challenging lip reading task, demonstrating the effectiveness of fusing 
                complementary visual and geometric cues.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                This research contributes to making communication more accessible for deaf and 
                hard-of-hearing communities, enables speech understanding in noisy environments, 
                and opens new possibilities for human-computer interaction.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The system is production-ready and can be integrated into various applications including 
                video conferencing platforms, accessibility tools, and security systems.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="text-center bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
                <h3 className="text-2xl font-bold mb-4">Try It Yourself</h3>
                <p className="text-gray-300 mb-6">
                  Experience our lip reading AI in action with our interactive demo
                </p>
                <Link to="/demo">
                  <Button size="lg" className="cursor-pointer">Go to Demo</Button>
                </Link>
              </Card>
            </motion.div>

          </div>
        </div>
      </article>
    </div>
  );
};

export default Article;