import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

const Article = () => {
  return (
    <div className="min-h-screen">
      {/* Article Header — REWRITTEN */}
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
              Dual-Stream Visual Speech Recognition via Geometric and Appearance Fusion
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>Research Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>May 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>18 min read</span>
              </div>
            </div>

            <p className="text-xl text-gray-300 leading-relaxed">
              We present a dual-stream neural architecture for visual speech recognition (VSR) that
              combines facial landmark geometry with RGB appearance features. Motivated by two core
              hypotheses — that geometric information alone provides a meaningful signal, and that
              fusing landmarks with appearance improves over either modality in isolation — we conduct
              a systematic experimental study across two benchmarks: LRW (word-level) and LRS2
              (sentence-level).
            </p>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-lg max-w-none">

            {/* 1. Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Visual speech recognition — commonly called automatic lip reading — is the task of
                inferring spoken language from video alone, without any audio signal. It is a genuinely
                hard perceptual problem: many phonemes share near-identical mouth shapes (e.g., /p/, /b/,
                and /m/ are visually indistinct), speakers vary enormously in articulation style, and the
                informative region is a small, fast-moving patch inside a larger scene.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Despite these challenges, VSR has seen rapid progress in recent years, driven by
                large-scale datasets and deep learning. Approaches based on 3D convolutional networks
                paired with sequence models now achieve competitive word error rates on sentence-level
                benchmarks. Yet the dominant paradigm relies exclusively on raw pixel appearance —
                treating lip reading as an image recognition problem scaled to video.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                An alternative tradition, motivated by how humans perform lip reading, focuses on the
                geometric configuration of the mouth: the relative positions of the lips, teeth, and jaw
                over time. Sparse landmark representations are compact, speaker-agnostic by construction,
                and far cheaper to compute than dense feature maps. The question is whether they carry
                enough discriminative signal to be useful on their own.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This work is organised around two hypotheses. First, that facial landmark trajectories
                alone contain sufficient information to provide a non-trivial lip reading signal. Second,
                that combining landmark geometry with an appearance stream improves over either modality
                in isolation. We test both hypotheses through a controlled experimental programme on LRW
                (word-level classification) and LRS2 (sentence-level recognition with CTC decoding),
                reporting standalone baselines for each stream before evaluating fusion.
              </p>
            </motion.div>

            {/* Problem Statement */}
            {/* 2. Datasets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">2. Datasets</h2>

              <h3 className="text-xl font-semibold mb-4 text-indigo-300">2.1 Lip Reading in the Wild (LRW)</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                LRW is a large-scale word-level dataset sourced from BBC broadcast footage. It contains
                approximately 488,000 clips across a 500-word vocabulary, each clip lasting roughly one
                second at 25 fps and centred on the target word spoken in natural continuous speech.
                The in-the-wild nature of the data introduces significant variation in lighting, pose,
                and speaker identity, making it a challenging and realistic benchmark for word-level VSR.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                For early ablation experiments we worked with a curated 100-word subset (LRW-100),
                selected from LRW using a phoneme-based informativeness scoring pipeline described in
                Section 3. Full LRW-500 experiments establish the landmark-only and appearance-only
                baselines reported in Section 5.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Card hover={false} className="text-center">
                  <div className="text-3xl font-bold text-gradient mb-2">500</div>
                  <div className="text-sm text-gray-400">Word Vocabulary</div>
                </Card>
                <Card hover={false} className="text-center">
                  <div className="text-3xl font-bold text-gradient mb-2">~488K</div>
                  <div className="text-sm text-gray-400">Total Clips</div>
                </Card>
                <Card hover={false} className="text-center">
                  <div className="text-3xl font-bold text-gradient mb-2">29</div>
                  <div className="text-sm text-gray-400">Frames per Clip</div>
                </Card>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-indigo-300">2.2 Lip Reading Sentences 2 (LRS2)</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                LRS2 is a sentence-level benchmark also derived from BBC programming. Unlike LRW,
                it requires open-vocabulary recognition over variable-length utterances, making it
                substantially harder. We use the Pretrain and Main splits. The Pretrain set contains
                longer, noisier clips; the Main set provides shorter, cleaner utterances used for
                fine-tuning and final evaluation.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                The appearance stream is trained on LRS2 using connectionist temporal classification
                (CTC) with a 38-character vocabulary (A–Z, digits, space, apostrophe) plus a blank
                token, for 39 output classes in total. Training on LRS2 tests generalization to
                conversational sentence-level speech rather than controlled single-word clips.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Curriculum learning is applied during Pretrain training: clips are initially filtered
                to transcripts of 50 characters or fewer, with the length cap relaxed gradually as the
                model converges. This stabilizes early CTC optimization by preventing blank collapse
                on very long sequences.
              </p>
            </motion.div>

            {/* 3. Dataset Curation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">3. Dataset Curation: LRW-100</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                To accelerate landmark stream ablations without training on the full 500-word vocabulary,
                we designed a scoring pipeline to identify the 100 most linguistically informative words
                in LRW. The pipeline assigns each word a score based on four components:
              </p>

              <Card className="bg-[#0a0a0a] mb-6">
                <div className="font-mono text-sm text-indigo-300 mb-3">Scoring Formula</div>
                <div className="font-mono text-base text-white bg-[#111111] rounded p-4 leading-loose">
                  final_score = num_clips × avg_duration<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;× visibility_score<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;× (1 + transition_count)
                </div>
              </Card>

              <p className="text-gray-300 leading-relaxed mb-4">
                Phoneme visibility scores are derived from CMUdict: each phoneme is assigned a
                lip-visibility rating reflecting how distinctly it is articulated, and a word's
                visibility score is the mean across its phonemes. The transition count rewards words
                with varied and distinct mouth movement sequences. Words with high scores offer more
                discriminative geometric signal per training sample.
              </p>
              <p className="text-gray-300 leading-relaxed">
                K-means clustering (k=2) applied to the scored LRW training split with features
                weighted toward the phoneme dimensions yields two natural groups. The 100 words
                selected from the high-information cluster represent the hardest and most visually
                distinctive subset of the vocabulary — intentionally a more challenging benchmark
                than random 100-word sampling.
              </p>
            </motion.div>

            {/* 4. Architecture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">4. System Architecture</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                The system comprises two independently designed and trained streams that are ultimately
                combined via a fusion module. Each stream is described below.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-indigo-300">4.1 Landmark Stream</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                MediaPipe FaceMesh extracts 50 facial landmarks per frame: 40 around the lip contour
                and 10 along the chin. Chin landmarks capture jaw drop — a key articulatory signal
                often missed by lip-only approaches. Each frame's landmarks are normalized by
                subtracting the centroid and dividing by the mouth width, making the representation
                pose- and scale-invariant. All clips are padded or truncated to exactly 29 frames,
                yielding a tensor of shape (29, 50, 3) per sample.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                The 50 landmarks are flattened per frame to a 150-dimensional vector. A two-layer
                MLP (150→256→256, ReLU activations, dropout 0.3) projects each frame's landmark
                vector into a shared embedding space. A two-layer Transformer encoder (4 heads,
                FFN expansion 256→512→256) then models cross-frame relationships. A two-layer
                bidirectional LSTM (hidden size 256) captures sequential dynamics, and a linear
                classifier maps the final hidden state to class logits.
              </p>

              <Card className="bg-[#0a0a0a] mb-8">
                <div className="font-mono text-sm text-gray-400 mb-3">Landmark Stream Pipeline</div>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-indigo-500/20 rounded text-indigo-300 shrink-0">Input</span>
                    <span className="text-gray-300">(B, 29, 50, 3) → flatten → (B, 29, 150)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-purple-500/20 rounded text-purple-300 shrink-0">MLP</span>
                    <span className="text-gray-300">150 → 256 → 256 per frame</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-pink-500/20 rounded text-pink-300 shrink-0">Transformer</span>
                    <span className="text-gray-300">2 layers, 4 heads, FFN 512</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-red-500/20 rounded text-red-300 shrink-0">BiLSTM</span>
                    <span className="text-gray-300">2 layers, hidden 256, bidirectional → 512</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-orange-500/20 rounded text-orange-300 shrink-0">Output</span>
                    <span className="text-gray-300">Linear → class logits</span>
                  </div>
                </div>
              </Card>

              <h3 className="text-xl font-semibold mb-4 text-indigo-300">4.2 Appearance Stream</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Video frames are converted to grayscale and resized to 96×96 pixels. The appearance
                stream uses the standard MC3D frontend — a single large Conv3D layer
                (1→64 channels, kernel 5×7×7, stride 1×2×2) followed by max pooling — which has
                become the de facto preprocessing block in competitive LRS2 work. The output
                feature maps at each timestep are then processed by a ResNet-18 backbone applied
                per frame, whose first convolution is modified to accept the 64-channel MC3D output
                and whose initial max-pooling is removed to preserve spatial resolution.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                The ResNet-18 is initialized from ImageNet pretrained weights, providing a strong
                visual prior. Its output is a 512-dimensional feature vector per timestep, which is
                fed into a two-layer bidirectional LSTM (hidden size 256, dropout 0.3). For
                sentence-level recognition, a linear head maps LSTM outputs to 39 character classes
                and training uses CTC loss with an alignment guard to prevent numerical explosion.
              </p>

              <Card className="bg-[#0a0a0a] mb-8">
                <div className="font-mono text-sm text-gray-400 mb-3">Appearance Stream Pipeline</div>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-indigo-500/20 rounded text-indigo-300 shrink-0">Input</span>
                    <span className="text-gray-300">(B, T, 1, 96, 96) grayscale video</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-purple-500/20 rounded text-purple-300 shrink-0">MC3D</span>
                    <span className="text-gray-300">Conv3D(1→64, 5×7×7) + MaxPool → (B, 64, T, 24, 24)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-pink-500/20 rounded text-pink-300 shrink-0">ResNet-18</span>
                    <span className="text-gray-300">Per-frame, modified input conv → (B, T, 512)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-red-500/20 rounded text-red-300 shrink-0">BiLSTM</span>
                    <span className="text-gray-300">2 layers, hidden 256, dropout 0.3 → (B, T, 512)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-orange-500/20 rounded text-orange-300 shrink-0">Output</span>
                    <span className="text-gray-300">Linear → 39 character classes, CTC decode</span>
                  </div>
                </div>
              </Card>

              <h3 className="text-xl font-semibold mb-4 text-indigo-300">4.3 Fusion</h3>
              <p className="text-gray-300 leading-relaxed">
                Features are extracted from each stream before the final classification layer.
                We evaluate three fusion strategies: (i) simple concatenation of the two feature
                vectors followed by an MLP classifier; (ii) cross-attention, where one stream's
                features attend over the other; and (iii) multi-head attention treating the two
                feature sets as a joint sequence. Fusion experiments use LRW for controlled
                ablation and LRS2 for sentence-level generalization.
              </p>
            </motion.div>

            {/* 5. Experimental Findings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">5. Experimental Findings</h2>

              <h3 className="text-xl font-semibold mb-4 text-indigo-300">5.1 Landmark Stream — Ablations (LRW-100)</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Nineteen experiments were run on LRW-100 and LRW-500 to understand how architectural
                choices affect landmark-only performance. The key findings are:
              </p>

              <div className="space-y-4 mb-8">
                <Card className="border-l-2 border-indigo-500 rounded-l-none">
                  <h4 className="font-semibold text-indigo-300 mb-2">Sequential modelling is essential</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    A simple MLP with mean-pooling across the time dimension fails completely (under 7%
                    validation accuracy), confirming that lip reading is an inherently sequential task.
                    Adding a BiLSTM to the same MLP immediately raises performance substantially, and
                    further adding a Transformer encoder approaches the performance ceiling of the landmark modality.
                  </p>
                </Card>

                <Card className="border-l-2 border-purple-500 rounded-l-none">
                  <h4 className="font-semibold text-purple-300 mb-2">Architecture-agnostic performance ceiling</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Two radically different architectures converge to the same peak on LRW-100: a Vision
                    Transformer treating landmarks as a spatial point set (no flattening, no BiLSTM)
                    achieves 61.6%, while the MLP-Transformer-BiLSTM pipeline achieves 62.7%. Adding
                    more Transformer layers, widening the MLP, or training for more epochs does not break
                    through this ceiling. This strongly suggests the limit is a property of the landmark
                    features themselves, not the model capacity.
                  </p>
                </Card>

                <Card className="border-l-2 border-pink-500 rounded-l-none">
                  <h4 className="font-semibold text-pink-300 mb-2">Landmarks are incompatible with geometric augmentation</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Standard spatial augmentations (flipping, cropping, scale jitter, coordinate noise)
                    severely hurt performance when applied to the landmark stream. Unlike pixel-space
                    augmentation on images, geometric perturbations distort the normalized coordinates
                    that encode articulatory shape — destroying precisely the signal the model is trying
                    to learn. Gentle augmentation also degrades performance, confirming that landmarks
                    are too semantically dense for regularisation via perturbation.
                  </p>
                </Card>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-indigo-300">5.2 Landmark Stream — LRW-500</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Scaling from 100 to 500 words reveals a hard vocabulary limit. Approximately 110 short,
                visually ambiguous words achieve near-zero accuracy regardless of training duration.
                These are predominantly function words and high-frequency monosyllables — words like
                <em> about</em>, <em>across</em>, and <em>action</em> — whose articulatory shapes are
                not reliably distinguished by the lip and chin landmark set. Confusion analysis shows
                near-homophone pairs (e.g., <em>billion/million</em>) account for a disproportionate
                share of errors.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Warm-starting from an LRW-100 checkpoint did not improve LRW-500 performance — training
                from scratch proved more effective. The 100-word model appears to have learned biases
                toward the selected high-information vocabulary that do not transfer cleanly to the
                broader distribution. This is consistent with the fact that LRW-100 was deliberately
                chosen to be harder and more phonemically distinctive than the average LRW word.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Card hover={false}>
                  <div className="text-sm text-gray-400 mb-2">Landmark-Only Baseline</div>
                  <div className="text-lg font-semibold text-white mb-1">LRW-500 — Validated</div>
                  <div className="text-sm text-gray-300">
                    Geometric features alone provide a real, reproducible signal across the full
                    vocabulary — establishing Hypothesis 1 as validated.
                  </div>
                </Card>
                <Card hover={false}>
                  <div className="text-sm text-gray-400 mb-2">Appearance-Only Baseline</div>
                  <div className="text-lg font-semibold text-white mb-1">LRW-500 — Validated</div>
                  <div className="text-sm text-gray-300">
                    The MC3D + ResNet-18 appearance stream substantially outperforms the landmark
                    stream but struggles with the same visually ambiguous word pairs.
                  </div>
                </Card>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-indigo-300">5.3 Appearance Stream — LRS2</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                A lightweight custom 3D CNN frontend trained on LRS2 for 120 epochs plateaued at a
                validation loss of ~2.98, confirming an architecture capacity ceiling: the shallow
                frontend cannot represent complex spatiotemporal lip dynamics regardless of training
                duration or learning rate adjustment.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Replacing the custom frontend with MC3D + ResNet-18 immediately reduces validation
                loss. Pretrain training on clips of up to 50 characters converges to a lower loss,
                and relaxing the length cap for full Pretrain data reduces it further. The model is
                currently being fine-tuned on LRS2 Main for final character error rate (CER) and
                word error rate (WER) evaluation against published benchmarks.
              </p>

              <Card className="bg-indigo-500/5 border-indigo-500/20">
                <h4 className="text-lg font-semibold mb-3 text-indigo-300">LRS2 Training Configuration</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div><span className="text-gray-400">Optimizer:</span> AdamW</div>
                  <div><span className="text-gray-400">LR (Pretrain):</span> 1e-3, ReduceLROnPlateau</div>
                  <div><span className="text-gray-400">Effective Batch:</span> 16 (2 × 8 accumulation steps)</div>
                  <div><span className="text-gray-400">Loss:</span> CTC (blank=0, zero_infinity=True)</div>
                  <div><span className="text-gray-400">Curriculum:</span> ≤50 chars → full Pretrain</div>
                  <div><span className="text-gray-400">Hardware:</span> NVIDIA L4 (GCP)</div>
                </div>
              </Card>
            </motion.div>

            {/* 6. Key Observations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">6. Key Observations</h2>

              <div className="space-y-6">
                <Card>
                  <h4 className="text-lg font-semibold mb-2 text-indigo-400">
                    Hypothesis 1 validated: geometric features carry a real signal
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    The landmark stream consistently achieves meaningful accuracy across multiple
                    architectural variants on both LRW-100 and LRW-500. The signal is robust and
                    reproducible: a ceiling emerges at similar performance regardless of whether
                    landmarks are processed spatially (ViT) or as per-frame coordinate vectors
                    (MLP+Transformer+BiLSTM). This validates our first hypothesis and justifies the
                    landmark stream as a meaningful input to a fusion model.
                  </p>
                </Card>

                <Card>
                  <h4 className="text-lg font-semibold mb-2 text-purple-400">
                    Correlated difficulty — fusion must be intelligent
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Both streams fail on a similar set of visually ambiguous words — particularly
                    near-homophones and short high-frequency words. This correlation implies that
                    naive concatenation may not resolve the shared failure modes. Cross-attention
                    fusion, which lets each stream selectively query the other, is our primary
                    hypothesis for addressing this.
                  </p>
                </Card>

                <Card>
                  <h4 className="text-lg font-semibold mb-2 text-pink-400">
                    Feature ceiling as a property of the modality
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    The convergence of two fundamentally different architectures to nearly identical
                    validation accuracy on LRW-100 is strong evidence that the performance ceiling
                    is determined by the landmark features, not the model capacity. This has a clear
                    design implication: further investment in landmark-only architectures is unlikely
                    to break through, and the priority should shift to fusion with the appearance stream.
                  </p>
                </Card>

                <Card>
                  <h4 className="text-lg font-semibold mb-2 text-red-400">
                    Architecture matters for the appearance stream
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    The LRS2 experiments show a clear step-change between the custom 3D CNN (shallow,
                    plateaued) and the MC3D + ResNet-18 combination (still improving). Unlike the
                    landmark stream — where the ceiling is a feature property — the appearance stream
                    has headroom that requires sufficient model capacity to realise.
                  </p>
                </Card>
              </div>
            </motion.div>

            {/* 7. Future Work */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">7. Future Directions</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                The immediate next steps are: completing LRS2 fine-tuning for a final WER baseline,
                then evaluating all three fusion strategies on LRW with a controlled ablation table.
                Longer-term directions include:
              </p>

              <div className="space-y-4">
                <Card>
                  <h4 className="text-lg font-semibold mb-2 text-indigo-400">
                    Transformer temporal modelling in the appearance stream
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Replacing the BiLSTM with a Transformer encoder to evaluate whether self-attention
                    better captures long-range coarticulation cues compared to recurrence — a
                    comparison motivated by recent strong results in audio-visual speech recognition.
                  </p>
                </Card>

                <Card>
                  <h4 className="text-lg font-semibold mb-2 text-purple-400">
                    Richer landmark representations
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Exploring graph neural networks over the landmark mesh, velocity and acceleration
                    features derived from landmark trajectories, or learned normalisation schemes
                    that go beyond mean-subtraction and mouth-width scaling.
                  </p>
                </Card>

                <Card>
                  <h4 className="text-lg font-semibold mb-2 text-pink-400">
                    Sentence-level fusion on LRS2
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Extending fusion beyond LRW word classification to full sentence-level CTC
                    decoding on LRS2, comparing WER against appearance-only and published
                    landmark-augmented baselines from the literature.
                  </p>
                </Card>

                <Card>
                  <h4 className="text-lg font-semibold mb-2 text-red-400">
                    Robustness to pose and occlusion
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Both streams currently assume near-frontal face alignment. Evaluating degradation
                    under varying head pose and partial occlusion, and training with appropriate
                    augmentation strategies, is a critical step toward real-world deployment.
                  </p>
                </Card>
              </div>
            </motion.div>

            {/* 8. Conclusion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">8. Conclusion</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We presented a dual-stream architecture for visual speech recognition that separates
                landmark geometry and pixel appearance into two independently trained streams, then
                combines them via a learned fusion module. Through a systematic study of nearly twenty
                architectural variants on LRW-100 and LRW-500, we established that facial landmark
                trajectories alone provide a robust and reproducible signal whose ceiling appears to be
                a property of the feature representation rather than the model. We validated this across
                two fundamentally different architectures converging to the same accuracy.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Scaling to LRW-500 confirmed the landmark stream's contribution and revealed a hard
                limit on visually ambiguous vocabulary — a limit the appearance stream also faces on
                the same words. This correlated difficulty motivates the fusion hypothesis: the two
                streams must be combined intelligently, not simply concatenated, to resolve the shared
                failure modes.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The appearance stream, trained on LRS2 with the MC3D + ResNet-18 architecture,
                continues to improve and is approaching the fine-tuning stage. Together with the
                finalized landmark stream baselines, this positions the project to evaluate all
                three fusion strategies and report controlled ablation results across both benchmarks.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="text-center bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
                <h3 className="text-2xl font-bold mb-4">Try the Demo</h3>
                <p className="text-gray-300 mb-6">
                  Explore the preprocessing and inference pipeline interactively with the landmark extraction demo
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
