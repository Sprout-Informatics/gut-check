import { useState, useMemo, useCallback } from 'react'
import type { MicrobiomeSample, SequencingRead, SpeciesCategory } from '../simulation/types'
import { selectChallengeReads, TOTAL_READS, CHALLENGE_READ_COUNT } from '../simulation/sampling'
import { createRNG } from '../simulation/random'
import ReadCard from './ReadCard'
import SamplingResults from './SamplingResults'

type Phase = 'intro' | 'classify' | 'results'

interface SamplingModalProps {
  sample: MicrobiomeSample
  onClose: () => void
}

export default function SamplingModal({ sample, onClose }: SamplingModalProps) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [classifications, setClassifications] = useState<Record<number, SpeciesCategory>>({})

  // Select the subset of reads for the challenge (stable across renders)
  const challengeReads = useMemo<SequencingRead[]>(() => {
    const rng = createRNG(sample.tick * 7919 + 42)
    return selectChallengeReads(sample, rng)
  }, [sample])

  const classifiedCount = Object.keys(classifications).length
  const totalToClassify = challengeReads.length

  const correctCount = useMemo(() => {
    let correct = 0
    for (const read of challengeReads) {
      if (classifications[read.id] === read.category) correct++
    }
    return correct
  }, [classifications, challengeReads])

  const handleClassify = useCallback((readId: number, label: SpeciesCategory) => {
    setClassifications(prev => ({ ...prev, [readId]: label }))
  }, [])

  // Aggregate category percentages for the intro
  const categoryPcts = useMemo(() => {
    const totals = { commensal: 0, cdiff: 0, therapeutic: 0 }
    for (const sp of sample.species) {
      totals[sp.category] += sp.abundance
    }
    return totals
  }, [sample])

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 rounded-t-xl px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Metagenomic Sequencing</h2>
            <p className="text-sm text-gray-500">Sample taken on Day {sample.tick}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          {/* === INTRO PHASE === */}
          {phase === 'intro' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-800 mb-3">You've taken a gut microbiome sample!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  A stool sample has been collected and processed through whole metagenomic shotgun
                  sequencing, producing <strong>{TOTAL_READS} DNA reads</strong>. Each read is a
                  short fragment of bacterial DNA from one of the organisms living in the gut.
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Your task: examine {Math.min(CHALLENGE_READ_COUNT, sample.reads.length)} reads
                  and classify each one as coming from a <strong>commensal</strong> bacterium,
                  toxin-producing <strong><em>C. difficile</em></strong>, or a{' '}
                  <strong>therapeutic</strong> species introduced by microbiome therapy.
                </p>

                {/* Category summary cards */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {categoryPcts.commensal.toFixed(1)}%
                    </div>
                    <div className="text-xs text-green-600 mt-1">Commensal</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-red-700">
                      {categoryPcts.cdiff.toFixed(1)}%
                    </div>
                    <div className="text-xs text-red-600 mt-1">C. difficile</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-700">
                      {categoryPcts.therapeutic.toFixed(1)}%
                    </div>
                    <div className="text-xs text-purple-600 mt-1">Therapeutic</div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-3 italic">
                  Hint: These percentages tell you how common each type is — but can you identify
                  individual reads by their DNA sequence alone?
                </p>
              </div>

              <button
                onClick={() => setPhase('classify')}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Begin Classification
              </button>
            </div>
          )}

          {/* === CLASSIFY PHASE === */}
          {phase === 'classify' && (
            <div className="space-y-4">
              {/* Progress bar */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Classified: {classifiedCount} / {totalToClassify}
                </span>
                <span className="text-sm text-gray-500">
                  {correctCount} correct so far
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                <div
                  className="h-2 bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(classifiedCount / totalToClassify) * 100}%` }}
                />
              </div>

              {/* Read cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {challengeReads.map((read, i) => (
                  <ReadCard
                    key={read.id}
                    read={read}
                    index={i}
                    onClassify={handleClassify}
                  />
                ))}
              </div>

              {/* Submit / Continue */}
              <button
                onClick={() => setPhase('results')}
                disabled={classifiedCount < totalToClassify}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-4"
              >
                {classifiedCount < totalToClassify
                  ? `Classify all ${totalToClassify} reads to continue`
                  : 'View Results'}
              </button>
            </div>
          )}

          {/* === RESULTS PHASE === */}
          {phase === 'results' && (
            <div className="space-y-6">
              <SamplingResults
                sample={sample}
                correctCount={correctCount}
                totalClassified={classifiedCount}
              />
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Return to Simulation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
