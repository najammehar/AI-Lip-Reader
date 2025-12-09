import { motion } from 'framer-motion';
import { Brain, Eye, Layers, Database, TrendingUp, Target, Zap, GitBranch } from 'lucide-react';
import Card from '../components/Card';

const Details = () => {
  const sections = [
    {
      icon: Target,
      title: 'Executive Summary',
      content: [
        'Research-grade lip-reading system combining mouth shape (landmarks) and visual appearance (video frames)',
        'Dual-stream model: Vision Transformer (ViT) for landmarks + ResNet-18 for video',
        'Current status: Landmark ViT achieves ~51% validation accuracy on 100-word subset (vs 1% random)',
      ],
    },
    {
      icon: Brain,
      title: 'Problem & Motivation',
      content: [
        'Challenge: Understanding spoken words from visuals alone; many phonemes look similar (p/b/m)',
        'Impact: Helps accessibility, noisy environments, and privacy-preserving communication',
        'Gap: Existing systems rely heavily on visuals; geometric lip motion cues are underused',
      ],
    },
    {
      icon: Database,
      title: 'Dataset',
      content: [
        'Primary: LRW (Lip Reading in the Wild) - 500-word vocabulary, word-level labels',
        'Current subset: Top 100 words from cluster-0 candidates (~30K train+val samples)',
        'Frames: 29 per clip at 25 fps with consistent temporal normalization',
        'Future: LRS2 for sentence-level, open vocabulary lip reading',
      ],
    },
    {
      icon: Eye,
      title: 'Preprocessing Pipeline',
      content: [
        'Landmark extraction: MediaPipe FaceMesh with 50 points (40 lip + 10 chin)',
        'Normalization: Center at mouth, scale by width for speaker invariance',
        'Temporal standardization: Pad/trim to 29 frames for consistent batching',
        'Data format: NumPy arrays with shape (N, 29, 50, 3) for x, y, z coordinates',
      ],
    },
    {
      icon: Layers,
      title: 'Architecture Design',
      content: [
        'Dual-stream philosophy: Appearance (pixels) + Geometry (landmarks) are complementary',
        'Visual stream: ResNet-18 processes video frames for texture and appearance cues',
        'Geometric stream: Landmark ViT with 4 layers, 4 heads for temporal modeling',
        'Fusion: Concatenate per-frame features (768 dims) and project to 512 dims',
        'Optional: Conformer for enhanced temporal sequence modeling',
      ],
    },
    {
      icon: Brain,
      title: 'Geometric Stream (ViT)',
      content: [
        'Input: (B, 29, 50, 3) landmarks flattened to 150 dims per frame',
        'Embedding: Project to 256-dim tokens with learned positional encodings',
        'Transformer: 4 layers, 4 heads, pre-norm, MLP expansion 4×, dropout 0.1',
        'Pooling: Mean over time → 256-dim utterance vector',
        'Result: ~51% validation accuracy on 100-word subset (1% random baseline)',
      ],
    },
    {
      icon: GitBranch,
      title: 'Fusion Strategy',
      content: [
        'Extract per-frame features from both streams (ResNet: 512 dims, ViT: 256 dims)',
        'Concatenate to 768 dims and project to 512 dims for efficiency',
        'Optional Conformer layer for richer temporal context across fused features',
        'Mean/attention pooling over time followed by classifier for word prediction',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Training Strategy',
      content: [
        'Loss: Cross-entropy for word classification',
        'Optimizer: AdamW with cosine learning rate schedule and weight decay 1e-4',
        'Regularization: Dropout 0.1, gradient clipping 1.0 for stability',
        'Batching: 64 clips × 29 frames each for efficient GPU utilization',
        'Hardware: Single GPU (Colab T4/V100/A100) with ~15-20 min training time',
      ],
    },
    {
      icon: Zap,
      title: 'Current Progress',
      content: [
        '✅ Preprocessing pipeline complete for 100-word LRW subset',
        '✅ Landmark ViT trained with 51% validation accuracy',
        '✅ Data artifacts ready for deployment and integration',
        '🔄 ResNet-18 visual stream training in progress',
        '📋 Next: Implement fusion head and train dual-stream model',
        '🎯 Target: 65-75% accuracy on 100-word subset, then scale to full LRW',
      ],
    },
  ];

  const stats = [
    { label: 'Model Accuracy', value: '51%', description: 'Landmark ViT on 100-word subset' },
    { label: 'Vocabulary', value: '100', description: 'Words in current subset' },
    { label: 'Training Samples', value: '~30K', description: 'Train + validation clips' },
    { label: 'Frames', value: '29', description: 'Per video clip' },
    { label: 'Landmarks', value: '50', description: '40 lip + 10 chin points' },
    { label: 'ViT Layers', value: '4', description: 'Transformer encoder depth' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">
            Research <span className="text-gradient">Details</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive overview of our lip-reading research project, architecture, and methodology
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16"
        >
          {stats.map((stat, index) => (
            <Card key={index} hover={false} className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-white mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-gray-400">
                {stat.description}
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Detailed Sections */}
        <div className="max-w-5xl mx-auto space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <section.icon size={24} className="text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                    <ul className="space-y-3">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <span className="text-indigo-500 mt-1.5 shrink-0">•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Architecture Diagram Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <Card glow>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Layers className="text-indigo-500" size={28} />
              System Architecture Overview
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded">
                <div className="w-10 h-10 rounded bg-indigo-500/20 flex items-center justify-center">
                  <span className="text-indigo-500 font-bold">1</span>
                </div>
                <div>
                  <div className="font-semibold text-white">Video Input</div>
                  <div className="text-sm text-gray-400">29 frames, 25 fps, speaker-normalized</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded">
                <div className="w-10 h-10 rounded bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-500 font-bold">2</span>
                </div>
                <div>
                  <div className="font-semibold text-white">Dual Stream Processing</div>
                  <div className="text-sm text-gray-400">ResNet-18 (appearance) + ViT (geometry)</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded">
                <div className="w-10 h-10 rounded bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-emerald-500 font-bold">3</span>
                </div>
                <div>
                  <div className="font-semibold text-white">Feature Fusion</div>
                  <div className="text-sm text-gray-400">Concatenate + project (768 → 512 dims)</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded">
                <div className="w-10 h-10 rounded bg-amber-500/20 flex items-center justify-center">
                  <span className="text-amber-500 font-bold">4</span>
                </div>
                <div>
                  <div className="font-semibold text-white">Classification</div>
                  <div className="text-sm text-gray-400">Temporal pooling → word prediction</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Future Directions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <Card>
            <h2 className="text-2xl font-bold mb-6">Future Directions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-indigo-500 mb-3">Short-term Goals</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-1">→</span>
                    <span>Complete dual-stream fusion and achieve 65-75% accuracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-1">→</span>
                    <span>Scale to full LRW dataset (500 words)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-1">→</span>
                    <span>Optimize inference pipeline for real-time processing</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-purple-500 mb-3">Long-term Vision</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">→</span>
                    <span>Extend to sentence-level with CTC/seq2seq on LRS2</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">→</span>
                    <span>Improve robustness to occlusions and diverse speakers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">→</span>
                    <span>Deploy real-time demo application</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Details;
